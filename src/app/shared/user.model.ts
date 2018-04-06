import { UserProfile } from "./user-profile.model";

export enum UserType {
    User = 0,
    Admin = 1
}

export const UserTypeAlias: string[] = [
    "Пользователь",
    "Администратор"
];

export enum UserStatus {
    Inactive = 0,
    Active = 1,
    Deleted = 2
}

export const UserStatusAlias: string[] = [
    "Отключен",
    "Активный",
    "Удален"
];

export class User {
    public status: UserStatus;
    public type: UserType;
    public roles: string[];
    public profile: UserProfile = null;

    constructor(public userId: string, public email: string, public token?: string) {}
}