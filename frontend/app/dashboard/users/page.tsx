'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  buildAuthHeader,
  clearAuthSession,
  getAuthToken,
  getStoredUser,
  saveAuthSession
} from '@/lib/authSession';
import { API_BASE_URL, apiRequest } from '@/lib/apiClient';

type UserRole = 'MEMBER' | 'REVIEWER' | 'ADMIN';
type ApplicationDecision = 'PENDING' | 'APPROVED' | 'REJECTED';
type MembershipGrade =
  | 'STUDENT'
  | 'GRADUATE'
  | 'ASSOCIATE'
  | 'CORPORATE'
  | 'SENIOR'
  | 'FELLOW';

const USER_ROLES: UserRole[] = ['MEMBER', 'REVIEWER', 'ADMIN'];
const MEMBERSHIP_GRADES: MembershipGrade[] = [
  'STUDENT',
  'GRADUATE',
  'ASSOCIATE',
  'CORPORATE',
  'SENIOR',
  'FELLOW'
];
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

type ApplicationStage = (typeof APPLICATION_STAGES)[number];

interface SessionUser {
  id: string;
  username: string;
  fullName?: string;
  name?: string;
  email: string;
  role: string;
}

interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  latestActivityAt: string;
  applicationsCount: number;
  documentsCount: number;
  registerCount: number;
}

interface AdminDocument {
  id: string;
  type: string;
  fileName: string;
  createdAt: string;
}

interface AdminReview {
  id: string;
  action: string;
  notes?: string | null;
  performedBy: string;
  createdAt: string;
}

interface UserApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalIdNumber: string;
  membershipGrade: MembershipGrade;
  organizationName?: string | null;
  yearsOfExperience?: number | null;
  declarationAccepted: boolean;
  bio?: string | null;
  stage: ApplicationStage;
  decision: ApplicationDecision | string;
  rejectionReason?: string | null;
  registrationNumber?: string | null;
  certificateNumber?: string | null;
  validUntil?: string | null;
  createdAt: string;
  updatedAt: string;
  documents: AdminDocument[];
  reviews: AdminReview[];
}

interface AdminUserDetail {
  id: string;
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  applicationsCount: number;
  documentsCount: number;
  registerCount: number;
  applications: UserApplication[];
}

interface UserDraft {
  username: string;
  fullName: string;
  email: string;
  role: UserRole;
}

interface ManualRegisterForm {
  membershipGrade: MembershipGrade;
  phone: string;
  nationalIdNumber: string;
  organizationName: string;
  yearsOfExperience: string;
  bio: string;
  notes: string;
  validUntil: string;
}

const INITIAL_REGISTER_FORM: ManualRegisterForm = {
  membershipGrade: 'GRADUATE',
  phone: '',
  nationalIdNumber: '',
  organizationName: '',
  yearsOfExperience: '',
  bio: '',
  notes: '',
  validUntil: ''
};

