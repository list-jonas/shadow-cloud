import routesData from "../data/routesData";

export const login = `${routesData.baseUrl()}/auth/login`; // {email, password}
export const checkSession = `${routesData.baseUrl()}/auth/checkSession`; // => user
export const logout = `${routesData.baseUrl()}/auth/logout`; // => message

export default {
  login,
  checkSession,
  logout
}