export interface UserData {
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
}

const USER_KEY = "user";
const TOKEN_KEY = "token";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://backend-23gy.onrender.com/api";

export const getApiUrl = (endpoint: string) => {
  const base = API_BASE_URL.endsWith('/')
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

  const base = API_BASE_URL.replace("/api", "").endsWith('/')
    ? API_BASE_URL.replace("/api", "").slice(0, -1)
    : API_BASE_URL.replace("/api", "");

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
    const result = await apiFetch<any>("/profile");
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