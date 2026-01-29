import { IUserRepository } from "../repository/IUserRepository";

export class UserService {
    constructor(
        private userRepository: IUserRepository
    ) {}

    async getAllUsers(): Promise<any> {
        const users = await this.userRepository.getAllUsers();
        return users;
    }

    async update(id: number, input: any): Promise<void> {
        await this.userRepository.update(id, input);
    }

    async getProfile(id: number): Promise<any> {
        return this.userRepository.getById(id);
    }
}
