import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';

const authService = new AuthService();

export class AuthController {
    login = asyncHandler(async (req: Request, res: Response) => {
        const { username, password } = req.body;

        const result = await authService.login(username, password);
        if (!result) {
            throw new ApiError(401, 'Invalid credentials');
        }
        res.json(result);
    });
}
