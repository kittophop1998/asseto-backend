import dayjs from "dayjs";
import { IAssetRepository } from "../../application/repository/IAssetRepository";
import { db } from "./maria";
import { sql } from "kysely";
import { AssetFilters, CreateAssetRequest } from "../../application/services/asset.service";

export class AssetRepository implements IAssetRepository {
    async create(input: CreateAssetRequest): Promise<void> {
        await db
            .insertInto('assets')
            .values({
                code: input.code,
                name: input.name,
                category_id: input.categoryId,
                department_id: input.departmentId,
                description: input.description,
                minimum_qty: input.minimumQty,
                status: 'NORMAL',
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .execute();
    }

    async findAll(filters?: AssetFilters): Promise<any> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        let query = db
            .selectFrom('assets')
            .leftJoin('asset_items', 'asset_items.asset_id', 'assets.id')
            .innerJoin('categories', 'categories.id', 'assets.category_id')
            .innerJoin('departments', 'departments.id', 'assets.department_id')
            .where('assets.deleted_at', 'is', null);

        if (filters?.search) {
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
            'assets.minimum_qty',
            'assets.status',
            'assets.department_id',
            'departments.name as department_name',
            'assets.created_at',
            'assets.updated_at',
            db.fn.count<number>('asset_items.id').as('total_quantity'),
            sql<string>`SUM(CASE WHEN asset_items.status = 'AVAILABLE' THEN 1 ELSE 0 END)`.as('available_quantity'),
        ]).groupBy('assets.id').offset(skip).limit(limit).execute();

        const totalResult = await db.selectFrom('assets').select(db.fn.count<number>('id').as('count')).executeTakeFirst();
        const totalItems = totalResult ? Number(totalResult.count) : 0;

        return { data, totalItems };
    }

    async getById(id: number): Promise<any> {
        const asset = await db
            .selectFrom('assets')
            .where('assets.id', '=', id)
            .innerJoin('categories', 'categories.id', 'assets.category_id')
            .innerJoin('departments', 'departments.id', 'assets.department_id')
            .select([
                'assets.id',
                'assets.code',
                'assets.name',
                'assets.category_id',
                'categories.name as category_name',
                'assets.description',
                'assets.minimum_qty',
                'assets.status',
                'assets.department_id',
                'departments.name as department_name',
                'assets.created_at',
                'assets.updated_at',
            ])
            .executeTakeFirst();

        if (!asset) {
            throw new Error(`Asset with id ${id} not found`);
        }

        return asset;
    }

    async update(id: number, input: CreateAssetRequest): Promise<void> {
        await db
            .updateTable('assets')
            .set({
                code: input.code,
                name: input.name,
                category_id: input.categoryId,
                description: input.description,
                minimum_qty: input.minimumQty,
                status: 'NORMAL',
                department_id: input.departmentId,
                updated_at: dayjs().toDate(),
            })
            .where('id', '=', id)
            .execute();
    }

    async delete(id: number): Promise<void> {
        await db
            .updateTable('assets')
            .set({
                deleted_at: dayjs().toDate(),
            })
            .where('id', '=', id)
            .execute();
    }
}