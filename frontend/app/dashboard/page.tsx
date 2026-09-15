'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandLockup from '@/components/BrandLockup';
import {
    buildAuthHeader,
    clearAuthSession,
    getAuthToken,
    getStoredUser,
    saveAuthSession
} from '@/lib/authSession';
import { API_BASE_URL, apiJsonRequest, apiRequest } from '@/lib/apiClient';
import {
    EMAIL_RULE,
    USERNAME_RULE,
    SECURE_PASSWORD_RULE,
    isValidGmail,
    isValidUsername,
    isValidSecurePassword,
    normalizeEmail,
    normalizeUsername
} from '@/lib/authValidation';

interface User {
    id: string;
    username: string;
    fullName?: string;
    name?: string;
    email: string;
    role: string;
    memberType?: string;
    regNo?: string;
    expiryDate?: string;
    cpdCredits?: number;
    renewalPeriod?: number;
    createdAt?: string;
    updatedAt?: string;
}

interface MembershipApplication {
    id: string;
    fullName: string;
    email: string;
    phone?: string;
    nationalIdNumber?: string;
    membershipGrade: string;
    organizationName?: string;
    yearsOfExperience?: number | null;
    bio?: string;
    declarationAccepted?: boolean;
    stage: string;
    decision: string;
    rejectionReason?: string | null;
    registrationNumber?: string | null;
    certificateNumber?: string | null;
    validUntil?: string | null;
    applicantId?: string;
    documents?: Array<{ id: string; type: string; fileName: string }>;
    reviews?: Array<{ id: string; action: string; notes?: string; performedBy: string; createdAt: string }>;
    renewals?: Array<{ id: string; status: string; cpdCredits: number; feePaid: boolean; requestedAt: string }>;
    createdAt: string;
}

interface RegisterMember {
    id: string;
    fullName: string;
    email: string;
    membershipGrade: string;
    decision: 'APPROVED' | 'REJECTED' | string;
    rejectionReason?: string | null;
    registrationNumber?: string | null;
    certificateNumber?: string | null;
    validUntil?: string | null;
}

interface CredentialItem {
    id: string;
    name: string;
    type: string;
    verifiedOn: string;
}

const APPLICATION_STAGES = [
    'SUBMITTED',
    'SCREENING',
    'TECHNICAL_REVIEW',
    'GRADE_RECOMMENDED',
    'PAYMENT_PENDING',
    'PAYMENT_CONFIRMED',
    'CERTIFICATE_ISSUED',
    'REGISTERED'
] as const;

const extractApiMessage = (data: unknown): string | null => {
    if (typeof data === 'string' && data.trim().length > 0) {
        return data;
    }

    if (data && typeof data === 'object' && 'message' in data) {
        const message = (data as { message?: string | string[] }).message;
        if (Array.isArray(message)) {
            return message.join(', ');
        }
        if (typeof message === 'string') {
            return message;
        }
    }

    return null;
};

