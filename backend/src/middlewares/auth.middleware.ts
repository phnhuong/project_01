import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';

export interface AuthRequest extends Request {
    user?: any; // Customize based on your User model payload
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        res.status(401).json({ message: 'Access token required' });
        return;
    }

    jwt.verify(token, authConfig.secret, (err: any, user: any) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
        (req as AuthRequest).user = user;
        next();
    });
};
