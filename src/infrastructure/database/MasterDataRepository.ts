import { IMasterDataRepository } from "../../application/repository/IMasterDataRepository";
import { db } from "./maria";

export class MasterDataRepository implements IMasterDataRepository {
    async getDepartment(): Promise<any> {
        const departments = await db
            .selectFrom('departments')
            .selectAll()
            .execute();

        return departments;
    }

    async getCategory(): Promise<any> {
        const categories = await db
            .selectFrom('categories')
            .selectAll()
            .execute();

        return categories;
    }

    async getLocation(): Promise<any> {
        const locations = await db
            .selectFrom('locations')
            .selectAll()
            .where('is_active', '=', 1)
            .execute();

        return locations;
    }
}