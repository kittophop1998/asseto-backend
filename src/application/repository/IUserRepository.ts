export interface IUserRepository {
    getUserByUserName(username: string): Promise<any>;
    create(input: any): Promise<void>;
    getAllUsers(): Promise<any>;
}