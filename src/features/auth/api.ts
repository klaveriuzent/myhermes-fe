export type AuthUser = {
  user_id: string;
  name: string;
  email: string;
  app_id: string;
  roles: string[];
};

export type AuthMeResponse = {
  authenticated: boolean;
  user?: AuthUser;
};

export type AuthCallbackResponse = {
  data: AuthUser;
};

const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  "https://api.myhermesservice.online/api"
).replace(/\/+$/, "");

export const authEndpoints = {
  ssoStart: `${API_BASE_URL}/auth/sso/start`,
  ssoCallback: `${API_BASE_URL}/auth/sso/callback`,
  me: `${API_BASE_URL}/auth/me`,
  logout: `${API_BASE_URL}/auth/logout`,
};

const LAST_AUTH_USER_KEY = "myhermes:last_auth_user";

export type LastAuthUser = Pick<AuthUser, "user_id" | "name" | "email">;

export function getLastAuthUser(): LastAuthUser | null {
  try {
    const raw = window.localStorage.getItem(LAST_AUTH_USER_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as Partial<LastAuthUser>;
    if (!parsed.user_id || !parsed.email) {
      return null;
    }

    return {
      user_id: parsed.user_id,
      name: parsed.name || parsed.email,
      email: parsed.email,
    };
  } catch {
    return null;
  }
}

export function storeLastAuthUser(user: AuthUser) {
  const value: LastAuthUser = {
    user_id: user.user_id,
    name: user.name || user.email,
    email: user.email,
  };
  window.localStorage.setItem(LAST_AUTH_USER_KEY, JSON.stringify(value));
}

export function buildSsoStartUrl(mode?: "switch") {
  if (mode !== "switch") {
    return authEndpoints.ssoStart;
  }

  const separator = authEndpoints.ssoStart.includes("?") ? "&" : "?";
  return `${authEndpoints.ssoStart}${separator}mode=switch`;
}

export async function fetchCurrentUser() {
  const response = await fetch(authEndpoints.me, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to load session.");
  }
  return (await response.json()) as AuthMeResponse;
}

export async function completeSsoLogin(code: string, state: string) {
  const response = await fetch(authEndpoints.ssoCallback, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code, state }),
  });

  if (!response.ok) {
    throw new Error("Login gagal. Silakan coba lagi.");
  }

  return (await response.json()) as AuthCallbackResponse;
}

export async function logout() {
  const response = await fetch(authEndpoints.logout, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Logout gagal.");
  }
}
