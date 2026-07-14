import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

const TOKEN_STORAGE_KEY = "pma_auth_token";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY) || "");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_STORAGE_KEY)));

  useEffect(() => {
    let active = true;

    async function hydrateUser() {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.getMe(token);
        if (active) {
          setUser(response.data);
        }
      } catch (error) {
        if (active) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setToken("");
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    hydrateUser();

    return () => {
      active = false;
    };
  }, [token]);

  const persistSession = useCallback((nextToken, nextUser) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.login(credentials);
    persistSession(response.data.token, response.data.user);
    return response.data.user;
  }, [persistSession]);

  const completeRegistration = useCallback(async (payload) => {
    const response = await api.register(payload);
    persistSession(response.data.token, response.data.user);
    return response.data.user;
  }, [persistSession]);

  const refreshProfile = useCallback(async () => {
    if (!token) {
      return null;
    }

    const response = await api.getMe(token);
    setUser(response.data);
    return response.data;
  }, [token]);

  const getUserProfile = useCallback(async (userId) => {
    const response = await api.getUserProfile(token, userId);
    return response.data;
  }, [token]);

  const updateProfile = useCallback(async (profileUpdate) => {
    const response = await api.updateMe(token, profileUpdate);
    setUser(response.data);
    return response.data;
  }, [token]);

  const getDiscovery = useCallback(async () => {
    const response = await api.getDiscovery(token);
    return response.data;
  }, [token]);

  const swipe = useCallback(async (payload) => {
    const response = await api.createSwipe(token, payload);
    return response.data;
  }, [token]);

  const getMatches = useCallback(async () => {
    const response = await api.getMatches(token);
    return response.data;
  }, [token]);

  const getConversations = useCallback(async () => {
    const response = await api.getConversations(token);
    return response.data;
  }, [token]);

  const getEvents = useCallback(async () => {
    const response = await api.getEvents(token);
    return response.data;
  }, [token]);

  const createEvent = useCallback(async (payload) => {
    const response = await api.createEvent(token, payload);
    return response.data;
  }, [token]);

  const searchPlaces = useCallback(async (query) => {
    const response = await api.searchPlaces(token, query);
    return response.data;
  }, [token]);

  const searchCities = useCallback(async (query) => {
    const response = await api.searchCities(token, query);
    return response.data;
  }, [token]);

  const getMapOverview = useCallback(async () => {
    const response = await api.getMapOverview(token);
    return response.data;
  }, [token]);

  const getMessages = useCallback(async (userId) => {
    const response = await api.getMessages(token, userId);
    return response.data;
  }, [token]);

  const sendMessage = useCallback(async (userId, text) => {
    const response = await api.sendMessage(token, userId, { text });
    return response.data;
  }, [token]);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    token,
    user,
    loading,
    isAuthenticated: Boolean(token && user),
    login,
    completeRegistration,
    refreshProfile,
    getUserProfile,
    updateProfile,
    getDiscovery,
    swipe,
    getMatches,
    getConversations,
    getEvents,
    createEvent,
    searchPlaces,
    searchCities,
    getMapOverview,
    getMessages,
    sendMessage,
    logout,
  }), [
    token,
    user,
    loading,
    login,
    completeRegistration,
    refreshProfile,
    getUserProfile,
    updateProfile,
    getDiscovery,
    swipe,
    getMatches,
    getConversations,
    getEvents,
    createEvent,
    searchPlaces,
    searchCities,
    getMapOverview,
    getMessages,
    sendMessage,
    logout,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
