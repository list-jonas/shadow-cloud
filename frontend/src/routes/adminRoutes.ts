import routesData from "../data/routesData";

export const getUsers = `${routesData.baseUrl()}/admin/users`; // => IUser[]
export const addUser = `${routesData.baseUrl()}/admin/add_user`; // userId {IUser} => message
export const editUser = `${routesData.baseUrl()}/admin/edit_user`; // userId {IUser} => message
export const deleteUser = `${routesData.baseUrl()}/admin/delete_user`; // userId {IUser} => message

export const getStats = `${routesData.baseUrl()}/admin/stats`; // => IAdminStats

export default {
    getUsers,
    addUser,
    editUser,
    deleteUser,
    getStats,
}