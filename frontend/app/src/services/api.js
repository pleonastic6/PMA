const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed");
  }

  return payload;
}

export const api = {
  register: (body) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  getMe: (token) =>
    request("/users/me", {
      token,
    }),
  getUserProfile: (token, userId) =>
    request(`/users/${userId}`, {
      token,
    }),
  updateMe: (token, body) =>
    request("/users/me", {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    }),
  updatePreferences: (token, body) =>
    request("/users/me/preferences", {
      method: "PATCH",
      token,
      body: JSON.stringify(body),
    }),
  getDiscovery: (token) =>
    request("/discovery", {
      token,
    }),
  createSwipe: (token, body) =>
    request("/matches/swipe", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),
  getMatches: (token) =>
    request("/matches", {
      token,
    }),
  getConversations: (token) =>
    request("/chat/conversations", {
      token,
    }),
  getEvents: (token) =>
    request("/events", {
      token,
    }),
  createEvent: (token, body) =>
    request("/events", {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),
  searchPlaces: (token, query) =>
    request(`/places/search?q=${encodeURIComponent(query)}`, {
      token,
    }),
  searchCities: (token, query) =>
    request(`/places/search?q=${encodeURIComponent(query)}&mode=city`, {
      token,
    }),
  getMapOverview: (token) =>
    request("/map/overview", {
      token,
    }),
  getMessages: (token, userId) =>
    request(`/chat/${userId}/messages`, {
      token,
    }),
  sendMessage: (token, userId, body) =>
    request(`/chat/${userId}/messages`, {
      method: "POST",
      token,
      body: JSON.stringify(body),
    }),
};
