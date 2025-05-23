export interface User {
    id: number;
    email: string;
    password: string;
    is_verified: boolean;
    verification_token: string | null;
    reset_token: string | null;
    created_at: Date;
    updated_at: Date;
}
export declare class UserModel {
    findByEmail(email: string): Promise<User | null>;
    create(email: string, password: string): Promise<User>;
    verifyEmail(token: string): Promise<boolean>;
    updatePassword(userId: number, newPassword: string): Promise<void>;
    saveResetToken(userId: number, token: string): Promise<void>;
    findByResetToken(token: string): Promise<User | null>;
    clearResetToken(userId: number): Promise<void>;
}
export declare const userModel: UserModel;
//# sourceMappingURL=User.d.ts.map