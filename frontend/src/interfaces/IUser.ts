export enum Role {
    ADMIN,
    USER
}

interface IUser {
    id?:        number;
    email:      string;
    password?:  string;
    name:       string;
    role:       Role;
    createdAt?: Date;
    updatedAt?: Date;
    maxSpace:   number;
}

export default IUser;