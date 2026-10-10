'use client';

import { useEffect, useMemo, useState } from 'react';
import { buildAuthHeader, getAuthToken, getStoredUser, patchStoredUser } from '@/lib/authSession';
import { apiJsonRequest, apiRequest, API_BASE_URL } from '@/lib/apiClient';
import { engineeringDivisions } from '@/data/institution';
import { countries } from '@/data/countries';
import { sanitizeName } from '@/lib/inputSanitizers';
import { acceptAttr, gradeDocuments, type DocumentField } from '@/data/grade-documents';
import { gradeRequirements, type GradeCode } from '@/data/grade-requirements';

interface StoredUser {
  id?: string;
  fullName?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  role?: string;
  grade?: string;
  gradeLabel?: string;
  title?: string;
  gender?: string;
  dateOfBirth?: string;
  discipline?: string;
  specialization?: string;
  phone?: string;
  alternativePhone?: string;
  nationalId?: string;
  city?: string;
  address?: string;
  district?: string;
  nationality?: string;
}

type TabKey =
  | 'BIO'
  | 'CONTACTS'
  | 'ACADEMIC'
  | 'INSTITUTIONAL'
  | 'WORK'
  | 'REFEREES'
  | 'ATTACHMENTS';

const TABS: Array<{ key: TabKey; label: string }> = [
  { key: 'BIO', label: 'Bio' },
  { key: 'CONTACTS', label: 'Contacts' },
  { key: 'ACADEMIC', label: 'Academic Qualifications' },
  { key: 'INSTITUTIONAL', label: 'Institutional Membership' },
  { key: 'WORK', label: 'Work Experience' },
  { key: 'REFEREES', label: 'Referees' },
  { key: 'ATTACHMENTS', label: 'Supporting Documents' },
];

interface ApplicationDoc {
  id: string;
  type: string;
  fileName?: string;
}

interface ApplicationSummary {
  id?: string;
  membershipGrade?: string;
  organizationName?: string | null;
  yearsOfExperience?: number | null;
  bio?: string | null;
  documents?: ApplicationDoc[];
}

