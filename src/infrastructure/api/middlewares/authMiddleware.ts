import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../utils/JWTService';
import { ResponseUtil } from '../utils/Response';

// Extend Express Request interface to include user data
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
                full_name: string;
                email: string;
                department_id: number;
            };
        }
    }
}

/**
 * Middleware สำหรับตรวจสอบ JWT token
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            ResponseUtil.unauthorized(res, 'No token provided');
            return;
        }

        const token = authHeader.substring(7);
        const decoded = JWTService.verifyToken(token);
        req.user = decoded;

        next();
    } catch (error: any) {
        ResponseUtil.unauthorized(res, error.message || 'Invalid token');
    }
};
