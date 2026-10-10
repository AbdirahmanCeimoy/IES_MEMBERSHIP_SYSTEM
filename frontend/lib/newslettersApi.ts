import { apiJsonRequest, apiRequest } from './apiClient';
import { buildAuthHeader, getAuthToken } from './authSession';

const authHeaders = () => buildAuthHeader(getAuthToken());

export interface NewsletterDashboard {
  subscribers: {
    total: number;
    subscribed: number;
    pending: number;
    unsubscribed: number;
    suppressed: number;
  };
  campaigns: {
    total: number;
    draft: number;
    sending: number;
    sent: number;
    partially_failed: number;
    failed: number;
  };
  deliveries: {
    queued: number;
    sent: number;
    delivered: number;
    bounced: number;
    failed: number;
  };
}

export type SubscriberStatus = 'pending' | 'subscribed' | 'unsubscribed' | 'suppressed';

export interface SubscriberRow {
  id: string;
  email: string;
  status: SubscriberStatus;
  emailVerifiedAt: string | null;
  unsubscribedAt: string | null;
  source: string | null;
  createdAt: string;
}

export type CampaignStatus = 'draft' | 'queued' | 'sending' | 'sent' | 'partially_failed' | 'failed';

export interface CampaignRow {
  id: string;
  subject: string;
  previewText: string | null;
  status: CampaignStatus;
  recipientCount: number;
  acceptedCount: number;
  deliveredCount: number;
  bouncedCount: number;
  failedCount: number;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
}

export interface CampaignFull extends CampaignRow {
  contentHtml: string;
  contentText: string | null;
  createdBy: string | null;
  updatedAt: string;
}

export type DeliveryStatus = 'queued' | 'sent' | 'delivered' | 'bounced' | 'failed' | 'unsubscribed_before_send';

export interface DeliveryRow {
  id: string;
  email: string;
  status: DeliveryStatus;
  providerMessageId: string | null;
  sentAt: string | null;
  deliveredAt: string | null;
  bouncedAt: string | null;
  failureReason: string | null;
  attempts: number;
  createdAt: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
}

export const fetchNewsletterDashboard = async (): Promise<NewsletterDashboard | null> => {
  const res = await apiRequest<NewsletterDashboard>('/admin/newsletters/dashboard', { headers: authHeaders() });
  return res.ok ? res.data : null;
};

export const fetchEligibleCount = async (): Promise<number> => {
  const res = await apiRequest<{ count: number }>('/admin/newsletters/eligible-count', { headers: authHeaders() });
  return res.ok && res.data ? res.data.count : 0;
};

export const fetchSubscribers = async (params: {
  q?: string;
  status?: SubscriberStatus | 'all';
  page?: number;
  perPage?: number;
}): Promise<PageResult<SubscriberRow>> => {
  const q = new URLSearchParams();
  if (params.q) q.set('q', params.q);
  if (params.status && params.status !== 'all') q.set('status', params.status);
  if (params.page) q.set('page', String(params.page));
  if (params.perPage) q.set('perPage', String(params.perPage));
  const query = q.toString() ? `?${q.toString()}` : '';
  const res = await apiRequest<PageResult<SubscriberRow>>(`/admin/newsletters/subscribers${query}`, {
    headers: authHeaders(),
  });
  return res.ok && res.data ? res.data : { items: [], total: 0, page: 1, perPage: params.perPage ?? 50 };
};

export const suppressSubscriber = async (id: string): Promise<boolean> => {
  const res = await apiJsonRequest<{ success: boolean }>(
    `/admin/newsletters/subscribers/${encodeURIComponent(id)}/suppress`,
    'PATCH',
    {},
    { headers: authHeaders() },
  );
  return res.ok && !!res.data?.success;
};

