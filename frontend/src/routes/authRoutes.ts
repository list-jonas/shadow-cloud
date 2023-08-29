import routesData from "../data/routesData";

export const login = `${routesData.baseUrl()}/auth/login`; // {email, password} => message
export const changePassword = `${routesData.baseUrl()}/auth/change_password`; // {id, password, newPassword} => message
export const checkSession = `${routesData.baseUrl()}/auth/checkSession`; // => user
export const logout = `${routesData.baseUrl()}/auth/logout`; // => message

export default {
  login,
  checkSession,
  logout
}