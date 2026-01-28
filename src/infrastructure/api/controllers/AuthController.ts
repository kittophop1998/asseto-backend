import { AuthService } from "../../../application/services/auth.service";
import { ResponseUtil } from "../utils/Response";

export class AuthController {
    constructor(
        private authService: AuthService,
    ) {}

    async login(req: any, res: any): Promise<void> {
        try {
            const { username, password } = req.body;
            if (!username || !password) {
                ResponseUtil.badRequest(res, 'Username and password are required');
                return;
            }

            const result = await this.authService.login(username, password);
            
            ResponseUtil.success(res, result, 'Login successful');
        } catch (error: any) {
            ResponseUtil.unauthorized(res, error.message || 'Login failed');
        }
    }
}