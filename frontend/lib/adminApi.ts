import { apiJsonRequest, apiRequest, API_BASE_URL } from './apiClient';
import { buildAuthHeader, getAuthToken } from './authSession';

export interface AdminStats {
  totalMembers: number;
  totalAdmins: number;
  pendingApplications: number;
  inReviewApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  approvedThisMonth: number;
  organizations: number;
  pendingOrganizations: number;
}

export interface AdminMonthly {
  month: string;
  year: number;
  applications: number;
  approvals: number;
}

export interface AdminRecent {
  id: string;
  applicant: string;
  grade: string;
  status: string;
  when: string | null;
}

export interface AdminStatsResponse {
  stats: AdminStats;
  monthly: AdminMonthly[];
  recent: AdminRecent[];
}

export interface AdminApplicationRow {
  id: string;
  applicant: string;
  email: string;
  grade: string;
  status: 'pending' | 'approved' | 'rejected' | 'review';
  submitted: string;
}

const authHeaders = () => buildAuthHeader(getAuthToken());

export const fetchAdminStats = async (): Promise<AdminStatsResponse | null> => {
  const res = await apiRequest<AdminStatsResponse>('/admin/stats', {
    headers: authHeaders(),
  });
  return res.ok ? res.data : null;
};

export const fetchAdminApplications = async (
  status?: string,
  search?: string,
): Promise<AdminApplicationRow[]> => {
  const params = new URLSearchParams();
  if (status && status !== 'all') params.set('status', status);
  if (search) params.set('search', search);
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await apiRequest<{ applications: AdminApplicationRow[] }>(
    `/admin/applications${query}`,
    { headers: authHeaders() },
  );
  return res.ok && res.data?.applications ? res.data.applications : [];
};

export const decideApplication = async (
  id: string,
  decision: 'APPROVED' | 'REJECTED' | 'REVIEW',
  note?: string,
): Promise<boolean> => {
  const endpoint = decision === 'REVIEW'
    ? `/memberships/applications/${id}/stage`
    : `/memberships/applications/${id}/decision`;
  const body = decision === 'REVIEW'
    ? { stage: 'REVIEW' }
    : { decision, note };
  const res = await apiJsonRequest(endpoint, 'PATCH', body, {
    headers: authHeaders(),
  });
  return res.ok;
};

export interface ApplicationDetail {
  id: string;
  fullName?: string;
  email?: string;
  phone?: string;
  nationalIdNumber?: string;
  membershipGrade?: string;
  status?: string;
  documents?: Array<{ id: string; label?: string; filename?: string; type?: string }>;
}

export const fetchApplicationDetail = async (
  id: string,
): Promise<ApplicationDetail | null> => {
  const res = await apiRequest<{ application?: ApplicationDetail } | ApplicationDetail>(
    `/memberships/applications/${id}`,
    { headers: authHeaders() },
  );
  if (!res.ok || !res.data) return null;
  if ('application' in res.data && res.data.application) {
    return res.data.application as ApplicationDetail;
  }
  return res.data as ApplicationDetail;
};

export const buildDocumentUrl = (applicationId: string, documentId: string): string =>
  `${API_BASE_URL}/memberships/applications/${applicationId}/documents/${documentId}/download`;

export interface AdminAnalytics {
  gender: { MALE: number; FEMALE: number; OTHER: number; UNSPECIFIED: number };
  grades: Record<string, number>;
  periods: { lastMonth: number; last6Months: number; lastYear: number; allTime: number };
  approvals: { lastMonth: number; last6Months: number; lastYear: number; allTime: number };
}

export const fetchAdminAnalytics = async (): Promise<AdminAnalytics | null> => {
  const res = await apiRequest<AdminAnalytics>('/admin/analytics', {
    headers: authHeaders(),
  });
  return res.ok ? res.data : null;
};

export const buildReportUrl = (key: string): string =>
  `${API_BASE_URL}/admin/reports/${key}`;

// ---------- Users ----------
export interface AdminUserRow {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  role: 'ADMIN' | 'MEMBER' | string;
  createdAt?: string;
}

export const fetchUsers = async (): Promise<AdminUserRow[]> => {
  const res = await apiRequest<{ users?: AdminUserRow[] } | AdminUserRow[]>('/users', {
    headers: authHeaders(),
  });
  if (!res.ok || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  return res.data.users ?? [];
};

export const updateUserRole = async (
  id: string,
  role: 'ADMIN' | 'MEMBER',
): Promise<boolean> => {
  const res = await apiJsonRequest(`/users/${id}/role`, 'PATCH', { role }, {
    headers: authHeaders(),
  });
  return res.ok;
};

export const deleteUser = async (id: string): Promise<boolean> => {
  const res = await apiRequest(`/users/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  return res.ok;
};

// ---------- Organizations ----------
export interface OrganizationRow {
  id: string;
  organizationName?: string;
  name?: string;
  sector?: string;
  contactEmail?: string;
  contactPerson?: string;
  status: string;
  createdAt?: string;
}

export const fetchOrganizations = async (): Promise<OrganizationRow[]> => {
  const res = await apiRequest<
    { applications?: OrganizationRow[] } | OrganizationRow[]
  >('/organizations/applications', { headers: authHeaders() });
  if (!res.ok || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  return res.data.applications ?? [];
};

// ---------- Announcements (News) ----------
export interface AnnouncementRow {
  id: string;
  title: string;
  body?: string;
  category?: string;
  createdAt?: string;
}

export const fetchAnnouncements = async (): Promise<AnnouncementRow[]> => {
  const res = await apiRequest<
    { announcements?: AnnouncementRow[] } | AnnouncementRow[]
  >('/announcements', { headers: authHeaders() });
  if (!res.ok || !res.data) return [];
  if (Array.isArray(res.data)) return res.data;
  return res.data.announcements ?? [];
};

export const createAnnouncement = async (payload: {
  title: string;
  body: string;
  category?: string;
}): Promise<boolean> => {
  const res = await apiJsonRequest('/announcements', 'POST', payload, {
    headers: authHeaders(),
  });
  return res.ok;
};

// ---------- Events ----------
export interface EventRow {
  id: string;
  title: string;
  type: string;
  date: string;
  location?: string;
  cpdHours: number;
  description?: string;
  status: string;
  registered?: number;
  createdAt?: string;
}

export const fetchAdminEvents = async (): Promise<EventRow[]> => {
  const res = await apiRequest<{ events?: EventRow[] }>('/admin/events', {
    headers: authHeaders(),
  });
  return res.ok && res.data?.events ? res.data.events : [];
};

export const fetchPublicEvents = async (): Promise<EventRow[]> => {
  const res = await apiRequest<{ events?: EventRow[] }>('/events');
  return res.ok && res.data?.events ? res.data.events : [];
};

export const createEvent = async (payload: {
  title: string;
  type: string;
  date: string;
  location?: string;
  cpdHours?: number;
  description?: string;
  notifyMembers?: boolean;
}): Promise<{ ok: boolean; notified?: number }> => {
  const res = await apiJsonRequest<{ event?: EventRow; notified?: number }>(
    '/admin/events',
    'POST',
    payload,
    { headers: authHeaders() },
  );
  return { ok: res.ok, notified: res.data?.notified ?? 0 };
};

export const registerForEvent = async (eventId: string): Promise<boolean> => {
  const res = await apiJsonRequest(`/events/${eventId}/register`, 'POST', {}, {
    headers: authHeaders(),
  });
  return res.ok;
};
