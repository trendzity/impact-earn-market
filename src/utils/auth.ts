
export interface UserData {
  name: string;
  email: string;
  profileImage?: string;
  loginType: 'google' | 'facebook' | 'manual';
  role?: string;
  onboarded?: boolean;
  // Role specific fields
  phone?: string;          // For General User / All
  companyName?: string;    // For Business / Reseller
  website?: string;        // For Business / Reseller / Influencer
  industry?: string;       // For Business / Reseller
  bio?: string;            // For Influencer
  campaignGoal?: string;   // For Business
  socialHandle?: string;   // For Influencer
}

const USER_KEY = "user";
const TOKEN_KEY = "token";

export const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const getApiUrl = (endpoint: string) => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export const getServerUrl = (endpoint: string) => {
  if (!endpoint) return "";
  // If it's already a full URL or a Data URL (Base64), return it as is
  if (endpoint.startsWith('http') || endpoint.startsWith('data:')) {
    return endpoint;
  }
  
  // Removes /api from the base URL to get the root server URL
  const base = API_BASE_URL.replace("/api", "").endsWith('/') 
    ? API_BASE_URL.replace("/api", "").slice(0, -1) 
    : API_BASE_URL.replace("/api", "");
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}${path}`;
};

export const saveUser = (user: UserData) => {
  const userStr = JSON.stringify(user);
  localStorage.setItem(USER_KEY, userStr);
  sessionStorage.setItem(USER_KEY, userStr);
  // Dispatch event for cross-component sync
  window.dispatchEvent(new Event('user-updated'));
};

export const saveToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};


export const getUser = (): UserData | null => {
  const userStr = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
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
    saveUser(updated); // This calls saveUser which dispatches the event
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

    const url = getApiUrl("/profile");
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Normalize role for frontend
      if (data.user && data.user.role) {
        data.user.role = data.user.role.toLowerCase();
      }
      // Update local storage with fresh data
      saveUser(data.user);
      return data;
    }

    return null;
  } catch (error) {
    console.error("Fetch profile error:", error);
    return null;
  }
};

