import { UserRole } from "@/types/auth";

const AUTH_COOKIE_NAME = "desideri_auth";
const ROLE_COOKIE_NAME = "desideri_role";

export interface AuthCookies {
  isAuthenticated: boolean;
  role: UserRole | null;
}

export const setCookies = (isAuthenticated: boolean, role: UserRole | null) => {
  if (typeof document !== "undefined") {
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 24 ore

    document.cookie = `${AUTH_COOKIE_NAME}=${isAuthenticated}; expires=${expires.toUTCString()}; path=/`;
    document.cookie = `${ROLE_COOKIE_NAME}=${
      role || ""
    }; expires=${expires.toUTCString()}; path=/`;
  }
};

export const getCookies = (): AuthCookies => {
  if (typeof document === "undefined") {
    return { isAuthenticated: false, role: null };
  }

  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split("=");
    acc[name] = value;
    return acc;
  }, {} as Record<string, string>);

  const isAuthenticated = cookies[AUTH_COOKIE_NAME] === "true";
  const role = (cookies[ROLE_COOKIE_NAME] as UserRole) || null;

  return { isAuthenticated, role };
};

export const clearCookies = () => {
  if (typeof document !== "undefined") {
    document.cookie = `${AUTH_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `${ROLE_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  }
};
