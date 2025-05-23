import { User } from '../models/User';
declare class AuthService {
    private transporter;
    constructor();
    register(email: string, password: string): Promise<void>;
    login(email: string, password: string): Promise<{
        token: string;
        user: Partial<User>;
    }>;
    verifyEmail(token: string): Promise<void>;
    private sendVerificationEmail;
    resetPassword(email: string): Promise<void>;
    confirmResetPassword(token: string, newPassword: string): Promise<void>;
}
export declare const authService: AuthService;
export {};
//# sourceMappingURL=authService.d.ts.map