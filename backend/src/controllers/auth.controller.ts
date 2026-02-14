import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export class AuthController {
    async login(req: Request, res: Response): Promise<void> {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(401).json({ message: 'Username and password are required' });
            return;
        }

        try {
            const result = await authService.login(username, password);
            if (!result) {
                res.status(401).json({ message: 'Invalid credentials' });
                return;
            }
            res.json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
