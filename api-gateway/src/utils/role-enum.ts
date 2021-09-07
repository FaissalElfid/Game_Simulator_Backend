export enum UserRole {
    USER = "User",
    USER_ADMIN = "UserAdmin",
}

export function matchRoles(userRole: string){
    if (userRole === UserRole[0] || userRole == UserRole[1]) {
        return true;
    } else {
        return false;
    }
}