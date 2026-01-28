import { db } from "./maria";

export class UserRepository {
    async getUserByUserName(username: string): Promise<any> {
        const user = await db
            .selectFrom('users')
            .where('username', '=', username)
            .selectAll()
            .executeTakeFirst();
        return user;
    }

    async create(input: any): Promise<void> {
        await db
            .insertInto('users')
            .values(input)
            .execute();
    }

    async getAllUsers(): Promise<any> {
        const users = await db
            .selectFrom('users')
            .innerJoin('departments', 'users.department_id', 'departments.id')
            .select([
                'users.id',
                'users.username',
                'users.full_name',
                'users.email',
                'users.department_id',
                'departments.name as department_name'
            ])
            .execute();
        return users;
    }
}