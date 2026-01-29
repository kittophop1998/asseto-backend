import dayjs from "dayjs";
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

    async update(id: number, input: any): Promise<void> {
        await db
            .updateTable('users')
            .set({
                full_name: input.fullName,
                email: input.email,
                department_id: input.departmentId,
                updated_at: dayjs().toDate(),
            })
            .where('id', '=', id)
            .execute();
    }

    async getById(id: number): Promise<any> {
        const user = await db
            .selectFrom('users')
            .innerJoin('departments', 'users.department_id', 'departments.id')
            .select([
                'users.id',
                'users.username',
                'users.full_name',
                'users.email',
                'users.department_id',
                'users.is_approved',
                'users.role',
                'departments.name as department_name'
            ])
            .where('users.id', '=', id)
            .executeTakeFirst();
        return user;
    }
}