let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
API_URL = API_URL.replace(/\/$/, '');
if (!API_URL.endsWith('/api')) {
  API_URL += '/api';
}

async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data;
}

export const api = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload }),
  me: (token) => request('/auth/me', { token }),

  listTournaments: (params = '') => request(`/tournaments${params}`),
  getTournament: (id) => request(`/tournaments/${id}`),
  createTournament: (payload, token) => request('/tournaments', { method: 'POST', body: payload, token }),
  generateBracket: (id, token) => request(`/tournaments/${id}/generate-bracket`, { method: 'POST', token }),

  registerTeam: (tournamentId, payload, token) =>
    request(`/tournaments/${tournamentId}/teams`, { method: 'POST', body: payload, token }),
  listTeams: (tournamentId) => request(`/tournaments/${tournamentId}/teams`),

  checkout: (teamId, token) => request('/payments/checkout', { method: 'POST', body: { teamId }, token }),

  reportResult: (matchId, payload, token) =>
    request(`/matches/${matchId}/result`, { method: 'PUT', body: payload, token }),

  adminOverview: (token) => request('/admin/overview', { token }),
};
