export enum Role {
    ADMIN,
    USER
}

interface IUser {
    id:        string;
    email:     string;
    name:      string;
    role:      Role;
    createdAt: Date;
    updatedAt: Date;
    maxSpace:  number;
}

export default IUser;