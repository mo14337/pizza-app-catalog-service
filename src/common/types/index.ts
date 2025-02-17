import { Request } from "express";

export interface AuthRequest extends Request {
    auth: {
        sub: number;
        role: string;
        id?: number;
    };
}
