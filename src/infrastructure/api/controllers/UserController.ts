import { UserService } from "../../../application/services/user.service";
import { ResponseUtil } from "../utils/Response";

export class UserController {
    constructor(
        private userService: UserService
    ) {}

    async getAllUsers(_: any, res: any) {
        try {
            const users =  await this.userService.getAllUsers();
            
            ResponseUtil.success(res, users, ' Users retrieved successfully', 200);
        }catch(error:any) {
            ResponseUtil.error(res, ' Failed to get users', 500, error);
        }
    }
}