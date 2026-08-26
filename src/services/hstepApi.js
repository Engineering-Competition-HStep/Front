const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');

export const ACCESS_TOKEN_KEY = 'hstep_access_token';
export const MEMBER_KEY = 'hstep_member';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
    || localStorage.getItem('accessToken')
    || sessionStorage.getItem(ACCESS_TOKEN_KEY)
    || sessionStorage.getItem('accessToken');
}

export function saveSession(tokenResponse) {
  if (!tokenResponse?.accessToken) return;

  localStorage.setItem(ACCESS_TOKEN_KEY, tokenResponse.accessToken);
  localStorage.setItem('accessToken', tokenResponse.accessToken);

  if (tokenResponse.member) {
    localStorage.setItem(MEMBER_KEY, JSON.stringify(tokenResponse.member));
  }
}

async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const token = getAccessToken();
  const headers = { Accept: 'application/json' };

  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const error = new Error(payload?.message || `요청을 처리하지 못했습니다. (${response.status})`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export async function login(userId, password) {
  const response = await request('/api/auth/login', {
    method: 'POST',
    body: { userId, password },
    auth: false,
  });
  const tokenResponse = response?.data || response;
  saveSession(tokenResponse);
  return tokenResponse;
}

export const getMyMember = () => request('/api/members/me').then((response) => response?.data || response);
export const getProfileCompleteness = () => request('/api/profile/completeness');
export const getMyRoadmaps = () => request('/api/roadmaps/base');
export const getTracks = () => request('/api/tracks', { auth: false }).then((response) => response?.data || response);
export const getGradeGpas = () => request('/api/profile/grade-gpa').then((response) => response?.data || response);
export const getCertificates = () => request('/api/profile/certificates').then((response) => response?.data || response);
export const getAwards = () => request('/api/profile/awards').then((response) => response?.data || response);
export const getVolunteers = () => request('/api/profile/volunteers').then((response) => response?.data || response);
export const getActivities = () => request('/api/profile/activities').then((response) => response?.data || response);

export const getChatRooms = () => request('/api/chat/rooms');
export const getChatMessages = (chatRoomId) => request(`/api/chat/rooms/${chatRoomId}/messages`);
export const startChatRoom = (scenario) => request('/api/chat/rooms/start', {
  method: 'POST',
  body: { scenario },
});
export const sendChatMessage = (chatRoomId, content) => request(`/api/chat/rooms/${chatRoomId}/messages`, {
  method: 'POST',
  body: { content },
});

export const getLatestNotices = (size = 4) => request(`/api/notices/latest?size=${size}`);
