import { IUserRepository } from "../repository/IUserRepository";
import { JWTService } from "../../infrastructure/api/utils/JWTService";
import { loginErp } from "../../infrastructure/api/utils/3rd";
import { PasswordService } from "../../infrastructure/api/utils/PasswordService";

interface LoginResponse {
    user: {
        name: string;
        department: string;
    };
    accessToken: string;
}

export class AuthService {
    constructor(
        private userRepository: IUserRepository,
    ) {}

    async login(username: string, password: string): Promise<LoginResponse> {
        const usernameTrimmed = username.trim();
        const passwordTrimmed = password.trim();

        let user = await this.userRepository.getUserByUserName(usernameTrimmed);
        if (!user) {
            
            console.log('User not found locally, attempting ERP login');
            console.log(`Attempting ERP login for user: ${usernameTrimmed}`);
            console.log(`Attempting ERP login for user: ${passwordTrimmed}`);

            const erpUser = await loginErp(usernameTrimmed, passwordTrimmed);
            if (!erpUser) {
                throw new Error('Invalid username or password');
            }

            const hashedPassword = await PasswordService.hashPassword(passwordTrimmed);
            const newUser = {
                username: erpUser.username,
                password_hash: hashedPassword,
                full_name: `${erpUser.name} ${erpUser.surname}`,
                email: `${erpUser.username}@changsiamthailand.com`,
                department_id: 1,
            };

            await this.userRepository.create(newUser);

            user = await this.userRepository.getUserByUserName(usernameTrimmed);
            if (!user) {
                throw new Error('Failed to create user');
            }
        } else {
            const isValidPassword = await PasswordService.comparePassword(passwordTrimmed, user.password_hash);
            if (!isValidPassword) {
                throw new Error('Invalid password');
            }
        }

        const token = JWTService.generateToken({
            id: user.id,
            username: user.username,
            full_name: user.full_name,
            email: user.email,
            department_id: user.department_id,
        });

        return {
            user: {
                name: user.full_name,
                department: user.department_id.toString(),
            },
            accessToken: token,
        };
    }
}
