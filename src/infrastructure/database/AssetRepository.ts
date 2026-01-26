import { AssetAllResponse, AssetFilters, IAssetRepository } from "../../application/repository/IAssetRepository";
import { db } from "./maria";

export class AssetRepository implements IAssetRepository {
    async findAll(filters?: AssetFilters): Promise<AssetAllResponse> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        let query = db
            .selectFrom('assets')
            .innerJoin('categories', 'categories.id', 'assets.category_id')
            .innerJoin('departments', 'departments.id', 'assets.department_id');

        if(filters?.search){
            query = query.where((eb) =>
                eb.or([
                    eb('code', 'like', `%${filters.search}%`),
                    eb('name', 'like', `%${filters.search}%`),
                    eb('description', 'like', `%${filters.search}%`),
                ])
            );
        }

        const data = await query.select([
            'assets.id',
            'assets.code',
            'assets.name',
            'assets.category_id',
            'categories.name as category_name',
            'assets.description',
            'assets.unit',
            'assets.minimum_qty',
            'assets.status',
            'assets.department_id',
            'departments.name as department_name',
            'assets.created_at',
            'assets.updated_at',
        ]).offset(skip).limit(limit).execute();
        const totalResult = await db.selectFrom('assets').select(db.fn.count<number>('id').as('count')).executeTakeFirst();
        const totalItems = totalResult ? Number(totalResult.count) : 0;

        return { data, totalItems };
    }
}