export const fetchCampaigns = async (params: {
  page?: number;
  perPage?: number;
}): Promise<PageResult<CampaignRow>> => {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.perPage) q.set('perPage', String(params.perPage));
  const query = q.toString() ? `?${q.toString()}` : '';
  const res = await apiRequest<PageResult<CampaignRow>>(`/admin/newsletters/campaigns${query}`, {
    headers: authHeaders(),
  });
  return res.ok && res.data ? res.data : { items: [], total: 0, page: 1, perPage: params.perPage ?? 25 };
};

export const fetchCampaign = async (id: string): Promise<CampaignFull | null> => {
  const res = await apiRequest<{ item: CampaignFull }>(
    `/admin/newsletters/campaigns/${encodeURIComponent(id)}`,
    { headers: authHeaders() },
  );
  return res.ok && res.data ? res.data.item : null;
};

export const createCampaign = async (data: {
  subject: string;
  previewText?: string;
  contentHtml: string;
  contentText?: string;
}): Promise<CampaignFull | null> => {
  const res = await apiJsonRequest<{ item: CampaignFull }>(
    '/admin/newsletters/campaigns',
    'POST',
    data,
    { headers: authHeaders() },
  );
  return res.ok && res.data ? res.data.item : null;
};

export const updateCampaign = async (id: string, data: {
  subject?: string;
  previewText?: string;
  contentHtml?: string;
  contentText?: string;
}): Promise<CampaignFull | null> => {
  const res = await apiJsonRequest<{ item: CampaignFull }>(
    `/admin/newsletters/campaigns/${encodeURIComponent(id)}`,
    'PATCH',
    data,
    { headers: authHeaders() },
  );
  return res.ok && res.data ? res.data.item : null;
};

export const deleteCampaign = async (id: string): Promise<boolean> => {
  const res = await apiRequest<{ success: boolean }>(
    `/admin/newsletters/campaigns/${encodeURIComponent(id)}`,
    { method: 'DELETE', headers: authHeaders() },
  );
  return res.ok && !!res.data?.success;
};

export const sendTestCampaign = async (id: string, to: string): Promise<{ ok: boolean; message?: string }> => {
  const res = await apiJsonRequest<{ success: boolean; message?: string }>(
    `/admin/newsletters/campaigns/${encodeURIComponent(id)}/test`,
    'POST',
    { to },
    { headers: authHeaders() },
  );
  return { ok: res.ok && !!res.data?.success, message: res.data?.message };
};

export const sendCampaign = async (id: string): Promise<{ ok: boolean; queued?: number; message?: string }> => {
  const res = await apiJsonRequest<{ success: boolean; queued?: number; message?: string }>(
    `/admin/newsletters/campaigns/${encodeURIComponent(id)}/send`,
    'POST',
    {},
    { headers: authHeaders() },
  );
  return { ok: res.ok && !!res.data?.success, queued: res.data?.queued, message: res.data?.message };
};

export const fetchDeliveries = async (campaignId: string, params: {
  page?: number;
  perPage?: number;
  status?: DeliveryStatus;
}): Promise<PageResult<DeliveryRow>> => {
  const q = new URLSearchParams();
  if (params.page) q.set('page', String(params.page));
  if (params.perPage) q.set('perPage', String(params.perPage));
  if (params.status) q.set('status', params.status);
  const query = q.toString() ? `?${q.toString()}` : '';
  const res = await apiRequest<PageResult<DeliveryRow>>(
    `/admin/newsletters/campaigns/${encodeURIComponent(campaignId)}/deliveries${query}`,
    { headers: authHeaders() },
  );
  return res.ok && res.data ? res.data : { items: [], total: 0, page: 1, perPage: params.perPage ?? 100 };
};

export const retryFailedDeliveries = async (campaignId: string): Promise<{ ok: boolean; requeued?: number }> => {
  const res = await apiJsonRequest<{ success: boolean; requeued?: number }>(
    `/admin/newsletters/campaigns/${encodeURIComponent(campaignId)}/retry-failed`,
    'POST',
    {},
    { headers: authHeaders() },
  );
  return { ok: res.ok && !!res.data?.success, requeued: res.data?.requeued };
};
