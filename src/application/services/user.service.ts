import { IUserRepository } from "../repository/IUserRepository";

export class UserService {
    constructor(
        private userRepository: IUserRepository
    ) {}

    async getAllUsers(): Promise<any> {
        const users = await this.userRepository.getAllUsers();
        return users;
    }
}
