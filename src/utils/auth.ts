export interface UserData {
  id?:string;
  name: string;
  email: string;
  profileImage?: string;
  loginType: 'google' | 'facebook' | 'manual';
  role?: string;
  onboarded?: boolean;
  phone?: string;
  companyName?: string;
  website?: string;
  industry?: string;
  bio?: string;
  campaignGoal?: string;
  socialHandle?: string;
  primaryCategory?: string;
  secondaryCategory?: string;
  createdAt?: string;
}

interface ProfileResponse{
  user:UserData;
  profile?: Record<string, unknown> | null;
}

import { API_BASE_URL, getEnvConfigError } from "@/config/env";

const USER_KEY = "user";
const TOKEN_KEY = "token";

export { API_BASE_URL };

function requireApiBaseUrl(): string {
  if (!API_BASE_URL) {
    throw new Error(getEnvConfigError() ?? "API base URL is not configured.");
  }
  return API_BASE_URL;
}

export const getApiUrl = (endpoint: string) => {
  const base = requireApiBaseUrl().endsWith('/')
    ? API_BASE_URL.slice(0, -1)
    : API_BASE_URL;

  const path = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  return `${base}${path}`;
};

export const getServerUrl = (endpoint: string) => {
  if (!endpoint) return "";

  if (endpoint.startsWith('http') || endpoint.startsWith('data:')) {
    return endpoint;
  }

  const apiBase = requireApiBaseUrl();
  const serverBase = apiBase.replace("/api", "");
  const base = serverBase.endsWith('/')
    ? serverBase.slice(0, -1)
    : serverBase;

  const path = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`;

  return `${base}${path}`;
};

export const saveUser = (user: UserData) => {
  const userStr = JSON.stringify(user);

  localStorage.setItem(USER_KEY, userStr);
  sessionStorage.setItem(USER_KEY, userStr);

  window.dispatchEvent(new Event('user-updated'));
};

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return (
    localStorage.getItem(TOKEN_KEY) ||
    sessionStorage.getItem(TOKEN_KEY)
  );
};

export const getUser = (): UserData | null => {
  const userStr =
    localStorage.getItem(USER_KEY) ||
    sessionStorage.getItem(USER_KEY);

  if (!userStr) return null;

  try {
    return JSON.parse(userStr);
  } catch (e) {
    console.error("Error parsing user from storage", e);
    return null;
  }
};

export const updateUser = (updates: Partial<UserData>) => {
  const current = getUser();

  if (current) {
    const updated = { ...current, ...updates };
    saveUser(updated);
    return updated;
  }

  return null;
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem("role");
};

export const fetchProfile = async () => {
  try {
    const token = getToken();

    if (!token) return null;

    const { apiFetch } = await import("@/utils/api");
    const result = await apiFetch<ProfileResponse>("/profile");
    if (!result.ok) return null;

    const data = result.data;

    if (data?.user && data.user.role) {
      data.user.role = data.user.role.toLowerCase();
    }

    if (data?.user) {
      saveUser(data.user);
    }

    return data;
  } catch (error) {
    console.error("Fetch profile error:", error);
    return null;
  }
};