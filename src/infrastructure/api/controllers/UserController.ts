import { UserService } from "../../../application/services/user.service";
import { ResponseUtil } from "../utils/Response";
import { Request, Response } from "express";

export class UserController {
    constructor(
        private userService: UserService
    ) {}

    async getAllUsers(_: Request, res: Response) {
        try {
            const users =  await this.userService.getAllUsers();
            
            ResponseUtil.success(res, users, ' Users retrieved successfully', 200);
        }catch(error:any) {
            ResponseUtil.error(res, error.message || 'Failed to get users', 500, 'GET_USERS_FAILED');
        }
    }

    async update(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            const input = req.body;

            await this.userService.update(userId, input);

            ResponseUtil.success(res, null, ' User updated successfully', 200);
        }catch(error:any) {
            ResponseUtil.error(res, error.message || 'Failed to update user', 500, 'UPDATE_USER_FAILED');
        }
    }

    async getProfile(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            const profile = await this.userService.getProfile(userId);

            ResponseUtil.success(res, profile, ' Profile retrieved successfully', 200);
        }catch(error:any) {
            ResponseUtil.error(res, error.message || 'Failed to get profile', 500, 'GET_PROFILE_FAILED');
        }
    }
}