import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

import {
  availableInterests,
  initialChatMessages,
  initialMatches,
  initialPreferences,
  initialProfiles,
  initialUserProfile,
  meetingPoints,
  nearbyUsers,
} from "../data/appData";

const AppStateContext = createContext(null);
const STORAGE_KEY = "pma_app_state_v1";

const nowTime = () => new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
const nowActive = () => "gerade eben";
const randomReply = (name) => {
  const replies = [
    `Klingt gut 😄 Wollen wir diese Woche was planen?`,
    `Haha, das mag ich. Erzähl mir mehr, ${name.split(" ")[0]}.`,
    `Bin dabei — was schwebt dir vor?`,
    `Das ist ein ziemlich guter Opener 👀`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

const initialOnboarding = {
  username: "",
  password: "",
  birthday: "2002-01-01",
  gender: "",
  location: initialUserProfile.city,
  firstName: initialUserProfile.name,
  lastName: "",
  biography: initialUserProfile.bio,
  interestsText: initialUserProfile.interests.join(", "),
  pictures: ["Profilbild", "Freizeit", "Lieblingsmoment"],
};

const loadStoredState = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AppStateProvider({ children }) {
  const stored = loadStoredState();
  const [profiles] = useState(initialProfiles);
  const [swipedProfileIds, setSwipedProfileIds] = useState(stored?.swipedProfileIds ?? []);
  const [matches, setMatches] = useState(stored?.matches ?? initialMatches);
  const [chatMessages, setChatMessages] = useState(stored?.chatMessages ?? initialChatMessages);
  const [preferences, setPreferences] = useState(stored?.preferences ?? initialPreferences);
  const [userProfile, setUserProfile] = useState(stored?.userProfile ?? initialUserProfile);
  const [onboarding, setOnboarding] = useState(stored?.onboarding ?? initialOnboarding);
  const [typingMatchIds, setTypingMatchIds] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  const replyTimeouts = useRef({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        swipedProfileIds,
        matches,
        chatMessages,
        preferences,
        userProfile,
        onboarding,
      })
    );
  }, [chatMessages, matches, onboarding, preferences, swipedProfileIds, userProfile]);

  useEffect(() => () => {
    Object.values(replyTimeouts.current).forEach((timeoutId) => clearTimeout(timeoutId));
  }, []);

  const availableProfiles = useMemo(() => {
    return profiles.filter((profile) => {
      if (swipedProfileIds.includes(profile.id)) return false;
      if (profile.age < preferences.ageRange[0] || profile.age > preferences.ageRange[1]) return false;
      if (profile.distanceKm > preferences.radiusKm) return false;
      if (preferences.interestFilters.length === 0) return true;
      return preferences.interestFilters.some((interest) => profile.interests.includes(interest));
    });
  }, [preferences.ageRange, preferences.interestFilters, preferences.radiusKm, profiles, swipedProfileIds]);

  const createMatchFromProfile = useCallback((profile) => {
    const existingMatch = matches.find((match) => match.profileId === profile.id);
    if (existingMatch) return existingMatch;

    const newMatchId = Date.now();
    const newMatch = {
      id: newMatchId,
      profileId: profile.id,
      name: profile.name,
      city: profile.city,
      initials: profile.initials,
      gradient: profile.gradient,
      lastMessage: "Ihr habt ein Match – sag hi 👋",
      lastActive: nowActive(),
      unread: 1,
    };

    setMatches((prev) => [newMatch, ...prev]);
    setChatMessages((prev) => ({
      ...prev,
      [newMatchId]: [
        { id: 1, author: "system", text: `Match mit ${profile.name}! Zeit für den ersten Move.`, time: nowTime() },
      ],
    }));

    return newMatch;
  }, [matches]);

  const swipeProfile = useCallback((profileId, direction) => {
    const profile = profiles.find((entry) => entry.id === profileId);
    if (!profile) return null;

    setSwipedProfileIds((prev) => (prev.includes(profileId) ? prev : [...prev, profileId]));
    return direction === "right" ? createMatchFromProfile(profile) : null;
  }, [createMatchFromProfile, profiles]);

  const resetDiscovery = useCallback(() => {
    setSwipedProfileIds([]);
  }, []);

  const sendMessage = useCallback((matchId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const match = matches.find((entry) => entry.id === matchId);
    const nextMessage = { id: Date.now(), author: "me", text: trimmed, time: nowTime() };

    setChatMessages((prev) => ({ ...prev, [matchId]: [...(prev[matchId] ?? []), nextMessage] }));
    setMatches((prev) => prev.map((entry) => (
      entry.id === matchId ? { ...entry, lastMessage: trimmed, lastActive: nowActive(), unread: 0 } : entry
    )));

    setTypingMatchIds((prev) => (prev.includes(matchId) ? prev : [...prev, matchId]));
    if (replyTimeouts.current[matchId]) clearTimeout(replyTimeouts.current[matchId]);

    replyTimeouts.current[matchId] = setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        author: "them",
        text: randomReply(match?.name ?? "du"),
        time: nowTime(),
      };

      setTypingMatchIds((prev) => prev.filter((id) => id !== matchId));
      setChatMessages((prev) => ({ ...prev, [matchId]: [...(prev[matchId] ?? []), reply] }));
      setMatches((prev) => prev.map((entry) => (
        entry.id === matchId
          ? {
              ...entry,
              lastMessage: reply.text,
              lastActive: nowActive(),
              unread: activeMatchId === matchId ? 0 : (entry.unread ?? 0) + 1,
            }
          : entry
      )));
    }, 1400);
  }, [activeMatchId, matches]);

  const markMatchRead = useCallback((matchId) => {
    setMatches((prev) => prev.map((match) => (
      match.id === matchId ? { ...match, unread: 0 } : match
    )));
  }, []);

  const updateNotificationSetting = useCallback((key) => {
    setPreferences((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: !prev.notifications[key] } }));
  }, []);

  const updatePrivacySetting = useCallback((key) => {
    setPreferences((prev) => ({ ...prev, privacy: { ...prev.privacy, [key]: !prev.privacy[key] } }));
  }, []);

  const setRadiusKm = useCallback((radiusKm) => {
    setPreferences((prev) => ({ ...prev, radiusKm }));
  }, []);

  const setAgeRange = useCallback((index, value) => {
    setPreferences((prev) => {
      const next = [...prev.ageRange];
      next[index] = value;
      if (next[0] > next[1]) next[index === 0 ? 1 : 0] = value;
      return { ...prev, ageRange: next };
    });
  }, []);

  const toggleInterestFilter = useCallback((interest) => {
    setPreferences((prev) => {
      const exists = prev.interestFilters.includes(interest);
      return {
        ...prev,
        interestFilters: exists ? prev.interestFilters.filter((entry) => entry !== interest) : [...prev.interestFilters, interest],
      };
    });
  }, []);

  const updateUserProfile = useCallback((field, value) => {
    setUserProfile((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleUserListField = useCallback((field, value) => {
    setUserProfile((prev) => {
      const current = prev[field] ?? [];
      return {
        ...prev,
        [field]: current.includes(value) ? current.filter((entry) => entry !== value) : [...current, value],
      };
    });
  }, []);

  const updateOnboardingField = useCallback((field, value) => {
    setOnboarding((prev) => ({ ...prev, [field]: value }));
  }, []);

  const toggleOnboardingInterest = useCallback((interest) => {
    setOnboarding((prev) => {
      const items = prev.interestsText.split(",").map((entry) => entry.trim()).filter(Boolean);
      const next = items.includes(interest) ? items.filter((entry) => entry !== interest) : [...items, interest];
      return { ...prev, interestsText: next.join(", ") };
    });
  }, []);

  const completeOnboarding = useCallback(() => {
    const derivedInterests = onboarding.interestsText.split(",").map((entry) => entry.trim()).filter(Boolean);
    const firstName = onboarding.firstName.trim() || userProfile.name;
    const lastName = onboarding.lastName.trim();
    const fullName = [firstName, lastName].filter(Boolean).join(" ");

    setUserProfile((prev) => ({
      ...prev,
      name: fullName || prev.name,
      city: onboarding.location || prev.city,
      bio: onboarding.biography || prev.bio,
      interests: derivedInterests.length > 0 ? derivedInterests : prev.interests,
      initials: `${(firstName[0] || prev.initials[0] || "U")}${(lastName[0] || prev.initials[1] || "S")}`.toUpperCase(),
    }));
  }, [onboarding, userProfile]);

  const filteredMeetingPoints = useMemo(() => {
    if (preferences.interestFilters.length === 0) return meetingPoints;
    return meetingPoints.filter((point) => preferences.interestFilters.includes(point.category) || point.category === "Kultur");
  }, [preferences.interestFilters]);

  const value = useMemo(() => ({
    profiles,
    availableProfiles,
    matches,
    chatMessages,
    preferences,
    userProfile,
    onboarding,
    availableInterests,
    filteredMeetingPoints,
    nearbyUsers,
    typingMatchIds,
    activeMatchId,
    swipeProfile,
    resetDiscovery,
    sendMessage,
    markMatchRead,
    updateNotificationSetting,
    updatePrivacySetting,
    setRadiusKm,
    setAgeRange,
    toggleInterestFilter,
    updateUserProfile,
    toggleUserListField,
    updateOnboardingField,
    toggleOnboardingInterest,
    completeOnboarding,
    setActiveMatchId,
  }), [
    profiles,
    availableProfiles,
    matches,
    chatMessages,
    preferences,
    userProfile,
    onboarding,
    filteredMeetingPoints,
    typingMatchIds,
    activeMatchId,
    swipeProfile,
    resetDiscovery,
    sendMessage,
    markMatchRead,
    updateNotificationSetting,
    updatePrivacySetting,
    setRadiusKm,
    setAgeRange,
    toggleInterestFilter,
    updateUserProfile,
    toggleUserListField,
    updateOnboardingField,
    toggleOnboardingInterest,
    completeOnboarding,
  ]);

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error("useAppState must be used within an AppStateProvider");
  return context;
}
