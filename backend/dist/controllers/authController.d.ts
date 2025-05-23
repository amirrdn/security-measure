import { Request, Response } from 'express';
export declare const loginLimiter: import("express-rate-limit").RateLimitRequestHandler;
export declare const validateRegistration: import("express-validator").ValidationChain[];
export declare const validateLogin: import("express-validator").ValidationChain[];
export declare const register: (req: Request, res: Response) => Promise<void>;
export declare const login: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const resetPassword: (req: Request, res: Response) => Promise<void>;
export declare const confirmResetPassword: (req: Request, res: Response) => Promise<void>;
export declare const logout: (req: Request, res: Response) => void;
//# sourceMappingURL=authController.d.ts.map