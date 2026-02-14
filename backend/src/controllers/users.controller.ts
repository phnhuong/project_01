import { Request, Response } from 'express';
import { UsersService } from '../services/users.service';

const usersService = new UsersService();

export class UsersController {
  // Hàm xử lý: Lấy danh sách users
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const search = req.query.search as string;

      const result = await usersService.getAllUsers(page, limit, search);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Hàm xử lý: Lấy 1 user
  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
      }
      const user = await usersService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Hàm xử lý: Tạo user
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      // Validate sơ bộ (nên dùng thư viện như Joi/Zod)
      if (!req.body.username || !req.body.password || !req.body.fullName) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }
      const newUser = await usersService.createUser(req.body);
      // Trả về 201 Created
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error(error);
      // Check lỗi trùng username (Prisma error code P2002)
      if (error.code === 'P2002') {
        res.status(409).json({ message: 'Username already exists' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Hàm xử lý: Cập nhật user
  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
      }
      const updatedUser = await usersService.updateUser(id, req.body);
      res.json(updatedUser);
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2002') { // Trùng username
        res.status(409).json({ message: 'Username already exists' });
        return;
      }
      // Record to update not found
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Hàm xử lý: Xóa user
  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id as string);
      if (isNaN(id)) {
        res.status(400).json({ message: 'Invalid ID' });
        return;
      }
      await usersService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      console.error(error);
      if (error.code === 'P2025') {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}
