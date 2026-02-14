import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiError } from '../utils/ApiError';

const usersService = new UsersService();

export class UsersController {
  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const search = req.query.search as string;

    const result = await usersService.getAllUsers(page, limit, search);
    res.json(result);
  });

  getUser = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    const user = await usersService.getUserById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
    res.json(user);
  });

  createUser = asyncHandler(async (req: Request, res: Response) => {
    const newUser = await usersService.createUser(req.body);
    res.status(201).json(newUser);
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    // Check if exists
    const existing = await usersService.getUserById(id);
    if (!existing) {
      throw new ApiError(404, 'User not found');
    }
    const updatedUser = await usersService.updateUser(id, req.body);
    res.json(updatedUser);
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id as string);
    // Check if exists
    const existing = await usersService.getUserById(id);
    if (!existing) {
      throw new ApiError(404, 'User not found');
    }
    await usersService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  });
}