const Field = ({ label, value }: { label: string; value?: string | null }) => (
  <div>
    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-semibold text-[#035CB3]">
      {value && String(value).trim() !== '' ? value : '-'}
    </p>
  </div>
);

const QualTable = ({
  rows,
  onDelete,
}: {
  rows: Qualification[];
  onDelete: (id: string) => void;
}) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-slate-100 text-[11px] tracking-wide text-slate-500">
          <th className="px-4 py-2 text-left font-semibold">Institution</th>
          <th className="px-4 py-2 text-left font-semibold">Certificate</th>
          <th className="px-4 py-2 text-left font-semibold">Certificate No.</th>
          <th className="px-4 py-2 text-left font-semibold">From</th>
          <th className="px-4 py-2 text-left font-semibold">To</th>
          <th className="px-4 py-2 text-right font-semibold">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-8 text-center text-xs italic text-slate-400">
              No data available
            </td>
          </tr>
        )}
        {rows.map((r) => (
          <tr key={r.id} className="border-b border-slate-50 last:border-b-0">
            <td className="px-4 py-2 text-sm text-[#035CB3]">{r.institution}</td>
            <td className="px-4 py-2 text-sm text-slate-700">{r.certificate}</td>
            <td className="px-4 py-2 text-xs font-mono text-slate-700">{r.certificateNo}</td>
            <td className="px-4 py-2 text-xs text-slate-600">{r.startDate}</td>
            <td className="px-4 py-2 text-xs text-slate-600">{r.endDate}</td>
            <td className="px-4 py-2 text-right">
              <button
                type="button"
                onClick={() => onDelete(r.id)}
                aria-label="Delete qualification"
                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h12M8 6V4h4v2M6 6l1 12h6l1-12" />
                </svg>
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EmptyPanel = ({ title, hint }: { title: string; hint: string }) => (
  <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 px-6 py-10 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="4" width="14" height="14" rx="2" />
        <path d="M3 8h14M7 12h6" strokeLinecap="round" />
      </svg>
    </div>
    <p className="text-sm font-semibold text-[#035CB3]">{title}</p>
    <p className="max-w-xs text-xs text-slate-500">{hint}</p>
  </div>
);

interface BioForm {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  city: string;
  discipline: string;
  specialization: string;
}

interface ContactsForm {
  phone: string;
  alternativePhone: string;
  address: string;
  district: string;
  city: string;
  nationality: string;
}

interface WorkContact {
  id: string;
  email: string;
  phone: string;
  alternativePhone: string;
  address: string;
  district: string;
  city: string;
  country: string;
}

type QualificationCategory = 'ACADEMIC' | 'OTHER';

interface Qualification {
  id: string;
  category: QualificationCategory;
  institution: string;
  certificate: string;
  startDate: string;
  endDate: string;
  certificateNo: string;
}

interface InstitutionMembership {
  id: string;
  institution: string;
  registrationNo: string;
  membershipType: string;
  yearOfRegistration: string;
  certificateFileName?: string;
  certificateDataUrl?: string;
}

interface WorkExperience {
  id: string;
  employer: string;
  sector: string;
  positionHeld: string;
  fromDate: string;
  toDate: string;      // empty when `current` is true
  current: boolean;
  responsibilities: string;
}

interface Referee {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  placeOfWork: string;
  designation: string;
  memberNo: string;
  refereeType: string;
}

const REFEREE_TYPES = ['PROPOSER', 'SECONDER'];

// IES-focused engineering sectors - feel free to trim/rename in one place.
const IES_SECTORS = [
  'Civil Engineering',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Chemical Engineering',
  'Petroleum & Gas Engineering',
  'Mining Engineering',
  'Telecommunications & ICT',
  'Water & Sanitation',
  'Environmental Engineering',
  'Structural / Building',
  'Roads & Transportation',
  'Energy & Power',
  'Marine & Offshore',
  'Aerospace',
  'Agricultural / Food Engineering',
  'Manufacturing / Industrial',
  'Construction Management',
  'Public Sector / Government',
  'Consulting / Advisory',
  'Academia / Research',
  'NGO / Humanitarian',
  'Other',
];

const MEMBERSHIP_TYPES = [
  'Student Member',
  'Graduate Member',
  'Associate Member',
  'Full/Corporate Member',
  'Senior Member',
  'Fellow',
  'Honorary Member',
  'Affiliate',
  'Other',
];

const CERTIFICATE_OPTIONS = [
  'PhD',
  'Masters',
  'Bachelors',
  'Postgraduate Diploma',
  'Diploma',
  'Higher Diploma',
  'Certificate',
  'Professional Certification',
  'Other',
];

const OTHER_CERTIFICATE_OPTIONS = [
  'O Level',
  'A Level',
  'KCSE',
  'KCPE',
  'High School',
  'Vocational Training',
  'Short Course',
  'Other',
];

const emptyContacts = (u?: StoredUser | null): ContactsForm => ({
  phone: u?.phone ?? '',
  alternativePhone: u?.alternativePhone ?? '',
  address: u?.address ?? '',
  district: u?.district ?? '',
  city: u?.city ?? '',
  nationality: u?.nationality ?? '',
});

const emptyBio = (u?: StoredUser | null): BioForm => ({
  title: u?.title ?? '',
  firstName: u?.firstName ?? '',
  middleName: u?.middleName ?? '',
  lastName: u?.lastName ?? '',
  gender: u?.gender ?? '',
  dateOfBirth: (u?.dateOfBirth ?? '').slice(0, 10),
  nationality: u?.nationality ?? '',
  city: u?.city ?? '',
  discipline: u?.discipline ?? '',
  specialization: u?.specialization ?? '',
});

export default function MyProfilePage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [tab, setTab] = useState<TabKey>('BIO');
  const [app, setApp] = useState<ApplicationSummary | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Bio edit-mode state
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<BioForm>(emptyBio(null));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  // Contacts edit-mode state
  const [editingContacts, setEditingContacts] = useState(false);
  const [contactsForm, setContactsForm] = useState<ContactsForm>(emptyContacts(null));
  const [savingContacts, setSavingContacts] = useState(false);
  const [contactsError, setContactsError] = useState<string | null>(null);
  const [contactsNotice, setContactsNotice] = useState<string | null>(null);

  // Qualifications (persisted per-user in localStorage until a backend endpoint lands)
  const [qualifications, setQualifications] = useState<Qualification[]>([]);
  const [modalCategory, setModalCategory] = useState<QualificationCategory | null>(null);
  const [qualForm, setQualForm] = useState({
    institution: '',
    certificate: '',
    startDate: '',
    endDate: '',
    certificateNo: '',
  });
  const [qualError, setQualError] = useState<string | null>(null);

  const qualificationsKey = useMemo(
    () => `ies:qualifications:${user?.id ?? user?.username ?? 'anon'}`,
    [user?.id, user?.username],
  );

  useEffect(() => {
    if (!user) return;
    try {
      const raw = window.localStorage.getItem(qualificationsKey);
      setQualifications(raw ? (JSON.parse(raw) as Qualification[]) : []);
    } catch {
      setQualifications([]);
    }
  }, [user, qualificationsKey]);

  const persistQualifications = (next: Qualification[]) => {
    setQualifications(next);
    try {
      window.localStorage.setItem(qualificationsKey, JSON.stringify(next));
    } catch {
      /* storage unavailable - keep in memory */
    }
  };

  const openAddQual = (category: QualificationCategory) => {
    setQualForm({ institution: '', certificate: '', startDate: '', endDate: '', certificateNo: '' });
    setQualError(null);
    setModalCategory(category);
  };

  const closeModal = () => {
    setModalCategory(null);
    setQualError(null);
  };

  const submitQual = (event: React.FormEvent) => {
    event.preventDefault();
    if (!modalCategory) return;
    if (!qualForm.institution.trim() || !qualForm.certificate || !qualForm.startDate || !qualForm.endDate || !qualForm.certificateNo.trim()) {
      setQualError('All fields marked * are required.');
      return;
    }
    if (qualForm.startDate > qualForm.endDate) {
      setQualError('End Date must be on or after Start Date.');
      return;
    }
    const entry: Qualification = {
      id: `q_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      category: modalCategory,
      institution: qualForm.institution.trim(),
      certificate: qualForm.certificate,
      startDate: qualForm.startDate,
      endDate: qualForm.endDate,
      certificateNo: qualForm.certificateNo.trim(),
    };
    persistQualifications([...qualifications, entry]);
    closeModal();
  };

  const deleteQual = (id: string) => {
    if (!window.confirm('Delete this qualification?')) return;
    persistQualifications(qualifications.filter((q) => q.id !== id));
  };

  const academicList = qualifications.filter((q) => q.category === 'ACADEMIC');
  const otherList = qualifications.filter((q) => q.category === 'OTHER');

  // Institution memberships (also localStorage-backed until backend endpoint lands)
  const [institutions, setInstitutions] = useState<InstitutionMembership[]>([]);
  const [instModalOpen, setInstModalOpen] = useState(false);
  const [instForm, setInstForm] = useState<{
    institution: string;
    registrationNo: string;
    membershipType: string;
    yearOfRegistration: string;
    certificateFile: File | null;
  }>({
    institution: '',
    registrationNo: '',
    membershipType: '',
    yearOfRegistration: '',
    certificateFile: null,
  });
  const [instError, setInstError] = useState<string | null>(null);

  const institutionsKey = useMemo(
    () => `ies:institutions:${user?.id ?? user?.username ?? 'anon'}`,
    [user?.id, user?.username],
  );

  useEffect(() => {
    if (!user) return;
    try {
      const raw = window.localStorage.getItem(institutionsKey);
      setInstitutions(raw ? (JSON.parse(raw) as InstitutionMembership[]) : []);
    } catch {
      setInstitutions([]);
    }
  }, [user, institutionsKey]);

  const persistInstitutions = (next: InstitutionMembership[]) => {
    setInstitutions(next);
    try {
      window.localStorage.setItem(institutionsKey, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const openAddInstitution = () => {
    setInstForm({
      institution: '',
      registrationNo: '',
      membershipType: '',
      yearOfRegistration: '',
      certificateFile: null,
    });
    setInstError(null);
    setInstModalOpen(true);
  };

  const closeInstModal = () => {
    setInstModalOpen(false);
    setInstError(null);
  };

  const submitInstitution = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!instForm.institution.trim() || !instForm.registrationNo.trim() || !instForm.membershipType || !instForm.yearOfRegistration) {
      setInstError('All fields marked * are required.');
      return;
    }
    const year = Number(instForm.yearOfRegistration);
    const currentYear = new Date().getFullYear();
    if (!Number.isFinite(year) || year < 1900 || year > currentYear) {
      setInstError(`Year of Registration must be a valid year between 1900 and ${currentYear}.`);
      return;
    }
    if (!instForm.certificateFile) {
      setInstError('Please attach a membership certificate (PNG or JPEG).');
      return;
    }
    if (!/\.(png|jpe?g)$/i.test(instForm.certificateFile.name)) {
      setInstError('Certificate must be a PNG or JPEG image.');
      return;
    }

    // Read the file into a base64 data URL so it survives a page refresh in localStorage.
    let dataUrl: string | undefined;
    try {
      dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result ?? ''));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(instForm.certificateFile as File);
      });
    } catch {
      setInstError('Could not read the certificate file. Please try again.');
      return;
    }

    const entry: InstitutionMembership = {
      id: `i_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      institution: instForm.institution.trim(),
      registrationNo: instForm.registrationNo.trim(),
      membershipType: instForm.membershipType,
      yearOfRegistration: instForm.yearOfRegistration,
      certificateFileName: instForm.certificateFile.name,
      certificateDataUrl: dataUrl,
    };
    try {
      persistInstitutions([...institutions, entry]);
    } catch {
      setInstError('Could not save. The certificate image may be too large - try a smaller file.');
      return;
    }
    closeInstModal();
  };

  const deleteInstitution = (id: string) => {
    if (!window.confirm('Delete this institution membership?')) return;
    persistInstitutions(institutions.filter((i) => i.id !== id));
  };

  // Work experience (localStorage-backed until backend endpoint lands)
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [expModalOpen, setExpModalOpen] = useState(false);
  const [expForm, setExpForm] = useState({
    employer: '',
    sector: '',
    positionHeld: '',
    fromDate: '',
    toDate: '',
    current: false,
    responsibilities: '',
  });
  const [expError, setExpError] = useState<string | null>(null);

  const experiencesKey = useMemo(
    () => `ies:experiences:${user?.id ?? user?.username ?? 'anon'}`,
    [user?.id, user?.username],
  );

  useEffect(() => {
    if (!user) return;
    try {
      const raw = window.localStorage.getItem(experiencesKey);
      setExperiences(raw ? (JSON.parse(raw) as WorkExperience[]) : []);
    } catch {
      setExperiences([]);
    }
  }, [user, experiencesKey]);

  const persistExperiences = (next: WorkExperience[]) => {
    setExperiences(next);
    try {
      window.localStorage.setItem(experiencesKey, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const openAddExperience = () => {
    setExpForm({
      employer: '',
      sector: '',
      positionHeld: '',
      fromDate: '',
      toDate: '',
      current: false,
      responsibilities: '',
    });
    setExpError(null);
    setExpModalOpen(true);
  };

  const closeExpModal = () => {
    setExpModalOpen(false);
    setExpError(null);
  };

  const submitExperience = (event: React.FormEvent) => {
    event.preventDefault();
    if (
      !expForm.employer.trim()
      || !expForm.sector
      || !expForm.positionHeld.trim()
      || !expForm.fromDate
      || !expForm.responsibilities.trim()
    ) {
      setExpError('All fields marked * are required.');
      return;
    }
    if (!expForm.current && !expForm.toDate) {
      setExpError('Provide a To Date, or toggle Current if you still work there.');
      return;
    }
    if (!expForm.current && expForm.fromDate && expForm.toDate && expForm.fromDate > expForm.toDate) {
      setExpError('From Date must be on or before To Date.');
      return;
    }
    const entry: WorkExperience = {
      id: `w_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      employer: expForm.employer.trim(),
      sector: expForm.sector,
      positionHeld: expForm.positionHeld.trim(),
      fromDate: expForm.fromDate,
      toDate: expForm.current ? '' : expForm.toDate,
      current: expForm.current,
      responsibilities: expForm.responsibilities.trim(),
    };
    persistExperiences([...experiences, entry]);
    closeExpModal();
  };

  const deleteExperience = (id: string) => {
    if (!window.confirm('Delete this work experience?')) return;
    persistExperiences(experiences.filter((e) => e.id !== id));
  };

  // Referees (localStorage-backed until backend endpoint lands)
  const [referees, setReferees] = useState<Referee[]>([]);
  const [refModalOpen, setRefModalOpen] = useState(false);
  const [refForm, setRefForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    placeOfWork: '',
    designation: '',
    memberNo: '',
    refereeType: '',
  });
  const [refError, setRefError] = useState<string | null>(null);
  const [refSearchTerm, setRefSearchTerm] = useState('');
  const [refSearching, setRefSearching] = useState(false);
  const [refSearchNotice, setRefSearchNotice] = useState<string | null>(null);

  const refereesKey = useMemo(
    () => `ies:referees:${user?.id ?? user?.username ?? 'anon'}`,
    [user?.id, user?.username],
  );

  useEffect(() => {
    if (!user) return;
    try {
      const raw = window.localStorage.getItem(refereesKey);
      setReferees(raw ? (JSON.parse(raw) as Referee[]) : []);
    } catch {
      setReferees([]);
    }
  }, [user, refereesKey]);

  const persistReferees = (next: Referee[]) => {
    setReferees(next);
    try {
      window.localStorage.setItem(refereesKey, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const openAddReferee = () => {
    setRefForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      placeOfWork: '',
      designation: '',
      memberNo: '',
      refereeType: '',
    });
    setRefSearchTerm('');
    setRefSearchNotice(null);
    setRefError(null);
    setRefModalOpen(true);
  };

  const closeRefModal = () => {
    setRefModalOpen(false);
    setRefError(null);
    setRefSearchNotice(null);
  };

  const runRefereeSearch = async () => {
    const term = refSearchTerm.trim();
    if (!term) {
      setRefSearchNotice('Enter a member number to search.');
      return;
    }
    setRefSearching(true);
    setRefSearchNotice(null);
    try {
      const res = await apiRequest<{ members?: Array<Record<string, unknown>> }>(
        `/memberships/search?q=${encodeURIComponent(term)}`,
      );
      if (!res.ok || !res.data?.members?.length) {
        setRefSearchNotice('No member found with that number.');
        setRefSearching(false);
        return;
      }
      const m = res.data.members[0];
      const composed = [m.title, m.firstName, m.lastName].filter(Boolean).join(' ').trim();
      const displayName = (typeof m.fullName === 'string' && /\s/.test(m.fullName))
        ? (m.fullName as string)
        : (composed || (m.fullName as string) || '');
      setRefForm((f) => ({
        ...f,
        name: displayName,
        phone: (m.phone as string) ?? f.phone,
        email: (m.email as string) ?? f.email,
        address: (m.address as string) ?? f.address,
        memberNo: (m.registrationNumber as string) ?? term,
      }));
      setRefSearchNotice(`Loaded member: ${displayName || 'unknown'}`);
    } catch {
      setRefSearchNotice('Search failed. Please try again.');
    } finally {
      setRefSearching(false);
    }
  };

  const submitReferee = (event: React.FormEvent) => {
    event.preventDefault();
    if (!refForm.name.trim() || !refForm.phone.trim() || !refForm.email.trim() || !refForm.refereeType) {
      setRefError('Fields marked * are required.');
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(refForm.email.trim());
    if (!emailOk) {
      setRefError('Please enter a valid email address.');
      return;
    }
    const entry: Referee = {
      id: `r_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name: refForm.name.trim(),
      phone: refForm.phone.trim(),
      email: refForm.email.trim(),
      address: refForm.address.trim(),
      placeOfWork: refForm.placeOfWork.trim(),
      designation: refForm.designation.trim(),
      memberNo: refForm.memberNo.trim(),
      refereeType: refForm.refereeType,
    };
    persistReferees([...referees, entry]);
    closeRefModal();
  };

  const deleteReferee = (id: string) => {
    if (!window.confirm('Delete this referee?')) return;
    persistReferees(referees.filter((r) => r.id !== id));
  };

  // Supporting Documents (grade-specific upload)
  const [docs, setDocs] = useState<Record<string, File | null>>({});
  const [docErrors, setDocErrors] = useState<string[]>([]);
  const [docSubmitting, setDocSubmitting] = useState(false);
  const [docSubmitOk, setDocSubmitOk] = useState(false);

  // NEVER default to GRADUATE on the client - that used to overwrite the real
  // grade after re-login. Use whatever the backend stored; if it is truly
  // missing (brand-new signup, still on Category → Register step), the tab
  // waits for a real value instead of pretending the user is a Graduate.
  const gradeCode = (user?.grade ?? '').toUpperCase() as GradeCode | '';
  const gradeSpec = gradeCode ? gradeRequirements[gradeCode as GradeCode] : null;
  const gradeDocs: DocumentField[] = gradeCode ? (gradeDocuments[gradeCode as GradeCode] ?? []) : [];

  const setDoc = (key: string, file: File | null) => {
    setDocs((prev) => ({ ...prev, [key]: file }));
    setDocErrors([]);
    setDocSubmitOk(false);
  };

  const submitSupportingDocs = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!gradeCode) {
      setDocErrors(['Your membership category is not set. Complete the Select Category step first.']);
      return;
    }
    const missing = gradeDocs
      .filter((f) => f.required && !docs[f.key])
      .map((f) => `${f.label} is required`);
    if (missing.length > 0) {
      setDocErrors(missing);
      return;
    }
    setDocSubmitting(true);
    setDocErrors([]);
    setDocSubmitOk(false);
    try {
      const fd = new FormData();
      fd.append('fullName', user?.fullName ?? '');
      fd.append('email', user?.email ?? '');
      fd.append('phone', user?.phone ?? '');
      fd.append('nationalIdNumber', user?.nationalId ?? '');
      fd.append('membershipGrade', gradeCode);
      fd.append('yearsOfExperience', '0');
      fd.append('discipline', user?.discipline ?? '');
      fd.append('declarationAccepted', 'true');
      Object.entries(docs).forEach(([key, file]) => {
        if (file) fd.append(key, file);
      });

      const token = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/memberships/applications`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });
      if (res.ok) {
        setDocSubmitOk(true);
        setDocs({});
      } else {
        let msg = 'Failed to submit documents. Please try again.';
        try {
          const data = await res.json();
          if (Array.isArray(data?.message)) msg = data.message[0] ?? msg;
          else if (typeof data?.message === 'string') msg = data.message;
        } catch { /* ignore */ }
        setDocErrors([msg]);
      }
    } catch {
      setDocErrors(['Network error. Please check your connection.']);
    } finally {
      setDocSubmitting(false);
    }
  };

  useEffect(() => {
    // 1) Seed instantly from localStorage so the page never flashes empty.
    const stored = getStoredUser<StoredUser>() ?? {};
    setUser(stored);
    setForm(emptyBio(stored));
    setContactsForm(emptyContacts(stored));

    // 2) Fetch fresh values from the backend so the Bio always reflects what
    //    Initial Profile actually persisted. Backend answer wins over stale
    //    localStorage; localStorage is then patched with any real values.
    const token = getAuthToken();
    if (!token) return;
    (async () => {
      const res = await apiRequest<{ user?: StoredUser } | StoredUser>('/auth/me', {
        headers: buildAuthHeader(token),
      });
      if (!res.ok || !res.data) return;
      const fresh: StoredUser = (res.data as { user?: StoredUser }).user
        ?? (res.data as StoredUser);
      // Prefer non-empty API values over stored; keep gradeLabel/middleName from
      // localStorage since the backend does not expose them today.
      const merged: StoredUser = {
        ...stored,
        ...Object.fromEntries(
          Object.entries(fresh).filter(([, v]) => v !== null && v !== undefined && v !== ''),
        ),
        gradeLabel: fresh.gradeLabel ?? stored.gradeLabel,
        middleName: fresh.middleName ?? stored.middleName,
      };
      setUser(merged);
      setForm(emptyBio(merged));
      setContactsForm(emptyContacts(merged));
      patchStoredUser(merged as unknown as Record<string, unknown>);
    })().catch(() => {});
  }, []);

  const updateField = <K extends keyof BioForm>(key: K, value: BioForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaveError(null);
  };

  const startEdit = () => {
    setForm(emptyBio(user));
    setEditing(true);
    setSaveError(null);
    setSaveNotice(null);
  };

  const cancelEdit = () => {
    setForm(emptyBio(user));
    setEditing(false);
    setSaveError(null);
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setSaveError('First name and last name are required.');
      return;
    }
    setSaving(true);
    setSaveError(null);
    const fullName = [form.title, form.firstName, form.middleName, form.lastName]
      .filter((v) => v && String(v).trim())
      .join(' ')
      .trim();
    try {
      const res = await apiJsonRequest<{ user?: StoredUser; message?: string | string[] }>(
        '/auth/me',
        'PATCH',
        {
          fullName,
          firstName: form.firstName,
          lastName: form.lastName,
          title: form.title || null,
          gender: form.gender || null,
          dateOfBirth: form.dateOfBirth || null,
          discipline: form.discipline || null,
          specialization: form.specialization || null,
          city: form.city || null,
          nationality: form.nationality || null,
        },
        { headers: buildAuthHeader(getAuthToken()) },
      );
      if (!res.ok) {
        const msg = Array.isArray(res.data?.message) ? res.data?.message[0] : res.data?.message;
        setSaveError(msg || 'Failed to save profile.');
        setSaving(false);
        return;
      }
      // Merge form values into stored user + local state.
      const patch: Partial<StoredUser> = {
        fullName,
        firstName: form.firstName,
        middleName: form.middleName,
        lastName: form.lastName,
        title: form.title,
        gender: form.gender,
        dateOfBirth: form.dateOfBirth,
        discipline: form.discipline,
        specialization: form.specialization,
        city: form.city,
        nationality: form.nationality,
      };
      patchStoredUser(patch);
      setUser((prev) => ({ ...(prev ?? {}), ...patch }));
      setEditing(false);
      setSaveNotice('Profile updated successfully.');
      setTimeout(() => setSaveNotice(null), 3000);
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateContact = <K extends keyof ContactsForm>(key: K, value: ContactsForm[K]) => {
    setContactsForm((prev) => ({ ...prev, [key]: value }));
    setContactsError(null);
  };

  const startEditContacts = () => {
    setContactsForm(emptyContacts(user));
    setEditingContacts(true);
    setContactsError(null);
    setContactsNotice(null);
  };

  const cancelEditContacts = () => {
    setContactsForm(emptyContacts(user));
    setEditingContacts(false);
    setContactsError(null);
  };

  const handleSaveContacts = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingContacts(true);
    setContactsError(null);
    try {
      const res = await apiJsonRequest<{ user?: StoredUser; message?: string | string[] }>(
        '/auth/me',
        'PATCH',
        {
          phone: contactsForm.phone || null,
          alternativePhone: contactsForm.alternativePhone || null,
          address: contactsForm.address || null,
          district: contactsForm.district || null,
          city: contactsForm.city || null,
          nationality: contactsForm.nationality || null,
        },
        { headers: buildAuthHeader(getAuthToken()) },
      );
      if (!res.ok) {
        const msg = Array.isArray(res.data?.message) ? res.data?.message[0] : res.data?.message;
        setContactsError(msg || 'Failed to save contacts.');
        setSavingContacts(false);
        return;
      }
      const patch: Partial<StoredUser> = {
        phone: contactsForm.phone,
        alternativePhone: contactsForm.alternativePhone,
        address: contactsForm.address,
        district: contactsForm.district,
        city: contactsForm.city,
        nationality: contactsForm.nationality,
      };
      patchStoredUser(patch);
      setUser((prev) => ({ ...(prev ?? {}), ...patch }));
      setEditingContacts(false);
      setContactsNotice('Contacts updated successfully.');
      setTimeout(() => setContactsNotice(null), 3000);
    } catch {
      setContactsError('Network error. Please try again.');
    } finally {
      setSavingContacts(false);
    }
  };

  // Work contacts (localStorage-backed until backend endpoint lands)
  const [workContacts, setWorkContacts] = useState<WorkContact[]>([]);
  const [workModalOpen, setWorkModalOpen] = useState(false);
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null);
  const [workForm, setWorkForm] = useState({
    email: '',
    phone: '',
    alternativePhone: '',
    address: '',
    district: '',
    city: '',
    country: '',
  });
  const [workError, setWorkError] = useState<string | null>(null);

  const workContactsKey = useMemo(
    () => `ies:work-contacts:${user?.id ?? user?.username ?? 'anon'}`,
    [user?.id, user?.username],
  );

  useEffect(() => {
    if (!user) return;
    try {
      const raw = window.localStorage.getItem(workContactsKey);
      setWorkContacts(raw ? (JSON.parse(raw) as WorkContact[]) : []);
    } catch {
      setWorkContacts([]);
    }
  }, [user, workContactsKey]);

  const persistWorkContacts = (next: WorkContact[]) => {
    setWorkContacts(next);
    try {
      window.localStorage.setItem(workContactsKey, JSON.stringify(next));
    } catch {
      /* storage unavailable */
    }
  };

  const openAddWorkContact = () => {
    setWorkForm({
      email: '',
      phone: '',
      alternativePhone: '',
      address: '',
      district: '',
      city: '',
      country: '',
    });
    setEditingWorkId(null);
    setWorkError(null);
    setWorkModalOpen(true);
  };

  const openEditWorkContact = (wc: WorkContact) => {
    setWorkForm({
      email: wc.email,
      phone: wc.phone,
      alternativePhone: wc.alternativePhone,
      address: wc.address,
      district: wc.district,
      city: wc.city,
      country: wc.country,
    });
    setEditingWorkId(wc.id);
    setWorkError(null);
    setWorkModalOpen(true);
  };

  const closeWorkModal = () => {
    setWorkModalOpen(false);
    setEditingWorkId(null);
    setWorkError(null);
  };

  const submitWorkContact = (event: React.FormEvent) => {
    event.preventDefault();
    // Alternative Phone Number is optional - do NOT enforce.
    const requiredFields: (keyof typeof workForm)[] = ['email', 'phone', 'address', 'district', 'city', 'country'];
    for (const f of requiredFields) {
      if (!workForm[f].trim()) {
        setWorkError('All fields marked * are required.');
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workForm.email.trim())) {
      setWorkError('Please enter a valid email address.');
      return;
    }
    if (editingWorkId) {
      const next = workContacts.map((w) => (
        w.id === editingWorkId
          ? {
              ...w,
              email: workForm.email.trim(),
              phone: workForm.phone.trim(),
              alternativePhone: workForm.alternativePhone.trim(),
              address: workForm.address.trim(),
              district: workForm.district.trim(),
              city: workForm.city.trim(),
              country: workForm.country.trim(),
            }
          : w
      ));
      persistWorkContacts(next);
    } else {
      const entry: WorkContact = {
        id: `wc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        email: workForm.email.trim(),
        phone: workForm.phone.trim(),
        alternativePhone: workForm.alternativePhone.trim(),
        address: workForm.address.trim(),
        district: workForm.district.trim(),
        city: workForm.city.trim(),
        country: workForm.country.trim(),
      };
      persistWorkContacts([...workContacts, entry]);
    }
    closeWorkModal();
  };

  const deleteWorkContact = (id: string) => {
    if (!window.confirm('Delete this work contact?')) return;
    persistWorkContacts(workContacts.filter((w) => w.id !== id));
  };

  const handleDeleteContacts = async () => {
    const ok = window.confirm('Clear all your personal contact details (phone, address, city, country)?');
    if (!ok) return;
    setSavingContacts(true);
    setContactsError(null);
    try {
      const res = await apiJsonRequest<{ user?: StoredUser; message?: string | string[] }>(
        '/auth/me',
        'PATCH',
        {
          phone: null,
          alternativePhone: null,
          address: null,
          district: null,
          city: null,
          nationality: null,
        },
        { headers: buildAuthHeader(getAuthToken()) },
      );
      if (!res.ok) {
        const msg = Array.isArray(res.data?.message) ? res.data?.message[0] : res.data?.message;
        setContactsError(msg || 'Failed to clear contacts.');
        setSavingContacts(false);
        return;
      }
      const patch: Partial<StoredUser> = {
        phone: '',
        alternativePhone: '',
        address: '',
        district: '',
        city: '',
        nationality: '',
      };
      patchStoredUser(patch);
      setUser((prev) => ({ ...(prev ?? {}), ...patch }));
      setContactsForm(emptyContacts({ ...user, ...patch }));
      setEditingContacts(false);
      setContactsNotice('Contact details cleared.');
      setTimeout(() => setContactsNotice(null), 3000);
    } catch {
      setContactsError('Network error. Please try again.');
    } finally {
      setSavingContacts(false);
    }
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;
    let cancelled = false;
    (async () => {
      const res = await apiRequest<unknown>('/memberships/my-applications', {
        headers: buildAuthHeader(token),
      });
      if (cancelled || !res.ok) return;
      const raw = res.data as unknown;
      const list = Array.isArray(raw)
        ? raw
        : ((raw as { applications?: unknown[]; items?: unknown[] })?.applications
            ?? (raw as { applications?: unknown[]; items?: unknown[] })?.items
            ?? []);
      const first = Array.isArray(list) ? (list[0] as ApplicationSummary | undefined) : undefined;
      if (!first) return;
      setApp(first);
      const photoDoc = first.documents?.find((d) => d.type === 'PASSPORT_PHOTO');
      if (photoDoc) {
        setPhotoUrl(`${API_BASE_URL.replace(/\/api$/, '')}/api/memberships/public-photo/${photoDoc.id}`);
      }
    })().catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const idAttachment = useMemo(
    () => app?.documents?.find((d) => d.type === 'ID_OR_PASSPORT'),
    [app],
  );

  if (!user) return null;

  const fullName = [user.firstName, user.middleName, user.lastName].filter(Boolean).join(' ')
    || user.fullName
    || 'Member';

  return (
    <div className="mx-auto -mt-2 flex max-w-6xl flex-col gap-2">
      {/* Tabs card (breadcrumb above already reads "Member / Profile") */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Tabs strip - single horizontal row, scrolls on narrow screens */}
        <div className="flex gap-0.5 overflow-x-auto whitespace-nowrap border-b border-slate-200 bg-slate-50/60 px-2 pt-3 scrollbar-none">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={
                  'relative shrink-0 rounded-t-lg px-3 py-2 text-[11px] font-bold uppercase tracking-wider transition-colors ' +
                  (active
                    ? 'bg-white text-[#035CB3] shadow-[0_-1px_0_0_#035CB3_inset]'
                    : 'text-slate-500 hover:text-[#035CB3]')
                }
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-px h-0.5 bg-[#035CB3]" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab body */}
        {tab === 'BIO' && (
          <form onSubmit={handleSave} className="relative p-6">
            {/* Notices */}
            {saveNotice && (
              <div className="mb-4 rounded-lg border border-[#48C184]/40 bg-[#48C184]/10 px-4 py-2 text-xs font-semibold text-[#3AA870]">
                {saveNotice}
              </div>
            )}
            {saveError && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
                {saveError}
              </div>
            )}

            {/* Edit toolbar */}
            <div className="mb-4 flex justify-end gap-2">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 transition-colors hover:bg-slate-100 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#48C184] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#3AA870] disabled:opacity-50"
                  >
                    {saving ? 'Saving…' : 'Save changes'}
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={startEdit}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#035CB3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184]"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3l3 3-9 9H5v-3l9-9z" />
                  </svg>
                  Edit
                </button>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-[220px_1fr]">
              {/* Photo column */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-[#035CB3]/10 bg-slate-100">
                  {photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={photoUrl} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-slate-300">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21v-1a6 6 0 0112 0v1" fill="currentColor" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-center text-xs font-bold uppercase tracking-wider text-[#035CB3]">
                  {fullName}
                </p>
                {user.gradeLabel && (
                  <span className="rounded-full bg-[#035CB3]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#035CB3]">
                    {user.gradeLabel}
                  </span>
                )}
              </div>

              {/* Bio - exact Initial Profile order.
                  Row 1: First Name / Middle Name / Last Name
                  Row 2: Gender / Title / Date of Birth
                  Row 3: National ID (read-only, disabled bg) / Nationality
                  Row 4: City/Town / Discipline
                  Row 5: Specialization
              */}
              {!editing && (
                <div className="flex flex-col gap-5">
                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-3">
                    <Field label="First Name" value={user.firstName} />
                    <Field label="Middle Name" value={user.middleName} />
                    <Field label="Last Name" value={user.lastName} />
                  </div>
                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-3">
                    <Field label="Gender" value={user.gender ? user.gender.charAt(0) + user.gender.slice(1).toLowerCase() : null} />
                    <Field label="Title" value={user.title} />
                    <Field label="Date of Birth" value={user.dateOfBirth} />
                  </div>
                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <Field label="National ID / Passport No." value={user.nationalId} />
                    <Field label="Nationality" value={user.nationality} />
                  </div>
                  <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                    <Field label="City / Town" value={user.city} />
                    <Field label="Discipline" value={user.discipline} />
                  </div>
                  <div className="grid gap-x-5 gap-y-5">
                    <Field label="Specialization" value={user.specialization} />
                  </div>
                  {idAttachment && (
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">ID / Passport Attachment</p>
                      <a
                        href={`${API_BASE_URL}/memberships/applications/${app?.id}/documents/${idAttachment.id}/download`}
                        className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#48C184] hover:text-[#3AA870]"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 17h12" />
                        </svg>
                        Download
                      </a>
                    </div>
                  )}
                </div>
              )}

              {editing && (
                <div className="flex flex-col gap-4">
                  {/* Row 1 - Names */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      First Name <span className="text-rose-500">*</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter Your First Name"
                        value={form.firstName}
                        onChange={(e) => updateField('firstName', sanitizeName(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Middle Name <span className="text-rose-500">*</span>
                      <input
                        type="text"
                        placeholder="Enter Your Middle Name"
                        value={form.middleName}
                        onChange={(e) => updateField('middleName', sanitizeName(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Last Name <span className="text-rose-500">*</span>
                      <input
                        type="text"
                        required
                        placeholder="Enter Your Last Name"
                        value={form.lastName}
                        onChange={(e) => updateField('lastName', sanitizeName(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                    </label>
                  </div>

                  {/* Row 2 - Gender / Title / DOB */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Gender <span className="text-rose-500">*</span>
                      <select
                        required
                        value={form.gender}
                        onChange={(e) => updateField('gender', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      >
                        <option value="">Select Your Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Title <span className="text-rose-500">*</span>
                      <select
                        required
                        value={form.title}
                        onChange={(e) => updateField('title', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      >
                        <option value="">Select Your Title</option>
                        <option value="Mr.">Mr.</option>
                        <option value="Mrs.">Mrs.</option>
                        <option value="Ms.">Ms.</option>
                        <option value="Miss.">Miss.</option>
                        <option value="Dr.">Dr.</option>
                        <option value="Prof.">Prof.</option>
                        <option value="Eng.">Eng.</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Date of Birth <span className="text-rose-500">*</span>
                      <input
                        type="date"
                        required
                        value={form.dateOfBirth}
                        onChange={(e) => updateField('dateOfBirth', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                      <span className="text-[10px] text-slate-500">Must be at least 16 years old</span>
                    </label>
                  </div>

                  {/* Row 3 - National ID (read-only) / Nationality */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      National ID / Passport No. <span className="text-rose-500">*</span>
                      <input
                        type="text"
                        value={user.nationalId ?? ''}
                        disabled
                        className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-normal text-slate-600"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Nationality <span className="text-rose-500">*</span>
                      <select
                        required
                        value={form.nationality}
                        onChange={(e) => updateField('nationality', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      >
                        <option value="">Select Nationality</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {/* Row 4 - City / Discipline */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      City / Town
                      <input
                        type="text"
                        placeholder="Enter Your City/Town (e.g; Mogadishu)"
                        value={form.city}
                        onChange={(e) => updateField('city', sanitizeName(e.target.value))}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                    </label>
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Discipline <span className="text-rose-500">*</span>
                      <select
                        required
                        value={form.discipline}
                        onChange={(e) => updateField('discipline', e.target.value)}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      >
                        <option value="">Select Your Engineering Discipline</option>
                        {engineeringDivisions.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {/* Row 5 - Specialization */}
                  <div className="grid gap-3">
                    <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Specialization
                      <input
                        type="text"
                        placeholder="e.g. Structural, Power Systems, Networks"
                        value={form.specialization}
                        onChange={(e) => updateField('specialization', e.target.value)}
                        maxLength={150}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                    </label>
                  </div>

                  <p className="text-[10px] italic text-slate-500">
                    ID/Passport number and membership category cannot be changed here. Contact IES support to update them.
                  </p>
                </div>
              )}
            </div>
          </form>
        )}

        {tab === 'CONTACTS' && (
          <div className="p-6">
            {contactsNotice && (
              <div className="mb-4 rounded-lg border border-[#48C184]/40 bg-[#48C184]/10 px-4 py-2 text-xs font-semibold text-[#3AA870]">
                {contactsNotice}
              </div>
            )}
            {contactsError && (
              <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700">
                {contactsError}
              </div>
            )}

            {/* Personal Contact card - IEK style */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                <h3 className="text-sm font-bold text-[#035CB3]">Personal Contact</h3>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-[#48C184] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Active
                  </span>
                  {!editingContacts ? (
                    <>
                      <button
                        type="button"
                        onClick={startEditContacts}
                        aria-label="Edit contacts"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#035CB3]/10 text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 3l3 3-9 9H5v-3l9-9z" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteContacts}
                        disabled={savingContacts}
                        aria-label="Clear contacts"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white disabled:opacity-50"
                      >
                        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 6h12M8 6V4h4v2M6 6l1 12h6l1-12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={cancelEditContacts}
                        disabled={savingContacts}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSaveContacts(e as unknown as React.FormEvent)}
                        disabled={savingContacts}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#48C184] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white hover:bg-[#3AA870] disabled:opacity-50"
                      >
                        {savingContacts ? 'Saving…' : 'Save'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Body */}
              {!editingContacts ? (
                <div className="divide-y divide-slate-100">
                  {/* Email */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M4 5h12v10H4z" strokeLinejoin="round" /><path d="M4 5l6 5 6-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">Email</p>
                      <p className="mt-0.5 truncate text-sm font-medium text-[#035CB3]">{user.email ?? '-'}</p>
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="6" y="2" width="8" height="16" rx="1.5" /><path d="M9 15h2" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">Phone</p>
                      <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{user.phone ?? '-'}</p>
                    </div>
                  </div>
                  {/* Alternative Phone */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">Alternative Phone Number</p>
                      <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{user.alternativePhone ?? '-'}</p>
                    </div>
                  </div>
                  {/* Address */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" strokeLinejoin="round" /><circle cx="10" cy="8" r="2" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">Address</p>
                      <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{user.address ?? '-'}</p>
                    </div>
                  </div>
                  {/* District */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M3 17h14M5 17V9l5-3 5 3v8M8 17v-4h4v4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">District</p>
                      <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{user.district ?? '-'}</p>
                    </div>
                  </div>
                  {/* City */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="4" y="8" width="12" height="9" /><rect x="7" y="11" width="2" height="2" /><rect x="11" y="11" width="2" height="2" /><path d="M4 8L10 4l6 4" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">City</p>
                      <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{user.city ?? '-'}</p>
                    </div>
                  </div>
                  {/* Country */}
                  <div className="flex items-start gap-4 px-4 py-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3a11 11 0 010 14M10 3a11 11 0 000 14" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">Country</p>
                      <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{user.nationality ?? '-'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveContacts} className="grid gap-3 p-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                    Phone No.
                    <input
                      type="tel"
                      value={contactsForm.phone}
                      onChange={(e) => updateContact('phone', e.target.value.replace(/[^\d+\s-]/g, ''))}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                    Alternative Phone Number
                    <input
                      type="tel"
                      value={contactsForm.alternativePhone}
                      onChange={(e) => updateContact('alternativePhone', e.target.value.replace(/[^\d+\s-]/g, ''))}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] md:col-span-2">
                    Address
                    <input
                      type="text"
                      value={contactsForm.address}
                      onChange={(e) => updateContact('address', e.target.value)}
                      maxLength={255}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                    District
                    <input
                      type="text"
                      value={contactsForm.district}
                      onChange={(e) => updateContact('district', sanitizeName(e.target.value))}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                    City
                    <input
                      type="text"
                      value={contactsForm.city}
                      onChange={(e) => updateContact('city', sanitizeName(e.target.value))}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] md:col-span-2">
                    Country
                    <select
                      value={contactsForm.nationality}
                      onChange={(e) => updateContact('nationality', e.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                    >
                      <option value="">Select Country</option>
                      {countries.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  {/* Read-only identity fields */}
                  <div className="md:col-span-2 mt-1 rounded-lg border border-slate-100 bg-slate-50/60 p-3">
                    <Field label="Email" value={user.email} />
                    <p className="mt-2 text-[10px] italic text-slate-500">
                      Email cannot be changed here. Contact IES support to update it.
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* + Add Work Contact - placed right under the Personal Contact card, aligned right (below the Edit / Delete icons). */}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={openAddWorkContact}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#035CB3] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M10 4v12M4 10h12" />
                </svg>
                Add Work Contact
              </button>
            </div>

            {/* Existing work contacts - same rows as Personal Contact for consistency */}
            {workContacts.length > 0 && (
              <div className="mt-4 flex flex-col gap-4">
                {workContacts.map((wc, idx) => (
                  <div key={wc.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
                      <h3 className="text-sm font-bold text-[#035CB3]">
                        Work Contact {workContacts.length > 1 ? `#${idx + 1}` : ''}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-[#48C184] px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          Active
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditWorkContact(wc)}
                          aria-label="Edit work contact"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#035CB3]/10 text-[#035CB3] hover:bg-[#035CB3] hover:text-white"
                        >
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 3l3 3-9 9H5v-3l9-9z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteWorkContact(wc.id)}
                          aria-label="Delete work contact"
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white"
                        >
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 6h12M8 6V4h4v2M6 6l1 12h6l1-12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {[
                        { label: 'Email', value: wc.email, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 5h12v10H4z" strokeLinejoin="round" /><path d="M4 5l6 5 6-5" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
                        { label: 'Phone', value: wc.phone, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="6" y="2" width="8" height="16" rx="1.5" /><path d="M9 15h2" strokeLinecap="round" /></svg>) },
                        { label: 'Alternative Phone Number', value: wc.alternativePhone, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="7" r="3" /><path d="M4 17c0-3.3 2.7-6 6-6s6 2.7 6 6" strokeLinecap="round" /></svg>) },
                        { label: 'Address', value: wc.address, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10 2a6 6 0 016 6c0 4-6 10-6 10S4 12 4 8a6 6 0 016-6z" strokeLinejoin="round" /><circle cx="10" cy="8" r="2" /></svg>) },
                        { label: 'District', value: wc.district, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 17h14M5 17V9l5-3 5 3v8M8 17v-4h4v4" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
                        { label: 'City', value: wc.city, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="8" width="12" height="9" /><rect x="7" y="11" width="2" height="2" /><rect x="11" y="11" width="2" height="2" /><path d="M4 8L10 4l6 4" strokeLinejoin="round" /></svg>) },
                        { label: 'Country', value: wc.country, icon: (<svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10" cy="10" r="7" /><path d="M3 10h14M10 3a11 11 0 010 14M10 3a11 11 0 000 14" /></svg>) },
                      ].map((row) => (
                        <div key={row.label} className="flex items-start gap-4 px-4 py-3">
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                            {row.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] font-semibold tracking-wide text-slate-500">{row.label}</p>
                            <p className="mt-0.5 text-sm font-medium text-[#035CB3]">{row.value || '-'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add / Edit Work Contact modal - mirrors the Personal Contact fields */}
            {workModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                <form onSubmit={submitWorkContact} className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
                  <div className="bg-[#035CB3] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">
                      {editingWorkId ? 'Edit Work Contact' : 'Add Work Contact'}
                    </h3>
                  </div>
                  <div className="p-5">
                    {workError && (
                      <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {workError}
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Email <span className="text-rose-500">*</span>
                        <input
                          type="email"
                          required
                          value={workForm.email}
                          onChange={(e) => setWorkForm((f) => ({ ...f, email: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Phone <span className="text-rose-500">*</span>
                        <input
                          type="tel"
                          required
                          value={workForm.phone}
                          onChange={(e) => setWorkForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+\s-]/g, '') }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] sm:col-span-2">
                        Alternative Phone Number
                        <input
                          type="tel"
                          value={workForm.alternativePhone}
                          onChange={(e) => setWorkForm((f) => ({ ...f, alternativePhone: e.target.value.replace(/[^\d+\s-]/g, '') }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] sm:col-span-2">
                        Address <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={workForm.address}
                          onChange={(e) => setWorkForm((f) => ({ ...f, address: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        District <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={workForm.district}
                          onChange={(e) => setWorkForm((f) => ({ ...f, district: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        City <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={workForm.city}
                          onChange={(e) => setWorkForm((f) => ({ ...f, city: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] sm:col-span-2">
                        Country <span className="text-rose-500">*</span>
                        <select
                          required
                          value={workForm.country}
                          onChange={(e) => setWorkForm((f) => ({ ...f, country: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        >
                          <option value="">Select country…</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <button
                      type="button"
                      onClick={closeWorkModal}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#035CB3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#48C184]"
                    >
                      {editingWorkId ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === 'ACADEMIC' && (
          <div className="p-6">
            {/* Warning banner */}
            {/* <div className="mb-5 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs italic text-rose-700"> */}
              {/* <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 shrink-0">
                <path d="M10 2L2 17h16L10 2z" strokeLinejoin="round" />
                <path d="M10 8v4M10 15h.01" strokeLinecap="round" />
              </svg>
              <span>
                All documents should be scanned certified colour copy. Certification to be done by the Commissioner of Oaths whose names and address are fully displayed on the Rubber Stamp.
              </span> */}
            {/* </div> */}

            {/* Academic qualifications section */}
            <section className="mb-6 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-[#035CB3]">ACADEMIC QUALIFICATIONS</h3>
                <button
                  type="button"
                  onClick={() => openAddQual('ACADEMIC')}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#035CB3] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Add Qualification
                </button>
              </div>
              <QualTable rows={academicList} onDelete={deleteQual} />
            </section>

            {/* Other qualifications section */}
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-[#035CB3]">OTHER QUALIFICATIONS <span className="text-slate-400 font-normal">(e.g O Level, )</span></h3>
                <button
                  type="button"
                  onClick={() => openAddQual('OTHER')}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#035CB3] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Add Other QUALIFICATIONS
                </button>
              </div>
              <QualTable rows={otherList} onDelete={deleteQual} />
            </section>

            {/* Add Qualification modal */}
            {modalCategory && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                <form onSubmit={submitQual} className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
                  <div className="bg-[#035CB3] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">
                      {modalCategory === 'ACADEMIC' ? 'Add Qualification' : 'Add Other Qualification'}
                    </h3>
                  </div>
                  <div className="p-5">
                    {qualError && (
                      <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {qualError}
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Institution <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={qualForm.institution}
                          onChange={(e) => setQualForm((f) => ({ ...f, institution: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Certificate Awarded <span className="text-rose-500">*</span>
                        <select
                          required
                          value={qualForm.certificate}
                          onChange={(e) => setQualForm((f) => ({ ...f, certificate: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        >
                          <option value="">Select</option>
                          {(modalCategory === 'ACADEMIC' ? CERTIFICATE_OPTIONS : OTHER_CERTIFICATE_OPTIONS).map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Start Date <span className="text-rose-500">*</span>
                        <input
                          type="date"
                          required
                          value={qualForm.startDate}
                          onChange={(e) => setQualForm((f) => ({ ...f, startDate: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        End Date <span className="text-rose-500">*</span>
                        <input
                          type="date"
                          required
                          value={qualForm.endDate}
                          onChange={(e) => setQualForm((f) => ({ ...f, endDate: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] sm:col-span-2">
                        Certificate No. <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={qualForm.certificateNo}
                          onChange={(e) =>
                            setQualForm((f) => ({
                              ...f,
                              // Allow letters, digits, /, -, spaces (e.g. CERT/CE/2023/0456)
                              certificateNo: e.target.value.replace(/[^A-Za-z0-9/\- ]/g, ''),
                            }))
                          }
                          placeholder="e.g. CERT/CE/2023/0456"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                    </div>
                    <p className="mt-3 text-[10px] italic text-slate-500">
                      You will attach scanned certified certificates in the final Attachments step.
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#035CB3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#48C184]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === 'INSTITUTIONAL' && (
          <div className="p-6">
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-[#035CB3]">My Institution Membership</h3>
                <button
                  type="button"
                  onClick={openAddInstitution}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#035CB3] px-3 py-1 text-[11px] font-bold  tracking-wider text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Add Institution
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px]  tracking-wider text-slate-500">
                      <th className="px-4 py-2 text-left font-semibold">Institution</th>
                      <th className="px-4 py-2 text-left font-semibold">Registration No.</th>
                      <th className="px-4 py-2 text-left font-semibold">Membership Type</th>
                      <th className="px-4 py-2 text-left font-semibold">Year of Registration</th>
                      <th className="px-4 py-2 text-left font-semibold">Certificate</th>
                      <th className="px-4 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {institutions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-xs italic text-slate-400">
                          No data available
                        </td>
                      </tr>
                    )}
                    {institutions.map((i) => (
                      <tr key={i.id} className="border-b border-slate-50 last:border-b-0">
                        <td className="px-4 py-2 text-sm text-[#035CB3]">{i.institution}</td>
                        <td className="px-4 py-2 text-xs font-mono text-slate-700">{i.registrationNo}</td>
                        <td className="px-4 py-2 text-sm text-slate-700">{i.membershipType}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{i.yearOfRegistration}</td>
                        <td className="px-4 py-2 text-xs">
                          {i.certificateDataUrl ? (
                            <a
                              href={i.certificateDataUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 font-bold text-[#48C184] hover:text-[#3AA870]"
                            >
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 3v10m0 0l-4-4m4 4l4-4M4 17h12" />
                              </svg>
                              View
                            </a>
                          ) : (
                            <span className="italic text-slate-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteInstitution(i.id)}
                            aria-label="Delete institution"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
                          >
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6h12M8 6V4h4v2M6 6l1 12h6l1-12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Add Institution modal */}
            {instModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                <form onSubmit={submitInstitution} className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl">
                  <div className="bg-[#035CB3] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">Add Institution</h3>
                  </div>
                  <div className="p-5">
                    {instError && (
                      <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {instError}
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Institution <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={instForm.institution}
                          onChange={(e) => setInstForm((f) => ({ ...f, institution: e.target.value }))}
                          placeholder="e.g. Engineers Board of Kenya"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Registration No. <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={instForm.registrationNo}
                          onChange={(e) => setInstForm((f) => ({ ...f, registrationNo: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Membership Type <span className="text-rose-500">*</span>
                        <select
                          required
                          value={instForm.membershipType}
                          onChange={(e) => setInstForm((f) => ({ ...f, membershipType: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        >
                          <option value="">Select…</option>
                          {MEMBERSHIP_TYPES.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Year of Registration <span className="text-rose-500">*</span>
                        <input
                          type="number"
                          min={1900}
                          max={new Date().getFullYear()}
                          required
                          value={instForm.yearOfRegistration}
                          onChange={(e) => setInstForm((f) => ({ ...f, yearOfRegistration: e.target.value }))}
                          placeholder="e.g. 2015"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] sm:col-span-2">
                        Attach membership certificate <span className="text-rose-500">*</span>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) =>
                            setInstForm((f) => ({ ...f, certificateFile: e.target.files?.[0] ?? null }))
                          }
                          className="w-full rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-[11px] file:mr-2 file:rounded file:border-0 file:bg-[#035CB3] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#48C184]"
                        />
                        <span className="text-[10px] text-slate-500">png and jpeg images only</span>
                        {instForm.certificateFile && (
                          <span className="mt-0.5 inline-flex items-center gap-1 self-start rounded-full bg-[#48C184]/15 px-2 py-0.5 text-[10px] font-bold text-[#3AA870]">
                            ✓ {instForm.certificateFile.name}
                          </span>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <button
                      type="button"
                      onClick={closeInstModal}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#035CB3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#48C184]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === 'WORK' && (
          <div className="p-6">
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-[#035CB3]">My Experience</h3>
                <button
                  type="button"
                  onClick={openAddExperience}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#035CB3] px-3 py-1 text-[11px] font-bold  tracking-wider text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Add Experience
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] text-slate-500">
                      <th className="px-4 py-2 text-left font-semibold">Position Held</th>
                      <th className="px-4 py-2 text-left font-semibold">Sector</th>
                      <th className="px-4 py-2 text-left font-semibold">Responsibilities</th>
                      <th className="px-4 py-2 text-left font-semibold">Employer</th>
                      <th className="px-4 py-2 text-left font-semibold">From</th>
                      <th className="px-4 py-2 text-left font-semibold">To</th>
                      <th className="px-4 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {experiences.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-xs italic text-slate-400">
                          No data available
                        </td>
                      </tr>
                    )}
                    {experiences.map((e) => (
                      <tr key={e.id} className="border-b border-slate-50 last:border-b-0 align-top">
                        <td className="px-4 py-2 text-sm text-[#035CB3]">{e.positionHeld}</td>
                        <td className="px-4 py-2 text-sm text-slate-700">{e.sector}</td>
                        <td className="px-4 py-2 text-xs text-slate-600 max-w-[280px]">
                          <span className="line-clamp-3 whitespace-pre-line">{e.responsibilities}</span>
                        </td>
                        <td className="px-4 py-2 text-sm text-slate-700">{e.employer}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{e.fromDate}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">
                          {e.current ? (
                            <span className="inline-flex items-center rounded-full bg-[#48C184]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#3AA870]">
                              Current
                            </span>
                          ) : (
                            e.toDate
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteExperience(e.id)}
                            aria-label="Delete experience"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
                          >
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6h12M8 6V4h4v2M6 6l1 12h6l1-12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Add Experience modal */}
            {expModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                <form onSubmit={submitExperience} className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
                  <div className="bg-[#035CB3] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">Add Experience</h3>
                  </div>
                  <div className="p-5">
                    {expError && (
                      <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {expError}
                      </div>
                    )}
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="col gap-1 text-xs font-semibold text-[#035CB3]">
                        Employer <span className="text-rose-500"> *</span>
                        <input
                          type="text"
                          required
                          value={expForm.employer}
                          onChange={(e) => setExpForm((f) => ({ ...f, employer: e.target.value }))}
                          placeholder="Company/Organization Name"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="gap-1 text-xs font-semibold text-[#035CB3]">
                        Sector <span className="text-rose-500">*</span>
                        <select
                          required
                          value={expForm.sector}
                          onChange={(e) => setExpForm((f) => ({ ...f, sector: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        >
                          <option value="">Select sector…</option>
                          {IES_SECTORS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </label>
                      <label className="gap-1 text-xs font-semibold text-[#035CB3]">
                        Position Held <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={expForm.positionHeld}
                          onChange={(e) => setExpForm((f) => ({ ...f, positionHeld: e.target.value }))}
                          placeholder="e.g; Project Manager"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>

                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        From Date <span className="text-rose-500">*</span>
                        <input
                          type="date"
                          required
                          value={expForm.fromDate}
                          onChange={(e) => setExpForm((f) => ({ ...f, fromDate: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>

                      {/* To Date - hidden when Current is on */}
                      {!expForm.current && (
                        <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                          To Date <span className="text-rose-500">*</span>
                          <input
                            type="date"
                            required
                            value={expForm.toDate}
                            onChange={(e) => setExpForm((f) => ({ ...f, toDate: e.target.value }))}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                          />
                        </label>
                      )}

                      {/* Current toggle */}
                      <label className={
                        'flex items-center gap-3 rounded-lg border px-3 py-2 text-xs font-semibold ' +
                        (expForm.current
                          ? 'border-[#48C184] bg-[#48C184]/10 text-[#3AA870]'
                          : 'border-slate-300 text-[#035CB3]')
                      }>
                        <button
                          type="button"
                          onClick={() => setExpForm((f) => ({ ...f, current: !f.current, toDate: !f.current ? '' : f.toDate }))}
                          role="switch"
                          aria-checked={expForm.current}
                          className={
                            'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ' +
                            (expForm.current ? 'bg-[#48C184]' : 'bg-slate-300')
                          }
                        >
                          <span
                            className={
                              'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ' +
                              (expForm.current ? 'translate-x-4' : 'translate-x-0.5')
                            }
                          />
                        </button>
                        <span>Current</span>
                      </label>
                    </div>

                    {/* Key Responsibilities */}
                    <label className="mt-3 flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                      Key Responsibilities <span className="text-rose-500">*</span>
                      <textarea
                        required
                        rows={4}
                        value={expForm.responsibilities}
                        onChange={(e) => setExpForm((f) => ({ ...f, responsibilities: e.target.value }))}
                        placeholder="Describe your key responsibilities and achievements."
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                      />
                    </label>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <button
                      type="button"
                      onClick={closeExpModal}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#035CB3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#48C184]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === 'REFEREES' && (
          <div className="p-6">
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="text-sm font-bold text-[#035CB3]">My Referees</h3>
                <button
                  type="button"
                  onClick={openAddReferee}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#035CB3] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#035CB3] transition-colors hover:bg-[#035CB3] hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10 4v12M4 10h12" />
                  </svg>
                  Add Referee
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px]  tracking-wider text-slate-500">
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Address</th>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Phone No.</th>
                      <th className="px-4 py-2 text-left font-semibold">Place of Work</th>
                      <th className="px-4 py-2 text-left font-semibold">Designation</th>
                      <th className="px-4 py-2 text-left font-semibold">Member No.</th>
                      <th className="px-4 py-2 text-left font-semibold">Referee Type</th>
                      <th className="px-4 py-2 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referees.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-4 py-8 text-center text-xs italic text-slate-400">
                          No data available
                        </td>
                      </tr>
                    )}
                    {referees.map((r) => (
                      <tr key={r.id} className="border-b border-slate-50 last:border-b-0 align-top">
                        <td className="px-4 py-2 text-sm text-[#035CB3]">{r.name}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{r.address || '-'}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{r.email}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{r.phone}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{r.placeOfWork || '-'}</td>
                        <td className="px-4 py-2 text-xs text-slate-600">{r.designation || '-'}</td>
                        <td className="px-4 py-2 text-xs font-mono text-slate-700">{r.memberNo || '-'}</td>
                        <td className="px-4 py-2 text-xs text-[#035CB3] font-semibold">{r.refereeType}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => deleteReferee(r.id)}
                            aria-label="Delete referee"
                            className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-600 transition-colors hover:bg-rose-600 hover:text-white"
                          >
                            <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M4 6h12M8 6V4h4v2M6 6l1 12h6l1-12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Add Referee modal */}
            {refModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
                <form onSubmit={submitReferee} className="w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl">
                  <div className="bg-[#035CB3] px-5 py-3">
                    <h3 className="text-sm font-bold text-white">Add Referee</h3>
                  </div>
                  <div className="p-5">
                    {refError && (
                      <div className="mb-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
                        {refError}
                      </div>
                    )}

                    {/* Search by Member Number */}
                    <div className="mb-4">
                      <label className="text-xs font-semibold text-[#035CB3]">Search by Member Number</label>
                      <div className="mt-1 flex gap-2">
                        <input
                          type="text"
                          value={refSearchTerm}
                          onChange={(e) => setRefSearchTerm(e.target.value)}
                          placeholder="Enter Member Number or Email"
                          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                        <button
                          type="button"
                          onClick={runRefereeSearch}
                          disabled={refSearching}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#035CB3] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#48C184] disabled:opacity-50"
                        >
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="9" cy="9" r="6" /><path d="M14 14l4 4" />
                          </svg>
                          {refSearching ? 'Searching…' : 'Search'}
                        </button>
                      </div>
                      {refSearchNotice && (
                        <p className={
                          'mt-1 text-[11px] font-semibold ' +
                          (refSearchNotice.startsWith('Loaded') ? 'text-[#3AA870]' : 'text-rose-600')
                        }>
                          {refSearchNotice}
                        </p>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Name <span className="text-rose-500">*</span>
                        <input
                          type="text"
                          required
                          value={refForm.name}
                          onChange={(e) => setRefForm((f) => ({ ...f, name: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Phone No. <span className="text-rose-500">*</span>
                        <input
                          type="tel"
                          required
                          value={refForm.phone}
                          onChange={(e) => setRefForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+\s-]/g, '') }))}
                          // placeholder="e.g. +252612074217"
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Email <span className="text-rose-500">*</span>
                        <input
                          type="email"
                          required
                          value={refForm.email}
                          onChange={(e) => setRefForm((f) => ({ ...f, email: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Address
                        <input
                          type="text"
                          value={refForm.address}
                          onChange={(e) => setRefForm((f) => ({ ...f, address: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Place of Work
                        <input
                          type="text"
                          value={refForm.placeOfWork}
                          onChange={(e) => setRefForm((f) => ({ ...f, placeOfWork: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Designation
                        <input
                          type="text"
                          value={refForm.designation}
                          onChange={(e) => setRefForm((f) => ({ ...f, designation: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3]">
                        Member No.
                        <input
                          type="text"
                          value={refForm.memberNo}
                          onChange={(e) => setRefForm((f) => ({ ...f, memberNo: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        />
                      </label>
                      <label className="flex flex-col gap-1 text-xs font-semibold text-[#035CB3] sm:col-span-2">
                        Referee Type <span className="text-rose-500">*</span>
                        <select
                          required
                          value={refForm.refereeType}
                          onChange={(e) => setRefForm((f) => ({ ...f, refereeType: e.target.value }))}
                          className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal focus:border-[#035CB3] focus:outline-none focus:ring-1 focus:ring-[#035CB3]"
                        >
                          <option value="">Select referee type…</option>
                          {REFEREE_TYPES.map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50 px-5 py-3">
                    <button
                      type="button"
                      onClick={closeRefModal}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-[#035CB3] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#48C184]"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {tab === 'ATTACHMENTS' && (
          <div className="p-6">
            {/* Already-submitted documents (if any) */}
            {app?.documents && app.documents.length > 0 && (
              <section className="mb-6 rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-4 py-3">
                  <h3 className="text-sm font-bold text-[#035CB3]">Documents already on file</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-4 py-3 text-left">Document</th>
                        <th className="px-4 py-3 text-left">File Name</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {app.documents.map((doc) => (
                        <tr key={doc.id}>
                          <td className="px-4 py-3 text-[#035CB3]">{doc.type.replace(/_/g, ' ')}</td>
                          <td className="px-4 py-3 text-slate-600">{doc.fileName ?? '-'}</td>
                          <td className="px-4 py-3 text-right">
                            <a
                              href={`${API_BASE_URL}/memberships/applications/${app.id}/documents/${doc.id}/download`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#035CB3] hover:text-[#48C184]"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Required documents upload grid */}
            {!gradeSpec ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center text-sm text-amber-800">
                Select a membership category first - required documents will appear here once your grade is set.
              </div>
            ) : (
            <section className="rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div>
                  <h3 className="text-sm font-bold text-[#035CB3]">Required Documents</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Attach the documents required for your{' '}
                    <span className="font-bold text-[#035CB3]">{gradeSpec.label}</span> application.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                  {Object.values(docs).filter(Boolean).length} / {gradeDocs.filter((d) => d.required).length}
                </span>
              </div>

              {docSubmitOk && (
                <div className="mx-4 mt-4 rounded-lg border border-[#48C184]/40 bg-[#48C184]/10 px-4 py-2 text-sm font-semibold text-[#3AA870]">
                  ✓ Documents submitted successfully. The Secretariat will review your application.
                </div>
              )}
              {docErrors.length > 0 && (
                <div className="mx-4 mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs text-rose-700">
                  <p className="font-bold uppercase tracking-widest">Missing / Errors</p>
                  <ul className="mt-1 flex flex-col gap-0.5">
                    {docErrors.map((e) => (
                      <li key={e}>• {e}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={submitSupportingDocs} className="p-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  {gradeDocs.map((field) => {
                    const file = docs[field.key];
                    return (
                      <label key={field.key + field.label} className="rounded-lg border border-slate-200 bg-slate-50/50 p-3 transition-colors hover:border-[#035CB3]/40">
                        <span className="mb-1 flex items-center justify-between text-[11px] font-bold text-[#035CB3]">
                          <span className="truncate">
                            {field.label}
                            {field.required && (<> <span className="text-rose-500">*</span></>)}
                          </span>
                          {file && (
                            <span className="ml-2 shrink-0 rounded-full bg-[#48C184]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-[#3AA870]">
                              ✓ Ready
                            </span>
                          )}
                        </span>
                        {field.helper && (
                          <span className="mb-1 block text-[10px] text-slate-500">{field.helper}</span>
                        )}
                        <input
                          type="file"
                          accept={acceptAttr(field.accept)}
                          onChange={(event) => setDoc(field.key, event.target.files?.[0] ?? null)}
                          className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-[11px] file:mr-2 file:rounded file:border-0 file:bg-[#035CB3] file:px-2 file:py-1 file:text-[10px] file:font-semibold file:text-white hover:file:bg-[#48C184]"
                        />
                        {file && (
                          <span className="mt-1 block truncate text-[10px] text-slate-500">{file.name}</span>
                        )}
                      </label>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                  <p className="text-[11px] italic text-slate-500">
                   All documents marked with an asterisk (*) are required for your membership grade.
                  </p>
                  <button
                    type="submit"
                    disabled={docSubmitting}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#035CB3] px-6 py-2 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#48C184] disabled:opacity-50"
                  >
                    {docSubmitting ? 'Submitting…' : 'Submit'}
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 10h12M10 4l6 6-6 6" />
                    </svg>
                  </button>
                </div>
              </form>
            </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
