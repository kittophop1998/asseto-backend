import dayjs from "dayjs";
import { IAssetRepository } from "../../application/repository/IAssetRepository";
import { CreateAssetRequest } from "../../application/use-case/asset/CreateAssetUseCase";
import { AssetAllResponse, AssetFilters } from "../../application/use-case/asset/GetAllAssetUseCase";
import { db } from "./maria";
import { Asset } from "../../domain/model/Asset";

export class AssetRepository implements IAssetRepository {
    async create(input: CreateAssetRequest): Promise<void> {
        await db
            .insertInto('assets')
            .values({
                code: input.code,
                name: input.name,
                category_id: input.categoryId,
                description: input.description,
                unit: input.unit,
                total_quantity: input.totalQuantity,
                available_quantity: input.availableQuantity,
                minimum_qty: input.minimumQty,
                status: input.status,
                department_id: input.departmentId,
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .execute();
    }

    async findAll(filters?: AssetFilters): Promise<AssetAllResponse> {
        const page = filters?.page || 1;
        const limit = filters?.limit || 10;
        const skip = (page - 1) * limit;

        let query = db
            .selectFrom('assets')
            .innerJoin('categories', 'categories.id', 'assets.category_id')
            .innerJoin('departments', 'departments.id', 'assets.department_id');

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

    async getById(id: number): Promise<Asset> {
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
                'assets.unit',
                'assets.minimum_qty',
                'assets.status',
                'assets.department_id',
                'assets.total_quantity',
                'assets.available_quantity',
                'departments.name as department_name',
                'assets.created_at',
                'assets.updated_at',
            ])
            .executeTakeFirst();

        if (!asset) {
            throw new Error('Asset not found');
        }

        return Asset.create({
            id: asset.id,
            code: asset.code,
            name: asset.name,
            categoryId: asset.category_id,
            description: asset.description,
            category: asset.category_name,
            unit: asset.unit,
            totalQuantity: asset.total_quantity,
            availableQuantity: asset.available_quantity,
            minimumQty: asset.minimum_qty,
            status: asset.status,
            departmentId: asset.department_id,
            departmentName: asset.department_name,
            createdAt: asset.created_at,
            updatedAt: asset.updated_at,
        });
    }
}