export default function DashboardPage() {
    const router = useRouter();
    // User profile shown in dashboard UI.
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [myApplications, setMyApplications] = useState<MembershipApplication[]>([]);
    const [isMyApplicationsLoading, setIsMyApplicationsLoading] = useState(false);
    const [myApplicationsError, setMyApplicationsError] = useState('');
    const [adminApplications, setAdminApplications] = useState<MembershipApplication[]>([]);
    const [registerMembers, setRegisterMembers] = useState<RegisterMember[]>([]);
    const [isAdminLoading, setIsAdminLoading] = useState(false);
    const [adminError, setAdminError] = useState('');
    const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);
    const [stageDraft, setStageDraft] = useState<string>('SUBMITTED');
    const [stageNote, setStageNote] = useState('');
    const [isUpdatingStage, setIsUpdatingStage] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [toast, setToast] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isMemberCardVisible, setIsMemberCardVisible] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [profileDraft, setProfileDraft] = useState({
        username: '',
        fullName: '',
        email: ''
    });
    const [passwordDraft, setPasswordDraft] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [downloadingOwnDocId, setDownloadingOwnDocId] = useState<string | null>(null);
    const [credentials, setCredentials] = useState<CredentialItem[]>([
        { id: 'cred-1', name: 'Degree_Certificate_Verified.pdf', type: 'ACADEMIC RECORD', verifiedOn: 'AUG 12, 2023' },
        { id: 'cred-2', name: 'CPD_Structural_WS.pdf', type: 'CPD CERTIFICATE', verifiedOn: 'MAY 05, 2024' }
    ]);
    const uploadInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        // On page load:
        // - verify token/session exists
        // - refresh profile from /auth/me when possible
        const syncUser = async () => {
            const token = getAuthToken();
            const localUser = getStoredUser<User>();

            if (!token || !localUser) {
                router.push('/login');
                return;
            }

            try {
                const response = await apiRequest<{ user: Partial<User> }>('/auth/me', {
                    headers: buildAuthHeader(token)
                });

                if (response.ok) {
                    // Merge fresh backend profile into local cache.
                    const merged = { ...localUser, ...(response.data?.user || {}) };
                    saveAuthSession(token, merged);
                    setUser(merged);
                } else {
                    // Expired/invalid token should force re-authentication.
                    if (response.status === 401) {
                        clearAuthSession();
                        router.push('/login');
                        return;
                    }
                    // Fallback to local cached user for non-auth failures.
                    setUser(localUser);
                }
            } catch {
                // Offline / network fallback.
                setUser(localUser);
            } finally {
                setIsLoading(false);
            }
        };

        syncUser();
    }, [router]);

    const loadAdminApplications = async () => {
        if (!user || user.role !== 'ADMIN') {
            setAdminApplications([]);
            setRegisterMembers([]);
            setAdminError('');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            return;
        }

        setIsAdminLoading(true);
        setAdminError('');
        try {
            const applicationsRes = await apiRequest<MembershipApplication[]>('/memberships/applications', {
                headers: buildAuthHeader(token)
            });

            if (applicationsRes.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (applicationsRes.status === 403) {
                setAdminError('Admin access required to view membership applications.');
                return;
            }

            if (!applicationsRes.ok) {
                setAdminError('Unable to load membership applications.');
                return;
            }

            const registerRes = await apiRequest<RegisterMember[]>('/memberships/register', {
                headers: buildAuthHeader(token)
            });

            if (registerRes.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (registerRes.status === 403) {
                setAdminError('Admin access required to view register records.');
                return;
            }

            if (!registerRes.ok) {
                setAdminError('Unable to load register records.');
                return;
            }

            setRegisterMembers(Array.isArray(registerRes.data) ? registerRes.data : []);
            setAdminApplications(Array.isArray(applicationsRes.data) ? applicationsRes.data : []);
        } catch {
            setAdminError('Network error while loading control center data.');
        } finally {
            setIsAdminLoading(false);
        }
    };

    const loadOwnApplications = async () => {
        if (!user || user.role === 'REVIEWER') {
            setMyApplications([]);
            setMyApplicationsError('');
            return;
        }

        const token = getAuthToken();
        if (!token) {
            return;
        }

        setIsMyApplicationsLoading(true);
        setMyApplicationsError('');
        try {
            const response = await apiRequest<MembershipApplication[]>('/memberships/my-applications', {
                headers: buildAuthHeader(token)
            });

            if (response.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (response.status === 403) {
                setMyApplicationsError('You are not allowed to view these records.');
                return;
            }

            if (!response.ok) {
                setMyApplicationsError('Unable to load your uploaded applications.');
                return;
            }

            setMyApplications(Array.isArray(response.data) ? response.data : []);
        } catch {
            setMyApplicationsError('Network error while loading your applications.');
        } finally {
            setIsMyApplicationsLoading(false);
        }
    };

    useEffect(() => {
        loadAdminApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, router]);

    useEffect(() => {
        loadOwnApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, router]);

    useEffect(() => {
        if (!user) {
            return;
        }
        setProfileDraft({
            username: user.username || '',
            fullName: user.fullName || user.name || '',
            email: user.email || ''
        });
    }, [user]);

    useEffect(() => {
        if (!toast) {
            return;
        }
        const timer = setTimeout(() => setToast(''), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    useEffect(() => {
        if (!selectedApplication) {
            setStageDraft('SUBMITTED');
            setStageNote('');
            return;
        }
        setStageDraft(selectedApplication.stage || 'SUBMITTED');
        setStageNote('');
    }, [selectedApplication]);

    const isPrivilegedUser = user?.role === 'ADMIN';
    const isRegisterOnlyView = user?.role === 'ADMIN';

    const categoryCounts = adminApplications.reduce<Record<string, number>>((acc, item) => {
        const grade = item.membershipGrade || 'UNKNOWN';
        acc[grade] = (acc[grade] || 0) + 1;
        return acc;
    }, {});
    const approvedRegisterCount = registerMembers.filter((member) => member.decision === 'APPROVED').length;
    const rejectedRegisterCount = registerMembers.filter((member) => member.decision === 'REJECTED').length;
    const finalizedRegisterMembers = registerMembers.filter((member) => member.decision === 'APPROVED' || member.decision === 'REJECTED');

    // Client logout simply clears local auth state.
    const handleLogout = () => {
        clearAuthSession();
        router.push('/login');
    };

    const showToast = (message: string) => {
        setToast(message);
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleSidebarNavigation = (id: string) => {
        scrollToSection(id);
        if (window.innerWidth <= 768) {
            setIsSidebarOpen(false);
        }
    };

    const handleShareProfile = async () => {
        if (!user) {
            return;
        }
        const shareText = `${user.fullName || user.name} | ${user.role} | ${user.email}`;
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'IES Member Profile',
                    text: shareText,
                    url: window.location.href
                });
                showToast('Profile shared.');
                return;
            }
            await navigator.clipboard.writeText(`${shareText}\n${window.location.href}`);
            showToast('Profile link copied.');
        } catch {
            showToast('Unable to share profile right now.');
        }
    };

    const handleSaveProfile = () => {
        if (!user) {
            return;
        }
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const username = normalizeUsername(profileDraft.username);
        const fullName = profileDraft.fullName.trim();
        const email = normalizeEmail(profileDraft.email);

        if (!isValidUsername(username)) {
            showToast(USERNAME_RULE);
            return;
        }

        if (fullName.length < 2) {
            showToast('Full name must be at least 2 characters.');
            return;
        }

        if (!isValidGmail(email)) {
            showToast(EMAIL_RULE);
            return;
        }

        const updateProfile = async () => {
            const response = await apiJsonRequest<{
                user?: Partial<User>;
                nextProfileUpdateAt?: string;
                message?: string | string[];
            }>('/auth/me', 'PATCH', {
                username,
                fullName,
                email
            }, {
                headers: buildAuthHeader(token)
            });

            if (response.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (!response.ok || !response.data?.user) {
                showToast(
                    extractApiMessage(response.data) || 'Unable to update profile right now.'
                );
                return;
            }

            const updated: User = {
                ...user,
                ...response.data.user
            };
            setUser(updated);
            saveAuthSession(token, updated);
            setIsEditingProfile(false);

            if (response.data.nextProfileUpdateAt) {
                const nextDate = new Date(response.data.nextProfileUpdateAt);
                showToast(`Profile updated. Next edit after ${nextDate.toLocaleDateString()}.`);
                return;
            }

            showToast('Profile updated.');
        };

        updateProfile().catch(() => {
            showToast('Network error while updating profile.');
        });
    };

    const handleUpdatePassword = async () => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const currentPassword = passwordDraft.currentPassword;
        const newPassword = passwordDraft.newPassword.trim();
        const confirmNewPassword = passwordDraft.confirmNewPassword.trim();

        if (!currentPassword || !newPassword || !confirmNewPassword) {
            showToast('Fill current, new, and confirm password fields.');
            return;
        }

        if (!isValidSecurePassword(newPassword)) {
            showToast(SECURE_PASSWORD_RULE);
            return;
        }

        if (newPassword !== confirmNewPassword) {
            showToast('New password and confirm password do not match.');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            const response = await apiJsonRequest<{
                message?: string | string[];
                nextProfileUpdateAt?: string;
            }>('/auth/me/password', 'PATCH', {
                currentPassword,
                newPassword
            }, {
                headers: buildAuthHeader(token)
            });

            if (response.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (!response.ok) {
                showToast(
                    extractApiMessage(response.data) ||
                    'Unable to update password right now.'
                );
                return;
            }

            setPasswordDraft({
                currentPassword: '',
                newPassword: '',
                confirmNewPassword: ''
            });

            if (response.data?.nextProfileUpdateAt) {
                const nextDate = new Date(response.data.nextProfileUpdateAt);
                showToast(`Password updated. Next edit after ${nextDate.toLocaleDateString()}.`);
                return;
            }

            showToast('Password updated successfully.');
        } catch {
            showToast('Network error while updating password.');
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const downloadTextFile = (filename: string, content: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleDownloadMemberCard = () => {
        if (!user) {
            return;
        }
        const content = [
            'IES DIGITAL ID CARD',
            `Name: ${user.fullName || user.name || ''}`,
            `Role: ${user.role}`,
            `Email: ${user.email}`,
            `Reg No: ${user.regNo || 'PENDING ASSIGNMENT'}`
        ].join('\n');
        downloadTextFile(`ies-member-card-${user.username}.txt`, content);
        showToast('Member card exported.');
    };

    const handleUploadCredential = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        const newItem: CredentialItem = {
            id: `${Date.now()}-${file.name}`,
            name: file.name,
            type: 'UPLOADED DOCUMENT',
            verifiedOn: new Date().toLocaleDateString().toUpperCase()
        };
        setCredentials((prev) => [newItem, ...prev]);
        showToast(`${file.name} uploaded.`);
        event.target.value = '';
    };

    const handleDownloadCredential = (item: CredentialItem) => {
        downloadTextFile(item.name.replace(/\.[^/.]+$/, '.txt'), `Credential: ${item.name}\nType: ${item.type}\nVerified: ${item.verifiedOn}`);
        showToast(`Downloaded ${item.name}`);
    };

    const handleRefreshAdmin = async () => {
        await loadAdminApplications();
        showToast('Control center refreshed.');
    };

    const handleDownloadOwnDocument = async (
        applicationId: string,
        doc: { id: string; type: string; fileName: string }
    ) => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        setDownloadingOwnDocId(doc.id);
        try {
            const response = await fetch(
                `${API_BASE_URL}/memberships/applications/${applicationId}/documents/${doc.id}/download`,
                {
                    headers: buildAuthHeader(token)
                }
            );

            if (response.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (!response.ok) {
                showToast('Failed to download document.');
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
            URL.revokeObjectURL(url);
        } catch {
            showToast('Network error while downloading document.');
        } finally {
            setDownloadingOwnDocId(null);
        }
    };

    const handleUpdateStage = async () => {
        if (!selectedApplication) {
            return;
        }

        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        setIsUpdatingStage(true);
        try {
            const response = await apiRequest<MembershipApplication>(`/memberships/applications/${selectedApplication.id}/stage`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    ...buildAuthHeader(token)
                },
                body: JSON.stringify({
                    stage: stageDraft,
                    notes: stageNote.trim() || undefined
                })
            });

            if (response.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (response.status === 403) {
                showToast('Only admin can update application stage.');
                return;
            }

            if (!response.ok) {
                showToast('Failed to update application stage.');
                return;
            }

            showToast('Application stage updated.');
            await loadAdminApplications();
            setSelectedApplication((prev) =>
                prev ? { ...prev, stage: stageDraft } : prev
            );
        } catch {
            showToast('Network error while updating stage.');
        } finally {
            setIsUpdatingStage(false);
        }
    };

    const handleDeleteApplication = async (id: string) => {
        const token = getAuthToken();
        if (!token) {
            router.push('/login');
            return;
        }

        const confirmed = window.confirm('Delete this application permanently?');
        if (!confirmed) {
            return;
        }

        setDeletingId(id);
        try {
            const response = await apiRequest<{ id: string }>(`/memberships/applications/${id}`, {
                method: 'DELETE',
                headers: buildAuthHeader(token)
            });

            if (response.status === 401) {
                clearAuthSession();
                router.push('/login');
                return;
            }

            if (!response.ok) {
                showToast('Failed to delete application.');
                return;
            }

            if (selectedApplication?.id === id) {
                setSelectedApplication(null);
            }
            await loadAdminApplications();
            showToast('Application deleted.');
        } catch {
            showToast('Network error while deleting.');
        } finally {
            setDeletingId(null);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
                <div style={{ width: '48px', height: '48px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <div className="dashboard-container">
                {/* Sidebar */}
                <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <BrandLockup
                            href="/"
                            variant="dark"
                            title="IES Portal"
                            subtitle="Somalia"
                            imageSize={62}
                        />
                    </div>

                    <nav className="nav-menu">
                        <button type="button" className="nav-link active" onClick={() => handleSidebarNavigation('dashboard-overview')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <rect x="3" y="3" width="6" height="6" rx="1" />
                                <rect x="3" y="11" width="6" height="6" rx="1" />
                                <rect x="11" y="3" width="6" height="6" rx="1" />
                                <rect x="11" y="11" width="6" height="6" rx="1" />
                            </svg>
                            <span>Dashboard</span>
                        </button>
                        <button type="button" className="nav-link" onClick={() => handleSidebarNavigation('cpd-programs')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 4h12v2H4V4zm0 5h12v2H4V9zm0 5h12v2H4v-2z" />
                            </svg>
                            <span>Technical Forums</span>
                        </button>
                        <button type="button" className="nav-link" onClick={() => handleSidebarNavigation('notice-board')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 12H4v6h5v-6zM15 2h-5v8h5V2zM9 2H4v8h5V2zM15 12h-5v6h5v-6z" />
                            </svg>
                            <span>Research Publications</span>
                        </button>
                        <button type="button" className="nav-link" onClick={() => handleSidebarNavigation('mentorship-program')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 9C11.66 9 13 7.66 13 6C13 4.34 11.66 3 10 3C8.34 3 7 4.34 7 6C7 7.66 8.34 9 10 9ZM10 11C7.33 11 2 12.34 2 15V17H18V15C18 12.34 12.67 11 10 11Z" />
                            </svg>
                            <span>Mentoring Resources</span>
                        </button>
                        <button type="button" className="nav-link" onClick={() => handleSidebarNavigation('credential-vault')}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M14 2H6C4.9 2 4 2.9 4 4V16C4 17.1 4.9 18 6 18H14C15.1 18 16 17.1 16 16V4C16 2.9 15.1 2 14 2ZM14 16H6V4H14V16Z" />
                            </svg>
                            <span>My Documents</span>
                        </button>
                    </nav>

                    <div className="sidebar-divider">
                        <div className="divider-text">SETTINGS & SECURITY</div>
                    </div>

                    <nav className="nav-menu-bottom">
                        <button type="button" className="nav-link" onClick={() => setIsEditingProfile(true)}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M15.95 10.78c.03-.25.05-.51.05-.78s-.02-.53-.06-.78l1.69-1.32c.15-.12.19-.34.1-.51l-1.6-2.77c-.1-.18-.31-.24-.49-.18l-1.99.8c-.42-.32-.86-.58-1.35-.78L12 2.34c-.03-.2-.2-.34-.4-.34H8.4c-.2 0-.36.14-.39.34l-.3 2.12c-.49.2-.94.47-1.35.78l-1.99-.8c-.18-.07-.39 0-.49.18l-1.6 2.77c-.1.18-.06.39.1.51l1.69 1.32c-.04.25-.07.52-.07.78s.02.53.06.78L2.37 12.1c-.15.12-.19.34-.1.51l1.6 2.77c.1.18.31.24.49.18l1.99-.8c.42.32.86.58 1.35.78l.3 2.12c.04.2.2.34.4.34h3.2c.2 0 .37-.14.39-.34l.3-2.12c.49-.2.94-.47 1.35-.78l1.99.8c.18.07.39 0 .49-.18l1.6-2.77c.1-.18.06-.39-.1-.51l-1.67-1.32zM10 13c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z" />
                            </svg>
                            <span>Account Settings</span>
                        </button>
                        <button onClick={handleLogout} className="nav-link">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                            </svg>
                            <span>Sign Out</span>
                        </button>
                    </nav>

                    <button
                        type="button"
                        className="support-btn"
                        onClick={() => {
                            window.location.href = 'mailto:support@ies.so?subject=IES%20Portal%20Support';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2C5.59 2 2 5.59 2 10s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8zm1 13H9v-2h2v2zm0-4H9V6h2v5z" />
                        </svg>
                        IES Support
                    </button>
                </aside>
                <button
                    type="button"
                    className={`mobile-sidebar-backdrop ${isSidebarOpen ? 'open' : ''}`}
                    aria-label="Close sidebar"
                    onClick={() => setIsSidebarOpen(false)}
                />

                {/* Main Content */}
                <main className="main-content">
                    <button
                        type="button"
                        className="mobile-sidebar-toggle"
                        onClick={() => setIsSidebarOpen((prev) => !prev)}
                        aria-label="Toggle sidebar"
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                    {/* Top Bar */}
                    <div className="top-bar">
                        <div className="search-container">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="search-icon">
                                <circle cx="8" cy="8" r="5" stroke="#94a3b8" strokeWidth="2" />
                                <path d="M12 12L16 16" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <input type="text" placeholder="Search resources..." className="search-input" />
                        </div>
                        <div className="top-bar-right">
                            <button type="button" className="icon-btn" onClick={() => showToast('No new notifications.')}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2C8.9 2 8 2.9 8 4V4.29C6.03 4.92 4.5 6.62 4.5 8.66V13L2.5 15V16H17.5V15L15.5 13V8.66C15.5 6.62 13.97 4.92 12 4.29V4C12 2.9 11.1 2 10 2ZM10 20C11.1 20 12 19.1 12 18H8C8 19.1 8.89 20 10 20Z" />
                                </svg>
                            </button>
                            <button type="button" className="icon-btn" onClick={() => setIsEditingProfile(true)}>
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                                    <circle cx="10" cy="10" r="3" />
                                    <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
                                </svg>
                            </button>
                            <div className="user-info-top">
                                <div className="user-text">
                                    <div className="user-name-top">{user.fullName || user.name}</div>
                                    <div className="user-role-top">{user.role}</div>
                                </div>
                                <div className="user-avatar-top">{(user.fullName || user.name || 'M').charAt(0)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Dashboard Header */}
                    <div id="dashboard-overview" className="dashboard-header">
                        <div>
                            <h1 className="page-title">Member Dashboard</h1>
                            <p className="page-subtitle">Welcome back, <strong>{user.fullName || user.name}</strong>. Profile verification level: <span className="gold-badge">Gold</span>.</p>
                        </div>
                        <div className="header-actions">
                            <button type="button" className="btn-outline" onClick={handleShareProfile}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13 8H8M8 8H3M8 8V3M8 8V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                Share Profile
                            </button>
                            <button type="button" className="btn-primary" onClick={() => setIsEditingProfile((prev) => !prev)}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M11 5L13 7L11 9M3 7H13M8 3L5 6L8 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Edit Profile
                            </button>
                        </div>
                    </div>

                    {isEditingProfile && (
                        <div className="profile-edit-card">
                            <h3>Edit Profile</h3>
                            <div className="profile-edit-grid">
                                <input
                                    type="text"
                                    value={profileDraft.username}
                                    onChange={(e) => setProfileDraft((prev) => ({ ...prev, username: e.target.value }))}
                                    placeholder="Username"
                                />
                                <input
                                    type="text"
                                    value={profileDraft.fullName}
                                    onChange={(e) => setProfileDraft((prev) => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="Full name"
                                />
                                <input
                                    type="email"
                                    value={profileDraft.email}
                                    onChange={(e) => setProfileDraft((prev) => ({ ...prev, email: e.target.value }))}
                                    placeholder="Email"
                                />
                            </div>
                            <div className="password-edit-grid">
                                <input
                                    type="password"
                                    value={passwordDraft.currentPassword}
                                    onChange={(e) => setPasswordDraft((prev) => ({ ...prev, currentPassword: e.target.value }))}
                                    placeholder="Current password"
                                />
                                <input
                                    type="password"
                                    value={passwordDraft.newPassword}
                                    onChange={(e) => setPasswordDraft((prev) => ({ ...prev, newPassword: e.target.value }))}
                                    placeholder="New password (8-12 letters/numbers)"
                                />
                                <input
                                    type="password"
                                    value={passwordDraft.confirmNewPassword}
                                    onChange={(e) => setPasswordDraft((prev) => ({ ...prev, confirmNewPassword: e.target.value }))}
                                    placeholder="Confirm new password"
                                />
                            </div>
                            <div className="profile-edit-actions">
                                <button
                                    type="button"
                                    className="btn-outline"
                                    onClick={() => {
                                        setIsEditingProfile(false);
                                        setPasswordDraft({
                                            currentPassword: '',
                                            newPassword: '',
                                            confirmNewPassword: ''
                                        });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="button" className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                                <button
                                    type="button"
                                    className="btn-primary"
                                    onClick={handleUpdatePassword}
                                    disabled={isUpdatingPassword}
                                >
                                    {isUpdatingPassword ? 'Updating Password...' : 'Update Password'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Member Card */}
                    {isMemberCardVisible && <div className="member-card-wrapper">
                        <div className="member-card-main">
                            <div className="member-card-content">
                                <div className="profile-photo-section">
                                    <div className="profile-photo">
                                        <div className="photo-placeholder">
                                            {(user.fullName || user.name || 'Member').split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className="active-indicator"></div>
                                    </div>
                                </div>

                                <div className="member-details">
                                    <div className="member-badges">
                                        <span className="badge-digital">DIGITAL ID CARD</span>
                                        <span className="badge-active">● ACTIVE MEMBER</span>
                                    </div>
                                    <h2 className="member-name">{user.fullName || user.name}</h2>
                                    <p className="member-reg">REG NO: {user.regNo || 'PENDING ASSIGNMENT'}</p>
                                    <div className="member-meta">
                                        <div className="meta-item">
                                            <div className="meta-label">PROFESSIONAL GRADE</div>
                                            <div className="meta-value">{user.memberType || 'Member'}</div>
                                        </div>
                                        <div className="meta-item">
                                            <div className="meta-label">EXPIRY DATE</div>
                                            <div className="meta-value">{user.expiryDate || 'Not issued'}</div>
                                        </div>
                                    </div>
                                </div>

                                <button type="button" className="close-btn" onClick={() => setIsMemberCardVisible(false)}>x</button>

                                <button type="button" className="download-pdf-btn" onClick={handleDownloadMemberCard}>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                        <path d="M6 1V8M6 8L8.5 5.5M6 8L3.5 5.5M2 11H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    DOWNLOAD PDF
                                </button>
                            </div>
                        </div>

                        <div className="compliance-card">
                            <div className="compliance-header">
                                <h3>COMPLIANCE</h3>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="11" fill="#10b981" />
                                    <path d="M7 12l3 3 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>

                            <div className="compliance-stats">
                                <div className="stat-box">
                                    <div className="stat-label">CPD CREDITS</div>
                                    <div className="stat-number">{user.cpdCredits || 0} <span className="stat-total">/40</span></div>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar-fill" style={{ width: `${((user.cpdCredits || 0) / 40) * 100}%`, background: '#10b981' }}></div>
                                    </div>
                                </div>

                                <div className="stat-box">
                                    <div className="stat-label">RENEWAL PERIOD</div>
                                    <div className="stat-number orange">{user.renewalPeriod || 0} <span className="stat-total">Days</span></div>
                                    <div className="progress-bar-container">
                                        <div className="progress-bar-fill" style={{ width: `${((user.renewalPeriod || 0) / 365) * 100}%`, background: '#f97316' }}></div>
                                    </div>
                                </div>
                            </div>

                            <button type="button" className="btn-portfolio" onClick={() => scrollToSection('cpd-programs')}>VIEW CPD PORTFOLIO</button>
                        </div>
                    </div>}

                    <section className="content-card">
                        <div className="card-header">
                            <h3 className="card-title">● My Membership Applications</h3>
                            <button type="button" className="link-blue" onClick={loadOwnApplications}>
                                Refresh
                            </button>
                        </div>
                        {isMyApplicationsLoading && <p className="admin-note">Loading your applications...</p>}
                        {!isMyApplicationsLoading && myApplicationsError && (
                            <p className="admin-error">{myApplicationsError}</p>
                        )}
                        {!isMyApplicationsLoading && !myApplicationsError && (
                            <div className="applications-table-wrap">
                                <table className="applications-table">
                                    <thead>
                                        <tr>
                                            <th>Grade</th>
                                            <th>Stage</th>
                                            <th>Decision</th>
                                            <th>Uploaded Docs</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {myApplications.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="empty-cell">No applications submitted yet.</td>
                                            </tr>
                                        )}
                                        {myApplications.map((application) => (
                                            <tr key={application.id}>
                                                <td>{application.membershipGrade}</td>
                                                <td>{application.stage}</td>
                                                <td>{application.decision}</td>
                                                <td>
                                                    {application.documents?.length
                                                        ? (
                                                            <div className="my-doc-list">
                                                                {application.documents.map((doc) => (
                                                                    <div key={doc.id} className="my-doc-item">
                                                                        <span>{doc.type}</span>
                                                                        <button
                                                                            type="button"
                                                                            className="admin-row-btn"
                                                                            onClick={() => handleDownloadOwnDocument(application.id, doc)}
                                                                            disabled={downloadingOwnDocId === doc.id}
                                                                        >
                                                                            {downloadingOwnDocId === doc.id ? 'Downloading...' : 'Download'}
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )
                                                        : '-'}
                                                </td>
                                                <td>{new Date(application.createdAt).toLocaleDateString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>

                    {isPrivilegedUser && (
                        <section className="admin-applications">
                            <div className="admin-header-row">
                                <h3>Admin Control Center</h3>
                                <div className="admin-actions">
                                    <span className="admin-total">
                                        {isRegisterOnlyView
                                            ? `${finalizedRegisterMembers.length} register records`
                                            : `${adminApplications.length} applications`}
                                    </span>
                                    {user.role === 'ADMIN' && (
                                        <button
                                            type="button"
                                            className="admin-refresh-btn"
                                            onClick={() => router.push('/dashboard/users')}
                                        >
                                            Manage Users & Memberships
                                        </button>
                                    )}
                                    <button type="button" className="admin-refresh-btn" onClick={handleRefreshAdmin}>
                                        Refresh
                                    </button>
                                </div>
                            </div>

                            {isAdminLoading && <p className="admin-note">Loading applications...</p>}
                            {!isAdminLoading && adminError && <p className="admin-error">{adminError}</p>}

                            {!isAdminLoading && !adminError && (
                                <>
                                    {isRegisterOnlyView ? (
                                        <>
                                            <div className="admin-stats-grid">
                                                <div className="admin-stat-card">
                                                    <p className="admin-stat-label">Approved</p>
                                                    <p className="admin-stat-value">{approvedRegisterCount}</p>
                                                </div>
                                                <div className="admin-stat-card">
                                                    <p className="admin-stat-label">Rejected</p>
                                                    <p className="admin-stat-value">{rejectedRegisterCount}</p>
                                                </div>
                                                <div className="admin-stat-card">
                                                    <p className="admin-stat-label">Finalized Total</p>
                                                    <p className="admin-stat-value">{finalizedRegisterMembers.length}</p>
                                                </div>
                                            </div>

                                            <div className="register-section">
                                                <div className="register-header-row">
                                                    <h4>Register (Approved + Rejected)</h4>
                                                    <span>Approved: {approvedRegisterCount} | Rejected: {rejectedRegisterCount}</span>
                                                </div>
                                                <div className="applications-table-wrap">
                                                    <table className="applications-table">
                                                        <thead>
                                                            <tr>
                                                                <th>Name</th>
                                                                <th>Email</th>
                                                                <th>Grade</th>
                                                                <th>Decision</th>
                                                                <th>Reg Number</th>
                                                                <th>Certificate</th>
                                                                <th>Remark</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {finalizedRegisterMembers.length === 0 && (
                                                                <tr>
                                                                    <td colSpan={7} className="empty-cell">No approved or rejected records yet.</td>
                                                                </tr>
                                                            )}
                                                            {finalizedRegisterMembers.map((member) => {
                                                                const decision = member.decision === 'REJECTED' ? 'REJECTED' : 'APPROVED';
                                                                const validUntilDate = member.validUntil ? new Date(member.validUntil) : null;
                                                                const remark = decision === 'REJECTED'
                                                                    ? (member.rejectionReason?.trim() || 'Rejected by review.')
                                                                    : (validUntilDate ? `Valid until ${validUntilDate.toLocaleDateString()}` : 'Approved');

                                                                return (
                                                                    <tr key={member.id}>
                                                                        <td>{member.fullName}</td>
                                                                        <td>{member.email}</td>
                                                                        <td>{member.membershipGrade}</td>
                                                                        <td>
                                                                            <span className={`register-decision ${decision === 'APPROVED' ? 'approved' : 'rejected'}`}>
                                                                                {decision}
                                                                            </span>
                                                                        </td>
                                                                        <td>{member.registrationNumber || '-'}</td>
                                                                        <td>{member.certificateNumber || '-'}</td>
                                                                        <td className="register-remark">{remark}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="category-grid">
                                                {['STUDENT', 'GRADUATE', 'ASSOCIATE', 'CORPORATE', 'SENIOR', 'FELLOW'].map((grade) => (
                                                    <div key={grade} className="category-card">
                                                        <p className="category-title">{grade}</p>
                                                        <p className="category-value">{categoryCounts[grade] || 0}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="applications-table-wrap">
                                                <table className="applications-table">
                                                    <thead>
                                                        <tr>
                                                            <th>Name</th>
                                                            <th>Email</th>
                                                            <th>Phone</th>
                                                            <th>Category</th>
                                                            <th>Stage</th>
                                                            <th>Decision</th>
                                                            <th>Created</th>
                                                            <th>Actions</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {adminApplications.length === 0 && (
                                                            <tr>
                                                                <td colSpan={8} className="empty-cell">No applications yet.</td>
                                                            </tr>
                                                        )}
                                                        {adminApplications.map((app) => (
                                                            <tr key={app.id}>
                                                                <td>{app.fullName}</td>
                                                                <td>{app.email}</td>
                                                                <td>{app.phone || '-'}</td>
                                                                <td>{app.membershipGrade}</td>
                                                                <td>{app.stage}</td>
                                                                <td>{app.decision}</td>
                                                                <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                                                                <td>
                                                                    <div className="admin-row-actions">
                                                                        <button type="button" className="admin-row-btn" onClick={() => setSelectedApplication(app)}>
                                                                            View
                                                                        </button>
                                                                        {user.role === 'ADMIN' && (
                                                                            <button
                                                                                type="button"
                                                                                className="admin-row-btn danger"
                                                                                onClick={() => handleDeleteApplication(app.id)}
                                                                                disabled={deletingId === app.id}
                                                                            >
                                                                                {deletingId === app.id ? 'Deleting...' : 'Delete'}
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>

                                            {selectedApplication && (
                                                <div className="admin-detail-panel">
                                                    <div className="admin-detail-header">
                                                        <h4>Application Full Data</h4>
                                                        <button type="button" className="admin-row-btn" onClick={() => setSelectedApplication(null)}>
                                                            Close
                                                        </button>
                                                    </div>
                                                    <div className="admin-detail-grid">
                                                        <p><strong>Name:</strong> {selectedApplication.fullName}</p>
                                                        <p><strong>Email:</strong> {selectedApplication.email}</p>
                                                        <p><strong>Phone:</strong> {selectedApplication.phone || '-'}</p>
                                                        <p><strong>National ID:</strong> {selectedApplication.nationalIdNumber || '-'}</p>
                                                        <p><strong>Category:</strong> {selectedApplication.membershipGrade}</p>
                                                        <p><strong>Stage:</strong> {selectedApplication.stage}</p>
                                                        <p><strong>Decision:</strong> {selectedApplication.decision}</p>
                                                        <p><strong>Organization:</strong> {selectedApplication.organizationName || '-'}</p>
                                                        <p><strong>Experience:</strong> {selectedApplication.yearsOfExperience ?? '-'}</p>
                                                        <p><strong>Reg No:</strong> {selectedApplication.registrationNumber || '-'}</p>
                                                        <p><strong>Certificate:</strong> {selectedApplication.certificateNumber || '-'}</p>
                                                        <p><strong>Created:</strong> {new Date(selectedApplication.createdAt).toLocaleString()}</p>
                                                    </div>
                                                    {(user.role === 'REVIEWER' || user.role === 'ADMIN') && (
                                                        <div className="stage-editor">
                                                            <label className="stage-editor-label" htmlFor="application-stage-select">
                                                                Update Workflow Stage
                                                            </label>
                                                            <select
                                                                id="application-stage-select"
                                                                className="stage-editor-select"
                                                                value={stageDraft}
                                                                onChange={(event) => setStageDraft(event.target.value)}
                                                            >
                                                                {APPLICATION_STAGES.map((stage) => (
                                                                    <option key={stage} value={stage}>
                                                                        {stage}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            <textarea
                                                                className="stage-editor-notes"
                                                                rows={3}
                                                                placeholder="Optional review note..."
                                                                value={stageNote}
                                                                onChange={(event) => setStageNote(event.target.value)}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="stage-editor-btn"
                                                                onClick={handleUpdateStage}
                                                                disabled={isUpdatingStage}
                                                            >
                                                                {isUpdatingStage ? 'Updating...' : 'Save Stage'}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        </section>
                    )}

                    {/* Two Column Layout */}
                    <div className="content-grid">
                        {/* Left Column */}
                        <div className="left-section">
                            {/* CPD Programs */}
                            <div id="cpd-programs" className="content-card">
                                <div className="card-header">
                                    <h3 className="card-title">● Upcoming CPD Programs</h3>
                                    <button type="button" className="link-blue" onClick={() => window.open('https://www.ies.org.so', '_blank')}>Browse Catalogue</button>
                                </div>
                                <div className="cpd-list">
                                    <div className="cpd-item blue">
                                        <div className="cpd-date-box">
                                            <div className="cpd-month">JAN</div>
                                            <div className="cpd-day">15</div>
                                        </div>
                                        <div className="cpd-details">
                                            <h4 className="cpd-title">Advanced Structural Design for Arid Climates</h4>
                                            <div className="cpd-info-row">
                                                <span className="cpd-points">↑ 4 POINTS</span>
                                                <span className="cpd-format">WEBINAR</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="cpd-item green">
                                        <div className="cpd-date-box">
                                            <div className="cpd-month">JAN</div>
                                            <div className="cpd-day">28</div>
                                        </div>
                                        <div className="cpd-details">
                                            <h4 className="cpd-title">Urban Infrastructure Standards 2024</h4>
                                            <div className="cpd-info-row">
                                                <span className="cpd-points">↑ 6 POINTS</span>
                                                <span className="cpd-format">IN-PERSON</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Credential Vault */}
                            <div id="credential-vault" className="content-card">
                                <div className="card-header">
                                    <h3 className="card-title">● Credential Vault</h3>
                                    <button type="button" className="btn-upload" onClick={() => uploadInputRef.current?.click()}>
                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                            <path d="M7 10V3M7 3L4.5 5.5M7 3L9.5 5.5M2 13H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        UPLOAD NEW
                                    </button>
                                </div>
                                <input ref={uploadInputRef} type="file" onChange={handleUploadCredential} style={{ display: 'none' }} />

                                <div className="credential-list">
                                    {credentials.map((item) => (
                                        <div className="credential-item" key={item.id}>
                                            <div className="credential-icon pdf">
                                                <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
                                                    <rect width="24" height="28" rx="2" fill="#2563eb" />
                                                    <text x="12" y="17" fill="white" fontSize="7" textAnchor="middle" fontWeight="bold">DOC</text>
                                                </svg>
                                            </div>
                                            <div className="credential-info">
                                                <div className="credential-name">{item.name}</div>
                                                <div className="credential-type">{item.type}</div>
                                            </div>
                                            <div className="credential-meta">
                                                <div className="credential-date">
                                                    <div>VERIFIED ON</div>
                                                    <div>{item.verifiedOn}</div>
                                                </div>
                                                <button type="button" className="btn-download-small" onClick={() => handleDownloadCredential(item)}>
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                                        <path d="M8 2V10M8 10L10.5 7.5M8 10L5.5 7.5M3 14H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="right-section">
                            {/* Notice Board */}
                            <div id="notice-board" className="content-card notice-board">
                                <h3 className="notice-title">NOTICE BOARD</h3>

                                <div className="notice-item">
                                    <div className="notice-header-row">
                                        <span className="notice-badge official">OFFICIAL BULLETIN</span>
                                        <span className="notice-time">2H AGO</span>
                                    </div>
                                    <h4 className="notice-item-title">2024 National Engineering Standards Update Released</h4>
                                    <p className="notice-text">The Council has finalized the revised building codes for coastal...</p>
                                </div>

                                <div className="notice-item">
                                    <div className="notice-header-row">
                                        <span className="notice-badge event">MEMBER EVENT</span>
                                        <span className="notice-time">YESTERDAY</span>
                                    </div>
                                    <h4 className="notice-item-title">Annual General Meeting (AGM) Registration Open</h4>
                                    <p className="notice-text">Secure your virtual or physical seat for the November 15th Mogadishu Summit.</p>
                                </div>

                                <button type="button" className="archive-link" onClick={() => showToast('Archive view opened (demo).')}>ARCHIVE VIEW</button>
                            </div>

                            {/* Mentorship Program */}
                            <div id="mentorship-program" className="mentorship-card">
                                <div className="mentorship-icon">
                                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                                        <circle cx="24" cy="24" r="22" fill="white" fillOpacity="0.2" />
                                        <path d="M24 18C20.69 18 18 20.69 18 24C18 27.31 20.69 30 24 30C27.31 30 30 27.31 30 24C30 20.69 27.31 18 24 18ZM24 32C18.48 32 14 34.01 14 36V38H34V36C34 34.01 29.52 32 24 32Z" fill="white" />
                                    </svg>
                                </div>
                                <h3 className="mentorship-title">Mentorship Program</h3>
                                <p className="mentorship-text">You have <strong>2 new mentee requests</strong> from junior civil engineering graduates in Mogadishu.</p>
                                <button type="button" className="btn-mentorship" onClick={() => showToast('2 mentee requests ready for review.')}>REVIEW REQUESTS</button>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="dashboard-footer">
                        <div className="footer-logo-section">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="footer-icon">
                                <circle cx="10" cy="10" r="9" stroke="#94a3b8" strokeWidth="1.5" />
                            </svg>
                            <span className="footer-org">INSTITUTION OF ENGINEERS – SOMALIA</span>
                        </div>
                        <p className="footer-text">© 2024 IES Somalia. All infrastructure standards and member credentials are protected by the Board of Engineers.</p>
                    </footer>
                </main>
            </div>
            {toast && <div className="toast">{toast}</div>}
            <style jsx>{`
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                .dashboard-container {
                    display: flex;
                    min-height: 100vh;
                    background: #f8fafc;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                    overflow-x: hidden;
                }

                /* SIDEBAR */
                .sidebar {
                    width: 240px;
                    background: linear-gradient(to bottom, #1e3a8a, #1e40af);
                    position: fixed;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    color: white;
                    z-index: 90;
                }

                .sidebar-header {
                    display: flex;
                    align-items: center;
                    padding: 20px 16px;
                    gap: 12px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .logo {
                    width: 40px;
                    height: 40px;
                    position: relative;
                }

                .logo-icon {
                    width: 40px;
                    height: 40px;
                    background: white;
                    border-radius: 50%;
                    border: 3px solid #3b82f6;
                }

                .logo-text {
                    flex: 1;
                }

                .portal-title {
                    font-size: 15px;
                    font-weight: 700;
                    line-height: 1;
                }

                .portal-subtitle {
                    font-size: 10px;
                    opacity: 0.8;
                    margin-top: 2px;
                }

                .nav-menu {
                    padding: 12px 0;
                    flex: 1;
                }

                .nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px 16px;
                    color: rgba(255, 255, 255, 0.75);
                    text-decoration: none;
                    font-size: 13px;
                    transition: all 0.2s;
                    cursor: pointer;
                    background: none;
                    border: none;
                    width: 100%;
                    text-align: left;
                }

                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .nav-link.active {
                    background: rgba(255, 255, 255, 0.15);
                    color: white;
                    font-weight: 600;
                }

                .sidebar-divider {
                    padding: 16px 16px 8px;
                }

                .divider-text {
                    font-size: 10px;
                    opacity: 0.5;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .nav-menu-bottom {
                    padding: 0 0 12px;
                }

                .support-btn {
                    margin: 12px 16px;
                    padding: 10px;
                    background: #10b981;
                    border: none;
                    border-radius: 8px;
                    color: white;
                    font-size: 13px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .support-btn:hover {
                    background: #059669;
                }

                /* MAIN CONTENT */
                .main-content {
                    flex: 1;
                    margin-left: 240px;
                    --content-gap: 24px;
                    width: 100%;
                    min-width: 0;
                }

                .mobile-sidebar-backdrop {
                    display: none;
                }

                .mobile-sidebar-toggle {
                    display: none;
                    position: fixed;
                    top: 98px;
                    left: 60px;
                    z-index: 95;
                    width: 44px;
                    height: 44px;
                    border-radius: 12px;
                    border: 1px solid rgba(27, 94, 172, 0.2);
                    background: linear-gradient(140deg, #1b5eac 0%, #2f78d0 65%, #86c440 100%);
                    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.25);
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    flex-direction: column;
                    transform: translateX(-50%);
                }

                .mobile-sidebar-toggle span {
                    width: 18px;
                    height: 2.5px;
                    border-radius: 999px;
                    background: #ffffff;
                    display: block;
                }


                .top-bar {
                    background: white;
                    padding: 12px 24px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid #e5e7eb;
                }

                .search-container {
                    display: flex;
                    align-items: center;
                    background: #f3f4f6;
                    padding: 8px 14px;
                    border-radius: 8px;
                    gap: 8px;
                    width: 320px;
                }

                .search-icon {
                    flex-shrink: 0;
                }

                .search-input {
                    border: none;
                    background: none;
                    outline: none;
                    font-size: 13px;
                    flex: 1;
                    color: #1f2937;
                }

                .search-input::placeholder {
                    color: #9ca3af;
                }

                .top-bar-right {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .icon-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: none;
                    background: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: #6b7280;
                }

                .icon-btn:hover {
                    background: #e5e7eb;
                }

                .user-info-top {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .user-text {
                    text-align: right;
                }

                .user-name-top {
                    font-size: 13px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .user-role-top {
                    font-size: 11px;
                    color: #6b7280;
                }

                .user-avatar-top {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #1e40af);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 16px;
                }

                /* DASHBOARD CONTENT */
                .dashboard-header {
                    padding: 24px var(--content-gap);
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                }

                .profile-edit-card {
                    margin: 0 24px 24px;
                    background: white;
                    border-radius: 12px;
                    padding: 16px;
                    border: 1px solid #e5e7eb;
                }

                .profile-edit-card h3 {
                    font-size: 15px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    color: #111827;
                }

                .profile-edit-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 10px;
                }

                .profile-edit-grid input {
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    color: #111827;
                }

                .password-edit-grid {
                    margin-top: 10px;
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 10px;
                }

                .password-edit-grid input {
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-size: 13px;
                    color: #111827;
                }

                .profile-edit-actions {
                    margin-top: 12px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 8px;
                }

                .page-title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 4px;
                }

                .page-subtitle {
                    font-size: 14px;
                    color: #6b7280;
                }

                .gold-badge {
                    color: #f59e0b;
                    font-weight: 600;
                }

                .header-actions {
                    display: flex;
                    gap: 12px;
                }

                .btn-outline {
                    padding: 10px 16px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #374151;
                }

                .btn-outline:hover {
                    background: #f9fafb;
                }

                .btn-primary {
                    padding: 10px 16px;
                    border: none;
                    background: #2563eb;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: white;
                }

                .btn-primary:hover {
                    background: #1d4ed8;
                }

                /* MEMBER CARD */
                .member-card-wrapper {
                    margin: 0 var(--content-gap) 24px;
                    display: grid;
                    grid-template-columns: 1fr 320px;
                    gap: 16px;
                }

                .member-card-main {
                    background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
                    border-radius: 16px;
                    padding: 24px;
                    position: relative;
                }

                .member-card-content {
                    display: flex;
                    gap: 20px;
                    position: relative;
                    min-width: 0;
                }

                .profile-photo-section {
                    position: relative;
                }

                .profile-photo {
                    width: 120px;
                    height: 120px;
                    position: relative;
                }

                .photo-placeholder {
                    width: 120px;
                    height: 120px;
                    background: rgba(255, 255, 255, 0.2);
                    border: 3px solid rgba(255, 255, 255, 0.4);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    font-weight: 700;
                    color: white;
                }

                .active-indicator {
                    position: absolute;
                    bottom: 6px;
                    right: 6px;
                    width: 20px;
                    height: 20px;
                    background: #10b981;
                    border: 3px solid white;
                    border-radius: 50%;
                }

                .member-details {
                    flex: 1;
                    color: white;
                }

                .member-badges {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                }

                .badge-digital {
                    padding: 4px 10px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                .badge-active {
                    padding: 4px 10px;
                    background: #10b981;
                    border-radius: 4px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                .member-name {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 4px;
                }

                .member-reg {
                    font-size: 12px;
                    opacity: 0.9;
                    margin-bottom: 16px;
                }

                .member-meta {
                    display: flex;
                    gap: 24px;
                }

                .meta-item {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .meta-label {
                    font-size: 10px;
                    opacity: 0.8;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .meta-value {
                    font-size: 14px;
                    font-weight: 600;
                }

                .close-btn {
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    background: transparent;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .download-pdf-btn {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    padding: 10px 16px;
                    background: white;
                    color: #1e40af;
                    border: none;
                    border-radius: 8px;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .download-pdf-btn:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                /* COMPLIANCE CARD */
                .compliance-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .compliance-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .compliance-header h3 {
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    color: #111827;
                }

                .compliance-stats {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .stat-box {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .stat-label {
                    font-size: 10px;
                    font-weight: 600;
                    color: #6b7280;
                    letter-spacing: 0.5px;
                }

                .stat-number {
                    font-size: 32px;
                    font-weight: 700;
                    color: #111827;
                    line-height: 1;
                }

                .stat-number.orange {
                    color: #f97316;
                }

                .stat-total {
                    font-size: 14px;
                    color: #9ca3af;
                    font-weight: 400;
                }

                .progress-bar-container {
                    height: 6px;
                    background: #e5e7eb;
                    border-radius: 3px;
                    overflow: hidden;
                }

                .progress-bar-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.3s;
                }

                .btn-portfolio {
                    padding: 12px;
                    background: #f3f4f6;
                    border: none;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    color: #374151;
                    cursor: pointer;
                }

                .btn-portfolio:hover {
                    background: #e5e7eb;
                }

                .admin-applications {
                    margin: 0 var(--content-gap) 24px;
                    padding: 20px;
                    background: white;
                    border-radius: 12px;
                }

                .admin-header-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 14px;
                    gap: 12px;
                }

                .admin-header-row h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #111827;
                }

                .admin-total {
                    font-size: 12px;
                    font-weight: 700;
                    color: #2563eb;
                }

                .admin-actions {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .admin-refresh-btn {
                    border: 1px solid #bfdbfe;
                    background: #eff6ff;
                    color: #1d4ed8;
                    border-radius: 8px;
                    padding: 7px 10px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .admin-stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 10px;
                    margin-bottom: 12px;
                }

                .admin-stat-card {
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 10px;
                }

                .admin-stat-label {
                    font-size: 11px;
                    color: #64748b;
                    font-weight: 600;
                    margin-bottom: 4px;
                }

                .admin-stat-value {
                    font-size: 22px;
                    color: #0f172a;
                    font-weight: 800;
                    line-height: 1;
                }

                .admin-note {
                    font-size: 13px;
                    color: #475569;
                }

                .admin-error {
                    font-size: 13px;
                    color: #dc2626;
                }

                .category-grid {
                    display: grid;
                    grid-template-columns: repeat(6, minmax(0, 1fr));
                    gap: 10px;
                    margin-bottom: 16px;
                }

                .category-card {
                    background: #eff6ff;
                    border: 1px solid #dbeafe;
                    border-radius: 10px;
                    padding: 10px;
                    text-align: center;
                }

                .category-title {
                    font-size: 11px;
                    font-weight: 700;
                    color: #1e3a8a;
                    margin-bottom: 4px;
                }

                .category-value {
                    font-size: 20px;
                    font-weight: 800;
                    color: #1d4ed8;
                    line-height: 1;
                }

                .applications-table-wrap {
                    overflow-x: auto;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                }

                .register-section {
                    margin-bottom: 16px;
                }

                .register-header-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    margin-bottom: 8px;
                }

                .register-header-row h4 {
                    font-size: 13px;
                    font-weight: 800;
                    color: #0f172a;
                }

                .register-header-row span {
                    font-size: 11px;
                    font-weight: 700;
                    color: #2563eb;
                }

                .register-decision {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    min-width: 66px;
                    border-radius: 999px;
                    padding: 4px 8px;
                    font-size: 10px;
                    font-weight: 800;
                    letter-spacing: 0.3px;
                }

                .register-decision.approved {
                    color: #166534;
                    background: #dcfce7;
                }

                .register-decision.rejected {
                    color: #991b1b;
                    background: #fee2e2;
                }

                .register-remark {
                    min-width: 220px;
                    color: #334155;
                }

                .applications-table {
                    width: 100%;
                    border-collapse: collapse;
                    min-width: 760px;
                }

                .applications-table th,
                .applications-table td {
                    padding: 10px 12px;
                    font-size: 12px;
                    border-bottom: 1px solid #f1f5f9;
                    text-align: left;
                    color: #334155;
                }

                .applications-table th {
                    font-size: 11px;
                    letter-spacing: 0.4px;
                    color: #64748b;
                    background: #f8fafc;
                }

                .empty-cell {
                    text-align: center !important;
                    color: #64748b;
                }

                .admin-row-actions {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .admin-row-btn {
                    border: 1px solid #cbd5e1;
                    background: #fff;
                    color: #334155;
                    border-radius: 6px;
                    padding: 5px 8px;
                    font-size: 11px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .admin-row-btn.danger {
                    border-color: #fecaca;
                    color: #b91c1c;
                    background: #fff1f2;
                }

                .admin-row-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .my-doc-list {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .my-doc-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 8px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    padding: 6px 8px;
                    background: #f8fafc;
                }

                .my-doc-item span {
                    font-size: 11px;
                    font-weight: 700;
                    color: #1e3a8a;
                    word-break: break-word;
                }

                .admin-detail-panel {
                    margin-top: 12px;
                    border: 1px solid #dbeafe;
                    border-radius: 12px;
                    padding: 12px;
                    background: #f8fbff;
                }

                .admin-detail-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .admin-detail-header h4 {
                    font-size: 14px;
                    color: #0f172a;
                    font-weight: 800;
                }

                .admin-detail-grid {
                    display: grid;
                    grid-template-columns: repeat(3, minmax(0, 1fr));
                    gap: 8px 12px;
                    font-size: 12px;
                    color: #334155;
                }

                .stage-editor {
                    margin-top: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    padding-top: 12px;
                    border-top: 1px solid #dbeafe;
                }

                .stage-editor-label {
                    font-size: 12px;
                    font-weight: 700;
                    color: #0f172a;
                }

                .stage-editor-select,
                .stage-editor-notes {
                    width: 100%;
                    border: 1px solid #cbd5e1;
                    border-radius: 8px;
                    padding: 8px 10px;
                    font-size: 12px;
                    color: #0f172a;
                    background: #fff;
                }

                .stage-editor-notes {
                    resize: vertical;
                    min-height: 72px;
                }

                .stage-editor-btn {
                    align-self: flex-start;
                    border: 1px solid #bfdbfe;
                    background: #2563eb;
                    color: #fff;
                    border-radius: 8px;
                    padding: 7px 12px;
                    font-size: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .stage-editor-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                /* CONTENT GRID */
                .content-grid {
                    padding: 0 var(--content-gap) 24px;
                    display: grid;
                    grid-template-columns: 1fr 380px;
                    gap: 24px;
                }

                .left-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .right-section {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                .content-card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                }

                .card-title {
                    font-size: 15px;
                    font-weight: 700;
                    color: #111827;
                }

                .link-blue {
                    font-size: 12px;
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 600;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                }

                .link-blue:hover {
                    color: #1d4ed8;
                }

                .btn-upload {
                    padding: 6px 12px;
                    background: transparent;
                    border: none;
                    color: #2563eb;
                    font-size: 11px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-upload:hover {
                    color: #1d4ed8;
                }

                /* CPD PROGRAMS */
                .cpd-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .cpd-item {
                    display: flex;
                    gap: 14px;
                    padding: 14px;
                    border-radius: 10px;
                    color: white;
                }

                .cpd-item.blue {
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                }

                .cpd-item.green {
                    background: linear-gradient(135deg, #059669, #10b981);
                }

                .cpd-date-box {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    padding: 10px;
                    text-align: center;
                    min-width: 56px;
                }

                .cpd-month {
                    font-size: 10px;
                    font-weight: 600;
                    opacity: 0.8;
                }

                .cpd-day {
                    font-size: 22px;
                    font-weight: 700;
                    line-height: 1;
                }

                .cpd-details {
                    flex: 1;
                }

                .cpd-title {
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 8px;
                    line-height: 1.3;
                }

                .cpd-info-row {
                    display: flex;
                    gap: 12px;
                    font-size: 11px;
                    opacity: 0.9;
                }

                .cpd-points {
                    font-weight: 600;
                }

                /* CREDENTIAL VAULT */
                .credential-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .credential-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px;
                    background: #f9fafb;
                    border-radius: 10px;
                }

                .credential-icon {
                    flex-shrink: 0;
                }

                .credential-info {
                    flex: 1;
                }

                .credential-name {
                    font-size: 13px;
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 2px;
                }

                .credential-type {
                    font-size: 10px;
                    color: #6b7280;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                }

                .credential-meta {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .credential-date {
                    font-size: 9px;
                    color: #9ca3af;
                    text-align: right;
                    line-height: 1.3;
                    font-weight: 600;
                }

                .btn-download-small {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    border: none;
                    background: white;
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                }

                .btn-download-small:hover {
                    background: #3b82f6;
                    color: white;
                }

                /* NOTICE BOARD */
                .notice-board {
                    padding: 20px;
                }

                .notice-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 16px;
                    letter-spacing: 0.5px;
                }

                .notice-item {
                    padding-bottom: 16px;
                    margin-bottom: 16px;
                    border-bottom: 1px solid #e5e7eb;
                }

                .notice-item:last-of-type {
                    border-bottom: none;
                }

                .notice-header-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }

                .notice-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                }

                .notice-badge.official {
                    background: #dbeafe;
                    color: #1e40af;
                }

                .notice-badge.event {
                    background: #dcfce7;
                    color: #16a34a;
                }

                .notice-time {
                    font-size: 10px;
                    color: #9ca3af;
                    font-weight: 600;
                }

                .notice-item-title {
                    font-size: 13px;
                    font-weight: 700;
                    color: #111827;
                    margin-bottom: 6px;
                    line-height: 1.4;
                }

                .notice-text {
                    font-size: 12px;
                    color: #6b7280;
                    line-height: 1.5;
                }

                .archive-link {
                    display: inline-block;
                    font-size: 11px;
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    margin-top: 8px;
                    border: none;
                    background: transparent;
                    cursor: pointer;
                }

                .archive-link:hover {
                    color: #1d4ed8;
                }

                /* MENTORSHIP CARD */
                .mentorship-card {
                    background: linear-gradient(135deg, #1e40af, #3b82f6);
                    border-radius: 16px;
                    padding: 28px;
                    color: white;
                    text-align: center;
                }

                .mentorship-icon {
                    margin: 0 auto 16px;
                }

                .mentorship-title {
                    font-size: 18px;
                    font-weight: 700;
                    margin-bottom: 12px;
                }

                .mentorship-text {
                    font-size: 13px;
                    line-height: 1.6;
                    opacity: 0.95;
                    margin-bottom: 20px;
                }

                .btn-mentorship {
                    width: 100%;
                    padding: 12px;
                    background: white;
                    color: #1e40af;
                    border: none;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                }

                .btn-mentorship:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }

                /* FOOTER */
                .dashboard-footer {
                    margin: 0 var(--content-gap) 24px;
                    background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
                    border: 1px solid #dbeafe;
                    border-top: 4px solid #86c440;
                    border-radius: 16px;
                    padding: 18px 20px;
                    text-align: center;
                }

                .toast {
                    position: fixed;
                    right: 20px;
                    bottom: 20px;
                    background: #0f172a;
                    color: #fff;
                    font-size: 12px;
                    padding: 10px 14px;
                    border-radius: 8px;
                    box-shadow: 0 8px 20px rgba(15, 23, 42, 0.35);
                    z-index: 100;
                }

                .footer-logo-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-bottom: 8px;
                }

                .footer-icon {
                    color: #9ca3af;
                }

                .footer-org {
                    font-size: 12px;
                    font-weight: 700;
                    color: #475569;
                    letter-spacing: 0.5px;
                }

                .footer-text {
                    font-size: 12px;
                    color: #64748b;
                    line-height: 1.55;
                    max-width: 820px;
                    margin: 0 auto;
                }

                @media (max-width: 1200px) {
                    .admin-stats-grid {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }

                    .admin-detail-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .category-grid {
                        grid-template-columns: repeat(3, minmax(0, 1fr));
                    }

                    .content-grid {
                        grid-template-columns: 1fr;
                    }
                    .member-card-wrapper {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .admin-header-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .admin-actions {
                        width: 100%;
                        justify-content: space-between;
                    }

                    .admin-stats-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .admin-detail-grid {
                        grid-template-columns: 1fr;
                    }

                    .main-content {
                        --content-gap: 10px;
                    }

                    .top-bar {
                        padding: 10px var(--content-gap);
                        flex-direction: column;
                        align-items: stretch;
                        gap: 10px;
                    }

                    .search-container {
                        width: 100%;
                    }

                    .top-bar-right {
                        width: 100%;
                        justify-content: flex-end;
                    }

                    .user-text {
                        display: none;
                    }

                    .dashboard-header {
                        padding: 16px var(--content-gap);
                        flex-direction: column;
                        gap: 12px;
                    }

                    .header-actions {
                        width: 100%;
                        flex-wrap: wrap;
                    }

                    .btn-outline,
                    .btn-primary {
                        flex: 1;
                        justify-content: center;
                    }

                    .profile-edit-grid {
                        grid-template-columns: 1fr;
                    }

                    .password-edit-grid {
                        grid-template-columns: 1fr;
                    }

                    .category-grid {
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                    }

                    .register-header-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .sidebar {
                        width: min(80vw, 280px);
                        transform: translateX(-100%);
                        transition: transform 0.25s ease;
                        box-shadow: none;
                    }

                    .sidebar.open {
                        transform: translateX(0);
                        box-shadow: 0 16px 32px rgba(15, 23, 42, 0.45);
                    }

                    .mobile-sidebar-backdrop {
                        display: block;
                        position: fixed;
                        inset: 0;
                        background: rgba(15, 23, 42, 0.45);
                        opacity: 0;
                        pointer-events: none;
                        transition: opacity 0.2s ease;
                        z-index: 80;
                    }

                    .mobile-sidebar-backdrop.open {
                        opacity: 1;
                        pointer-events: auto;
                    }

                    .mobile-sidebar-toggle {
                        display: inline-flex;
                        top: 86px;
                        left: 12px;
                        transform: none;
                    }

                    .sidebar.open + .mobile-sidebar-backdrop + .main-content .mobile-sidebar-toggle {
                        left: calc(min(80vw, 280px) - 22px);
                    }

                    .main-content {
                        margin-left: 0;
                    }

                    .member-card-wrapper {
                        margin: 0 var(--content-gap) 16px;
                        gap: 12px;
                    }

                    .member-card-main {
                        padding: 16px;
                    }

                    .member-card-content {
                        flex-direction: column;
                        gap: 14px;
                    }

                    .profile-photo,
                    .photo-placeholder {
                        width: 88px;
                        height: 88px;
                    }

                    .photo-placeholder {
                        font-size: 24px;
                    }

                    .active-indicator {
                        width: 16px;
                        height: 16px;
                        border-width: 2px;
                        bottom: 4px;
                        right: 4px;
                    }

                    .member-badges {
                        flex-wrap: wrap;
                    }

                    .member-name {
                        font-size: 20px;
                        line-height: 1.2;
                        word-break: break-word;
                    }

                    .member-meta {
                        flex-direction: column;
                        gap: 10px;
                    }

                    .download-pdf-btn {
                        position: static;
                        margin-top: 12px;
                        width: 100%;
                        justify-content: center;
                    }

                    .close-btn {
                        top: 8px;
                        right: 8px;
                        width: 30px;
                        height: 30px;
                        font-size: 15px;
                    }

                    .compliance-card {
                        padding: 16px;
                    }

                    .stat-number {
                        font-size: 26px;
                    }

                    .content-grid {
                        padding: 0 var(--content-gap) 16px;
                        gap: 14px;
                    }

                    .content-card {
                        padding: 14px;
                    }

                    .dashboard-footer {
                        margin: 0 var(--content-gap) 14px;
                        padding: 12px 10px 14px;
                        border-radius: 12px;
                    }

                    .footer-logo-section {
                        gap: 6px;
                        flex-wrap: wrap;
                        margin-bottom: 6px;
                    }

                    .footer-org {
                        font-size: 10px;
                        line-height: 1.4;
                        text-align: center;
                    }

                    .footer-text {
                        font-size: 10px;
                        line-height: 1.45;
                    }

                }
            `}</style>
        </>
    );
}