const formatDateTime = (value?: string | null) => {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return '-';
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString();
};

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M1.5 12s4.2-7.5 10.5-7.5S22.5 12 22.5 12s-4.2 7.5-10.5 7.5S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3.5 20.5l4.9-1 10-10a2.1 2.1 0 10-3-3l-10 10-1 5z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.8 5.8l4.4 4.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 7h16M9.5 3.5h5M7.5 7l.8 12.5h7.4L16.5 7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12.5l4.2 4.2L19 7.8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [drafts, setDrafts] = useState<Record<string, UserDraft>>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] =
    useState<AdminUserDetail | null>(null);
  const [registerForm, setRegisterForm] = useState<ManualRegisterForm>(
    INITIAL_REGISTER_FORM
  );
  const [stageDrafts, setStageDrafts] = useState<Record<string, ApplicationStage>>(
    {}
  );
  const [decisionDrafts, setDecisionDrafts] = useState<
    Record<string, 'APPROVED' | 'REJECTED'>
  >({});
  const [decisionNotes, setDecisionNotes] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUsersRefreshing, setIsUsersRefreshing] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [savingUserId, setSavingUserId] = useState<string | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [isPurgingUsers, setIsPurgingUsers] = useState(false);
  const [creatingRegister, setCreatingRegister] = useState(false);
  const [updatingStageId, setUpdatingStageId] = useState<string | null>(null);
  const [updatingDecisionId, setUpdatingDecisionId] = useState<string | null>(null);
  const [deletingApplicationId, setDeletingApplicationId] = useState<
    string | null
  >(null);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [deletingDocId, setDeletingDocId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const selectedUserListItem = useMemo(
    () => users.find((item) => item.id === selectedUserId) || null,
    [users, selectedUserId]
  );

  const approvedApplications = useMemo(
    () =>
      selectedUserDetail?.applications.filter(
        (application) => application.decision === 'APPROVED'
      ) || [],
    [selectedUserDetail]
  );

  const rejectedApplications = useMemo(
    () =>
      selectedUserDetail?.applications.filter(
        (application) => application.decision === 'REJECTED'
      ) || [],
    [selectedUserDetail]
  );

  const nonAdminUsers = useMemo(
    () => users.filter((item) => item.role !== 'ADMIN'),
    [users]
  );

  const getTokenOrRedirect = () => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return null;
    }
    return token;
  };

  const hydrateDrafts = (items: AdminUser[]) => {
    const next: Record<string, UserDraft> = {};
    items.forEach((item) => {
      next[item.id] = {
        username: item.username,
        fullName: item.fullName,
        email: item.email,
        role: item.role
      };
    });
    setDrafts(next);
  };

  const loadUsers = useCallback(
    async (token: string, refresh = false) => {
      if (refresh) {
        setIsUsersRefreshing(true);
      }
      setError('');

      try {
        const response = await apiRequest<AdminUser[]>('/users', {
          headers: buildAuthHeader(token)
        });

        if (response.status === 401) {
          clearAuthSession();
          router.push('/login');
          return;
        }

        if (response.status === 403) {
          router.push('/dashboard');
          return;
        }

        if (!response.ok) {
          setError('Unable to load users.');
          return;
        }

        const list = Array.isArray(response.data) ? response.data : [];
        setUsers(list);
        hydrateDrafts(list);

        if (selectedUserId && !list.some((item) => item.id === selectedUserId)) {
          setSelectedUserId(null);
          setSelectedUserDetail(null);
        }
      } catch {
        setError('Network error while loading users.');
      } finally {
        if (refresh) {
          setIsUsersRefreshing(false);
        }
      }
    },
    [router, selectedUserId]
  );

  const loadUserDetail = useCallback(
    async (userId: string, token: string) => {
      setIsDetailLoading(true);
      setError('');
      try {
        const response = await apiRequest<AdminUserDetail>(`/users/${userId}`, {
          headers: buildAuthHeader(token)
        });

        if (response.status === 401) {
          clearAuthSession();
          router.push('/login');
          return;
        }

        if (!response.ok || !response.data) {
          setError('Unable to load selected user details.');
          return;
        }

        const detail = response.data;
        setSelectedUserId(userId);
        setSelectedUserDetail(detail);

        const nextStageDrafts: Record<string, ApplicationStage> = {};
        const nextDecisionDrafts: Record<string, 'APPROVED' | 'REJECTED'> = {};
        const nextDecisionNotes: Record<string, string> = {};

        detail.applications.forEach((application) => {
          nextStageDrafts[application.id] = application.stage;
          nextDecisionDrafts[application.id] =
            application.decision === 'REJECTED' ? 'REJECTED' : 'APPROVED';
          nextDecisionNotes[application.id] = application.rejectionReason || '';
        });

        setStageDrafts(nextStageDrafts);
        setDecisionDrafts(nextDecisionDrafts);
        setDecisionNotes(nextDecisionNotes);
      } catch {
        setError('Network error while loading user detail.');
      } finally {
        setIsDetailLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const boot = async () => {
      const token = getAuthToken();
      const cachedUser = getStoredUser<SessionUser>();

      if (!token || !cachedUser) {
        router.push('/login');
        return;
      }

      let activeUser: SessionUser = cachedUser;

      try {
        const me = await apiRequest<{ user: Partial<SessionUser> }>('/auth/me', {
          headers: buildAuthHeader(token)
        });

        if (me.status === 401) {
          clearAuthSession();
          router.push('/login');
          return;
        }

        if (me.ok) {
          activeUser = { ...cachedUser, ...(me.data?.user || {}) };
          saveAuthSession(token, activeUser);
        }
      } catch {
        // keep cached session on network error
      }

      if (activeUser.role !== 'ADMIN') {
        router.push('/dashboard');
        return;
      }

      setCurrentUser(activeUser);
      await loadUsers(token);
      setIsLoading(false);
    };

    boot();
  }, [router, loadUsers]);

  useEffect(() => {
    if (!notice) {
      return;
    }
    const timer = setTimeout(() => setNotice(''), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  const refreshUsersAndDetail = async () => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }
    await loadUsers(token, true);
    if (selectedUserId) {
      await loadUserDetail(selectedUserId, token);
    }
  };

  const handleOpenUser = async (userId: string) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }
    await loadUserDetail(userId, token);
  };

  const handleSaveUser = async (user: AdminUser) => {
    const draft = drafts[user.id];
    if (!draft) {
      return;
    }

    const hasChanges =
      draft.username !== user.username ||
      draft.fullName !== user.fullName ||
      draft.email !== user.email ||
      draft.role !== user.role;

    if (!hasChanges) {
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setSavingUserId(user.id);
    setError('');
    try {
      const response = await apiRequest<AdminUser>(`/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...buildAuthHeader(token)
        },
        body: JSON.stringify({
          username: draft.username.trim(),
          fullName: draft.fullName.trim(),
          email: draft.email.trim(),
          role: draft.role
        })
      });

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const message =
          typeof response.data === 'object' && response.data !== null
            ? (response.data as { message?: string | string[] }).message
            : '';
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Failed to update user.'
        );
        return;
      }

      setNotice(`User ${user.username} updated.`);
      await refreshUsersAndDetail();
    } catch {
      setError('Network error while updating user.');
    } finally {
      setSavingUserId(null);
    }
  };

  const handleDeleteUser = async (user: AdminUser) => {
    if (currentUser?.id === user.id) {
      setError('You cannot delete your own admin account here.');
      return;
    }

    const confirmed = window.confirm(
      `Delete user ${user.username} and all membership applications?`
    );
    if (!confirmed) {
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setDeletingUserId(user.id);
    setError('');
    try {
      const response = await apiRequest<{ id: string }>(`/users/${user.id}`, {
        method: 'DELETE',
        headers: buildAuthHeader(token)
      });

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const message =
          typeof response.data === 'object' && response.data !== null
            ? (response.data as { message?: string | string[] }).message
            : '';
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Failed to delete user.'
        );
        return;
      }

      if (selectedUserId === user.id) {
        setSelectedUserId(null);
        setSelectedUserDetail(null);
      }

      setNotice(`User ${user.username} deleted.`);
      await loadUsers(token, true);
    } catch {
      setError('Network error while deleting user.');
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleDeleteAllNonAdminUsers = async () => {
    if (nonAdminUsers.length === 0) {
      setError('There are no non-admin users to delete.');
      return;
    }

    const confirmed = window.confirm(
      `Delete ${nonAdminUsers.length} non-admin user accounts and all related membership applications?`
    );
    if (!confirmed) {
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setIsPurgingUsers(true);
    setError('');
    try {
      const response = await apiRequest<{
        deletedCount: number;
        users: Array<{ id: string; username: string; email: string }>;
      }>('/users/bulk/non-admin', {
        method: 'DELETE',
        headers: buildAuthHeader(token)
      });

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const message =
          typeof response.data === 'object' && response.data !== null
            ? (response.data as { message?: string | string[] }).message
            : '';
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Failed to delete non-admin users.'
        );
        return;
      }

      setSelectedUserId(null);
      setSelectedUserDetail(null);
      setNotice(
        `${response.data?.deletedCount || 0} non-admin user(s) deleted.`
      );
      await loadUsers(token, true);
    } catch {
      setError('Network error while deleting non-admin users.');
    } finally {
      setIsPurgingUsers(false);
    }
  };

  const handleCreateRegister = async () => {
    if (!selectedUserDetail) {
      return;
    }

    if (!registerForm.phone.trim() || !registerForm.nationalIdNumber.trim()) {
      setError('Phone and National ID are required for manual register.');
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setCreatingRegister(true);
    setError('');
    try {
      const response = await apiRequest<UserApplication>(
        `/users/${selectedUserDetail.id}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeader(token)
          },
          body: JSON.stringify({
            membershipGrade: registerForm.membershipGrade,
            phone: registerForm.phone.trim(),
            nationalIdNumber: registerForm.nationalIdNumber.trim(),
            organizationName: registerForm.organizationName.trim() || undefined,
            yearsOfExperience: registerForm.yearsOfExperience
              ? Number(registerForm.yearsOfExperience)
              : undefined,
            bio: registerForm.bio.trim() || undefined,
            notes: registerForm.notes.trim() || undefined,
            validUntil: registerForm.validUntil || undefined
          })
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        const message =
          typeof response.data === 'object' && response.data !== null
            ? (response.data as { message?: string | string[] }).message
            : '';
        setError(
          Array.isArray(message)
            ? message.join(', ')
            : message || 'Failed to create manual register.'
        );
        return;
      }

      setNotice('Manual register created.');
      setRegisterForm(INITIAL_REGISTER_FORM);
      await refreshUsersAndDetail();
    } catch {
      setError('Network error while creating register.');
    } finally {
      setCreatingRegister(false);
    }
  };

  const handleSaveStage = async (application: UserApplication) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    const nextStage = stageDrafts[application.id] || application.stage;

    setUpdatingStageId(application.id);
    setError('');
    try {
      const response = await apiRequest<UserApplication>(
        `/memberships/applications/${application.id}/stage`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeader(token)
          },
          body: JSON.stringify({
            stage: nextStage
          })
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError('Failed to update application stage.');
        return;
      }

      setNotice(`Stage updated for application ${application.id.slice(-6)}.`);
      await refreshUsersAndDetail();
    } catch {
      setError('Network error while updating stage.');
    } finally {
      setUpdatingStageId(null);
    }
  };

  const handleSaveDecision = async (
    application: UserApplication,
    forcedDecision?: 'APPROVED' | 'REJECTED'
  ) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    const decision = forcedDecision || decisionDrafts[application.id] || 'APPROVED';
    const notes = decisionNotes[application.id]?.trim() || undefined;

    setUpdatingDecisionId(application.id);
    setError('');
    try {
      const response = await apiRequest<UserApplication>(
        `/memberships/applications/${application.id}/decision`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...buildAuthHeader(token)
          },
          body: JSON.stringify({
            decision,
            notes
          })
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError('Failed to save decision.');
        return;
      }

      if (forcedDecision) {
        setDecisionDrafts((prev) => ({
          ...prev,
          [application.id]: forcedDecision
        }));
      }

      setNotice(
        `${decision} saved for application ${application.id.slice(-6)}.`
      );
      await refreshUsersAndDetail();
    } catch {
      setError('Network error while saving decision.');
    } finally {
      setUpdatingDecisionId(null);
    }
  };

  const handleDeleteApplication = async (application: UserApplication) => {
    const confirmed = window.confirm(
      `Delete application ${application.id.slice(-6)} permanently?`
    );
    if (!confirmed) {
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setDeletingApplicationId(application.id);
    setError('');
    try {
      const response = await apiRequest<{ id: string }>(
        `/memberships/applications/${application.id}`,
        {
          method: 'DELETE',
          headers: buildAuthHeader(token)
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError('Failed to delete application.');
        return;
      }

      setNotice(`Application ${application.id.slice(-6)} deleted.`);
      await refreshUsersAndDetail();
    } catch {
      setError('Network error while deleting application.');
    } finally {
      setDeletingApplicationId(null);
    }
  };

  const handleDownloadDocument = async (
    applicationId: string,
    doc: AdminDocument
  ) => {
    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setDownloadingDocId(doc.id);
    setError('');
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
        setError('Failed to download document.');
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
      setError('Network error while downloading document.');
    } finally {
      setDownloadingDocId(null);
    }
  };

  const handleDeleteDocument = async (
    applicationId: string,
    doc: AdminDocument
  ) => {
    const confirmed = window.confirm(
      `Delete document ${doc.type} from application ${applicationId.slice(-6)}?`
    );
    if (!confirmed) {
      return;
    }

    const token = getTokenOrRedirect();
    if (!token) {
      return;
    }

    setDeletingDocId(doc.id);
    setError('');
    try {
      const response = await apiRequest<{ id: string }>(
        `/memberships/applications/${applicationId}/documents/${doc.id}`,
        {
          method: 'DELETE',
          headers: buildAuthHeader(token)
        }
      );

      if (response.status === 401) {
        clearAuthSession();
        router.push('/login');
        return;
      }

      if (!response.ok) {
        setError('Failed to delete document.');
        return;
      }

      setNotice(`Document ${doc.type} deleted.`);
      await refreshUsersAndDetail();
    } catch {
      setError('Network error while deleting document.');
    } finally {
      setDeletingDocId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="state-wrap">
        <p>Loading admin users...</p>
      </div>
    );
  }

  return (
    <div className="admin-users-page">
      <div className="top-row">
        <div>
          <h1>Admin Users, Memberships, Documents and Registers</h1>
          <p>
            Logged in as <strong>{currentUser?.username}</strong>. You can manage
            users, applications, documents, and register records.
          </p>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="btn danger"
            onClick={handleDeleteAllNonAdminUsers}
            disabled={isPurgingUsers || nonAdminUsers.length === 0}
          >
            {isPurgingUsers
              ? 'Deleting Non-Admins...'
              : `Delete All Non-Admin Users (${nonAdminUsers.length})`}
          </button>
          <button
            type="button"
            className="btn secondary"
            onClick={refreshUsersAndDetail}
            disabled={isUsersRefreshing}
          >
            {isUsersRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link href="/dashboard" className="btn secondary">
            Back to Dashboard
          </Link>
        </div>
      </div>

      {error && <p className="message error">{error}</p>}
      {!error && notice && <p className="message success">{notice}</p>}

      <div className="table-wrap">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Apps</th>
              <th>Docs</th>
              <th>Registers</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={9} className="empty-cell">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => {
              const draft = drafts[user.id] || {
                username: user.username,
                fullName: user.fullName,
                email: user.email,
                role: user.role
              };
              const isSelf = currentUser?.id === user.id;
              return (
                <tr
                  key={user.id}
                  className={selectedUserId === user.id ? 'selected-row' : ''}
                >
                  <td>
                    <input
                      value={draft.username}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [user.id]: {
                            ...draft,
                            username: event.target.value
                          }
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={draft.fullName}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [user.id]: {
                            ...draft,
                            fullName: event.target.value
                          }
                        }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      value={draft.email}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [user.id]: {
                            ...draft,
                            email: event.target.value
                          }
                        }))
                      }
                    />
                  </td>
                  <td>
                    <select
                      value={draft.role}
                      disabled={isSelf}
                      onChange={(event) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [user.id]: {
                            ...draft,
                            role: event.target.value as UserRole
                          }
                        }))
                      }
                    >
                      {USER_ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{user.applicationsCount}</td>
                  <td>{user.documentsCount}</td>
                  <td>{user.registerCount}</td>
                  <td>{new Date(user.latestActivityAt).toLocaleString()}</td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn tiny secondary icon-btn"
                        onClick={() => handleOpenUser(user.id)}
                      >
                        <span className="btn-icon">
                          <EyeIcon />
                        </span>
                        <span>Open</span>
                      </button>
                      <button
                        type="button"
                        className="btn tiny icon-btn"
                        onClick={() => handleSaveUser(user)}
                        disabled={savingUserId === user.id}
                      >
                        <span className="btn-icon">
                          <PencilIcon />
                        </span>
                        <span>{savingUserId === user.id ? 'Saving...' : 'Edit'}</span>
                      </button>
                      {!isSelf && (
                        <button
                          type="button"
                          className="btn tiny danger icon-btn"
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingUserId === user.id}
                        >
                          <span className="btn-icon">
                            <TrashIcon />
                          </span>
                          <span>
                            {deletingUserId === user.id ? 'Deleting...' : 'Delete'}
                          </span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <section className="detail-section">
        <div className="detail-header">
          <h2>
            {selectedUserListItem
              ? `User Detail: ${selectedUserListItem.username}`
              : 'Select a user to manage applications/documents'}
          </h2>
          {isDetailLoading && <span className="detail-loading">Loading detail...</span>}
        </div>

        {selectedUserDetail && (
          <>
            <div className="summary-grid">
              <div className="summary-card">
                <p className="label">Applications</p>
                <p className="value">{selectedUserDetail.applicationsCount}</p>
              </div>
              <div className="summary-card">
                <p className="label">Documents</p>
                <p className="value">{selectedUserDetail.documentsCount}</p>
              </div>
              <div className="summary-card">
                <p className="label">Register Records</p>
                <p className="value">{selectedUserDetail.registerCount}</p>
              </div>
              <div className="summary-card">
                <p className="label">Role</p>
                <p className="value">{selectedUserDetail.role}</p>
              </div>
            </div>

            <div className="decision-lists-grid">
              <div className="decision-list-card approved">
                <h3>Approved List ({approvedApplications.length})</h3>
                {approvedApplications.length === 0 ? (
                  <p className="empty-note">No approved applications yet.</p>
                ) : (
                  <div className="decision-list-wrap">
                    {approvedApplications.map((application) => (
                      <p key={application.id} className="decision-item">
                        #{application.id.slice(-6)} | {application.fullName} |{' '}
                        {application.membershipGrade} | Reg:{' '}
                        {application.registrationNumber || '-'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              <div className="decision-list-card rejected">
                <h3>Rejected List ({rejectedApplications.length})</h3>
                {rejectedApplications.length === 0 ? (
                  <p className="empty-note">No rejected applications yet.</p>
                ) : (
                  <div className="decision-list-wrap">
                    {rejectedApplications.map((application) => (
                      <p key={application.id} className="decision-item">
                        #{application.id.slice(-6)} | {application.fullName} |{' '}
                        {application.membershipGrade} | Reason:{' '}
                        {application.rejectionReason || '-'}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="manual-register-card">
              <h3>Create New Register (Admin)</h3>
              <div className="manual-grid">
                <div>
                  <label>Membership Grade</label>
                  <select
                    value={registerForm.membershipGrade}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        membershipGrade: event.target.value as MembershipGrade
                      }))
                    }
                  >
                    {MEMBERSHIP_GRADES.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label>Phone *</label>
                  <input
                    value={registerForm.phone}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        phone: event.target.value
                      }))
                    }
                  />
                </div>
                <div>
                  <label>National ID *</label>
                  <input
                    value={registerForm.nationalIdNumber}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        nationalIdNumber: event.target.value
                      }))
                    }
                  />
                </div>
                <div>
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    min={0}
                    value={registerForm.yearsOfExperience}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        yearsOfExperience: event.target.value
                      }))
                    }
                  />
                </div>
                <div>
                  <label>Organization</label>
                  <input
                    value={registerForm.organizationName}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        organizationName: event.target.value
                      }))
                    }
                  />
                </div>
                <div>
                  <label>Valid Until</label>
                  <input
                    type="date"
                    value={registerForm.validUntil}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        validUntil: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="full">
                  <label>Bio</label>
                  <textarea
                    rows={2}
                    value={registerForm.bio}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        bio: event.target.value
                      }))
                    }
                  />
                </div>
                <div className="full">
                  <label>Notes</label>
                  <textarea
                    rows={2}
                    value={registerForm.notes}
                    onChange={(event) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        notes: event.target.value
                      }))
                    }
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn"
                onClick={handleCreateRegister}
                disabled={creatingRegister}
              >
                {creatingRegister ? 'Creating...' : 'Create Register Entry'}
              </button>
            </div>

            <div className="applications-wrap">
              {selectedUserDetail.applications.length === 0 && (
                <p className="empty-note">No membership applications for this user.</p>
              )}

              {selectedUserDetail.applications.map((application) => (
                <article key={application.id} className="application-card">
                  <div className="application-top">
                    <div>
                      <h4>
                        Application {application.id.slice(-6)} | {application.membershipGrade}
                      </h4>
                      <p className="meta">
                        Decision: <strong>{application.decision}</strong> | Stage:{' '}
                        <strong>{application.stage}</strong>
                      </p>
                      <p className="meta">
                        Reg: {application.registrationNumber || '-'} | Cert:{' '}
                        {application.certificateNumber || '-'}
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn tiny danger icon-btn"
                      onClick={() => handleDeleteApplication(application)}
                      disabled={deletingApplicationId === application.id}
                    >
                      <span className="btn-icon">
                        <TrashIcon />
                      </span>
                      <span>
                        {deletingApplicationId === application.id
                          ? 'Deleting...'
                          : 'Delete Application'}
                      </span>
                    </button>
                  </div>

                  <div className="application-details-grid">
                    <div className="detail-item">
                      <p className="item-label">Full Name</p>
                      <p className="item-value">{application.fullName}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Email</p>
                      <p className="item-value">{application.email}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Phone</p>
                      <p className="item-value">{application.phone}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">National ID</p>
                      <p className="item-value">{application.nationalIdNumber}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Organization</p>
                      <p className="item-value">{application.organizationName || '-'}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Experience</p>
                      <p className="item-value">
                        {typeof application.yearsOfExperience === 'number'
                          ? `${application.yearsOfExperience} years`
                          : '-'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Declaration</p>
                      <p className="item-value">
                        {application.declarationAccepted ? 'Accepted' : 'Not accepted'}
                      </p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Valid Until</p>
                      <p className="item-value">{formatDate(application.validUntil)}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Created</p>
                      <p className="item-value">{formatDateTime(application.createdAt)}</p>
                    </div>
                    <div className="detail-item">
                      <p className="item-label">Updated</p>
                      <p className="item-value">{formatDateTime(application.updatedAt)}</p>
                    </div>
                  </div>

                  {application.bio && (
                    <p className="application-bio">
                      <strong>Bio:</strong> {application.bio}
                    </p>
                  )}
                  {application.decision === 'REJECTED' && application.rejectionReason && (
                    <p className="application-rejection">
                      <strong>Rejection reason:</strong> {application.rejectionReason}
                    </p>
                  )}

                  <div className="application-actions">
                    <div className="inline-form">
                      <label>Stage</label>
                      <select
                        value={stageDrafts[application.id] || application.stage}
                        onChange={(event) =>
                          setStageDrafts((prev) => ({
                            ...prev,
                            [application.id]: event.target.value as ApplicationStage
                          }))
                        }
                      >
                        {APPLICATION_STAGES.map((stage) => (
                          <option key={stage} value={stage}>
                            {stage}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="btn tiny icon-btn"
                        onClick={() => handleSaveStage(application)}
                        disabled={updatingStageId === application.id}
                      >
                        <span className="btn-icon">
                          <PencilIcon />
                        </span>
                        <span>
                          {updatingStageId === application.id ? 'Saving...' : 'Save Stage'}
                        </span>
                      </button>
                    </div>

                    <div className="inline-form">
                      <label>Decision</label>
                      <select
                        value={decisionDrafts[application.id] || 'APPROVED'}
                        onChange={(event) =>
                          setDecisionDrafts((prev) => ({
                            ...prev,
                            [application.id]: event.target.value as 'APPROVED' | 'REJECTED'
                          }))
                        }
                      >
                        <option value="APPROVED">APPROVED</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                      <input
                        placeholder="Decision notes"
                        value={decisionNotes[application.id] || ''}
                        onChange={(event) =>
                          setDecisionNotes((prev) => ({
                            ...prev,
                            [application.id]: event.target.value
                          }))
                        }
                      />
                      <button
                        type="button"
                        className="btn tiny icon-btn"
                        onClick={() => handleSaveDecision(application)}
                        disabled={updatingDecisionId === application.id}
                      >
                        <span className="btn-icon">
                          <PencilIcon />
                        </span>
                        <span>
                          {updatingDecisionId === application.id
                            ? 'Saving...'
                            : 'Save Decision'}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn tiny approve icon-btn"
                        onClick={() => handleSaveDecision(application, 'APPROVED')}
                        disabled={updatingDecisionId === application.id}
                      >
                        <span className="btn-icon">
                          <CheckIcon />
                        </span>
                        <span>
                          {updatingDecisionId === application.id ? 'Working...' : 'Approve'}
                        </span>
                      </button>
                      <button
                        type="button"
                        className="btn tiny danger icon-btn"
                        onClick={() => handleSaveDecision(application, 'REJECTED')}
                        disabled={updatingDecisionId === application.id}
                      >
                        <span className="btn-icon">
                          <XIcon />
                        </span>
                        <span>
                          {updatingDecisionId === application.id ? 'Working...' : 'Reject'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="reviews-area">
                    <p className="documents-title">
                      Review History ({application.reviews.length})
                    </p>
                    {application.reviews.length === 0 && (
                      <p className="empty-note">No review actions yet.</p>
                    )}
                    {application.reviews.length > 0 && (
                      <div className="review-list">
                        {application.reviews.map((review) => (
                          <div key={review.id} className="review-item">
                            <p>
                              <strong>{review.action}</strong> by {review.performedBy} on{' '}
                              {formatDateTime(review.createdAt)}
                            </p>
                            {review.notes && <p>{review.notes}</p>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="documents-area">
                    <p className="documents-title">
                      Documents ({application.documents.length})
                    </p>
                    {application.documents.length === 0 && (
                      <p className="empty-note">No documents uploaded.</p>
                    )}
                    <div className="documents-list">
                      {application.documents.map((doc) => (
                        <div key={doc.id} className="document-chip">
                          <span>{doc.type}</span>
                          <button
                            type="button"
                            className="btn tiny secondary"
                            onClick={() =>
                              handleDownloadDocument(application.id, doc)
                            }
                            disabled={downloadingDocId === doc.id}
                          >
                            {downloadingDocId === doc.id ? '...' : 'Download'}
                          </button>
                          <button
                            type="button"
                            className="btn tiny danger icon-btn"
                            onClick={() =>
                              handleDeleteDocument(application.id, doc)
                            }
                            disabled={deletingDocId === doc.id}
                          >
                            <span className="btn-icon">
                              <TrashIcon />
                            </span>
                            <span>{deletingDocId === doc.id ? '...' : 'Delete'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      <style jsx>{`
        .admin-users-page { min-height: 100vh; background: #f8fafc; padding: 20px; color: #0f172a; }
        .top-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 12px; }
        h1 { margin: 0 0 6px; font-size: 24px; line-height: 1.2; }
        p { margin: 0; color: #475569; font-size: 14px; }
        .top-actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .btn { border: 1px solid #2563eb; background: linear-gradient(180deg, #3b82f6 0%, #2563eb 100%); color: #fff; border-radius: 10px; padding: 8px 12px; font-size: 13px; font-weight: 700; text-decoration: none; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 6px; line-height: 1; transition: transform 0.16s ease, box-shadow 0.16s ease, filter 0.16s ease; box-shadow: 0 3px 8px rgba(37, 99, 235, 0.2); }
        .btn.secondary { background: #fff; color: #1e3a8a; border-color: #cbd5e1; box-shadow: 0 2px 6px rgba(15, 23, 42, 0.08); }
        .btn.approve { background: linear-gradient(180deg, #22c55e 0%, #16a34a 100%); color: #fff; border-color: #15803d; box-shadow: 0 3px 8px rgba(22, 163, 74, 0.24); }
        .btn.danger { background: linear-gradient(180deg, #ef4444 0%, #dc2626 100%); color: #fff; border-color: #b91c1c; box-shadow: 0 3px 8px rgba(220, 38, 38, 0.24); }
        .btn.tiny { padding: 6px 8px; font-size: 11px; border-radius: 8px; }
        .btn.icon-btn { min-width: 0; }
        .btn-icon { width: 13px; height: 13px; display: inline-flex; align-items: center; justify-content: center; }
        .btn-icon :global(svg) { width: 100%; height: 100%; }
        .btn:not(:disabled):hover { transform: translateY(-1px); filter: brightness(1.02); }
        .btn:not(:disabled):active { transform: translateY(0); }
        .btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .message { border-radius: 8px; padding: 10px 12px; font-size: 13px; margin: 0 0 12px; }
        .message.error { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }
        .message.success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
        .table-wrap { border: 1px solid #e2e8f0; border-radius: 12px; overflow-x: auto; background: #fff; }
        .users-table { width: 100%; border-collapse: collapse; min-width: 1200px; }
        .users-table th, .users-table td { padding: 9px 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; text-align: left; vertical-align: top; }
        .users-table th { font-size: 11px; letter-spacing: 0.3px; color: #64748b; background: #f8fafc; font-weight: 800; }
        .users-table input, .users-table select { width: 100%; min-width: 120px; border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 8px; font-size: 12px; color: #0f172a; background: #fff; }
        .row-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .row-actions .btn.icon-btn { min-width: 78px; }
        .selected-row { background: #f8fbff; }
        .empty-cell { text-align: center; color: #64748b; }
        .detail-section { margin-top: 14px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fff; padding: 14px; }
        .detail-header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
        .detail-header h2 { margin: 0; font-size: 17px; color: #0f172a; }
        .detail-loading { font-size: 12px; color: #334155; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
        .summary-card { border: 1px solid #dbeafe; border-radius: 10px; padding: 10px; background: #f8fbff; }
        .summary-card .label { font-size: 11px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
        .summary-card .value { font-size: 22px; color: #1d4ed8; font-weight: 900; line-height: 1.1; margin-top: 4px; }
        .decision-lists-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-bottom: 12px; }
        .decision-list-card { border: 1px solid #dbeafe; border-radius: 12px; padding: 10px; background: #f8fbff; }
        .decision-list-card h3 { margin: 0 0 8px; font-size: 13px; color: #0f172a; }
        .decision-list-card.approved { border-color: #bbf7d0; background: #f0fdf4; }
        .decision-list-card.rejected { border-color: #fecaca; background: #fff1f2; }
        .decision-list-wrap { display: flex; flex-direction: column; gap: 6px; max-height: 140px; overflow-y: auto; }
        .decision-item { font-size: 11px; color: #0f172a; line-height: 1.45; }
        .manual-register-card { border: 1px solid #dbeafe; border-radius: 12px; background: #f8fbff; padding: 12px; margin-bottom: 12px; }
        .manual-register-card h3 { margin: 0 0 8px; font-size: 14px; color: #0f172a; }
        .manual-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px 10px; margin-bottom: 10px; }
        .manual-grid .full { grid-column: 1 / -1; }
        .manual-grid label { display: block; font-size: 11px; color: #334155; font-weight: 700; margin-bottom: 4px; }
        .manual-grid input, .manual-grid select, .manual-grid textarea { width: 100%; border: 1px solid #cbd5e1; border-radius: 8px; padding: 7px 8px; font-size: 12px; color: #0f172a; background: #fff; }
        .applications-wrap { display: flex; flex-direction: column; gap: 10px; }
        .application-card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; background: #fff; }
        .application-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; margin-bottom: 8px; }
        .application-top h4 { margin: 0; font-size: 13px; color: #0f172a; }
        .meta { margin-top: 3px; font-size: 11px; color: #475569; }
        .application-details-grid { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 8px; margin-bottom: 8px; }
        .detail-item { border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; padding: 8px; }
        .item-label { font-size: 10px; color: #64748b; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; }
        .item-value { margin-top: 4px; font-size: 12px; color: #0f172a; word-break: break-word; }
        .application-bio, .application-rejection { margin: 0 0 8px; font-size: 12px; color: #334155; line-height: 1.45; }
        .application-rejection { color: #b91c1c; }
        .application-actions { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 8px; }
        .application-actions .btn.icon-btn { min-width: 96px; }
        .inline-form { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
        .inline-form label { font-size: 11px; color: #334155; font-weight: 700; }
        .inline-form input, .inline-form select { border: 1px solid #cbd5e1; border-radius: 8px; padding: 6px 8px; font-size: 12px; min-width: 130px; color: #0f172a; background: #fff; }
        .reviews-area { border-top: 1px solid #e2e8f0; padding-top: 8px; margin-bottom: 8px; }
        .review-list { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
        .review-item { border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; padding: 6px 8px; }
        .review-item p { font-size: 11px; color: #334155; margin: 0; line-height: 1.45; }
        .review-item p + p { margin-top: 3px; }
        .documents-area { border-top: 1px solid #e2e8f0; padding-top: 8px; }
        .documents-title { font-size: 12px; color: #334155; font-weight: 700; }
        .documents-list { margin-top: 6px; display: flex; flex-wrap: wrap; gap: 6px; }
        .document-chip { border: 1px solid #dbeafe; background: #eff6ff; border-radius: 999px; padding: 4px 8px; display: inline-flex; align-items: center; gap: 6px; font-size: 11px; color: #1e3a8a; }
        .empty-note { color: #64748b; font-size: 12px; }
        .state-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; color: #334155; font-size: 14px; }
        @media (max-width: 1200px) {
          .summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .decision-lists-grid { grid-template-columns: 1fr; }
          .application-details-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }
        @media (max-width: 768px) {
          .admin-users-page { padding: 12px; }
          .top-row { flex-direction: column; }
          .top-actions { width: 100%; }
          .btn.secondary { width: 100%; text-align: center; }
          .summary-grid { grid-template-columns: 1fr; }
          .manual-grid { grid-template-columns: 1fr; }
          .application-details-grid { grid-template-columns: 1fr; }
          .inline-form input, .inline-form select { min-width: 0; width: 100%; }
        }
      `}</style>
    </div>
  );
}
