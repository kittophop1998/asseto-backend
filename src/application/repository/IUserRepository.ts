export interface IUserRepository {
    getUserByUserName(username: string): Promise<any>;
    getById(id: number): Promise<any>;
    create(input: any): Promise<void>;
    getAllUsers(): Promise<any>;
    update(id: number, input: any): Promise<void>;
}