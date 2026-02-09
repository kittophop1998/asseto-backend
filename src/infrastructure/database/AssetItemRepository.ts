import dayjs from "dayjs";
import { IAssetItemRepository } from "../../application/repository/IAssetItemRepositpry";
import { db } from "./maria";
import { CreateAssetItemRequest } from "../../application/services/asset-item.service";
import { sql } from "kysely";

export class AssetItemRepository implements IAssetItemRepository {
    async create(input: CreateAssetItemRequest): Promise<void> {
        await db
            .insertInto('asset_items')
            .values({
                asset_id: input.assetId,
                asset_code_ac: input.assetCodeAC.trim(),
                asset_code: input.assetCode.trim(),
                serial_number: input.serialNumber.trim(),
                quantity: input.quantity,
                status: 'AVAILABLE',
                purchase_date: dayjs(input.purchaseDate).toDate(),
                warranty_end_date: dayjs(input.warrantyEnd).toDate(),
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .execute();
    }

    async getAllAssetItems(assetId: number): Promise<any> {
        const assetItems = await db
            .selectFrom('asset_items')
            .select([
                'asset_items.id as assetId',
                'asset_items.serial_number as serialNumber',
                'asset_items.asset_code_ac as assetCodeAC',
                'asset_items.asset_code as assetCode',
                'asset_items.status as status',
                sql`DATE_FORMAT(CONVERT_TZ(asset_items.purchase_date,'+00:00','+07:00'), '%Y-%m-%d')`.as('purchaseDate'),
                sql`DATE_FORMAT(CONVERT_TZ(asset_items.warranty_end_date,'+00:00','+07:00'), '%Y-%m-%d')`.as('warrantyEnd'),
                sql`DATE_FORMAT(CONVERT_TZ(asset_items.created_at,'+00:00','+07:00'), '%Y-%m-%d %H:%i:%s')`.as('createdAt'),
                sql`DATE_FORMAT(CONVERT_TZ(asset_items.updated_at,'+00:00','+07:00'), '%Y-%m-%d %H:%i:%s')`.as('updatedAt'),
            ])
            .where('asset_id', '=', assetId)
            .execute();

        return assetItems;
    }

    async deleteItem(id: number): Promise<void> {
        await db
            .deleteFrom('asset_items')
            .where('id', '=', id)
            .execute();
    }

    async getItemBySerialNumber(serialNumber: string): Promise<any> {
        const assetItems = await db
            .selectFrom('asset_items')
            .innerJoin('assets', 'asset_items.asset_id', 'assets.id')
            .select([
                'asset_items.id as id',
                'asset_items.asset_id as assetId',
                'assets.name as assetName',
                'asset_items.asset_code_ac as assetCodeAC',
                'asset_items.serial_number as serialNumber',
                'asset_items.status as status',
                'asset_items.purchase_date as purchaseDate',
                'asset_items.warranty_end_date as warrantyEnd',
                'asset_items.created_at as createdAt',
                'asset_items.updated_at as updatedAt',
            ])
            .where('serial_number', '=', serialNumber.trim())
            .executeTakeFirst();

        if (!assetItems) {
            return null;
        }

        return assetItems;
    }

    async updateAssetItem(assetCode: string, input: any): Promise<void> {
        await db
            .updateTable('asset_items')
            .set({
                ...input,
                updated_at: dayjs().toDate(),
            })
            .where('asset_code', '=', assetCode)
            .execute();
    }

    async getItemByAssetItemCode(assetItemCode: string): Promise<any | null> {
        const assetItem = await db
            .selectFrom('asset_items')
            .innerJoin('assets', 'asset_items.asset_id', 'assets.id')
            .innerJoin('categories', 'assets.category_id', 'categories.id')
            .select([
                'asset_items.id as id',
                'asset_items.asset_id as assetId',
                'assets.name as assetName',
                'asset_items.asset_code_ac as assetCodeAC',
                'asset_items.asset_code as assetCode',
                'asset_items.serial_number as serialNumber',
                'asset_items.status as status',
                'categories.name as categoryName',
                'categories.prefix as categoryPrefix',
                'asset_items.purchase_date as purchaseDate',
                'asset_items.warranty_end_date as warrantyEnd',
                'asset_items.created_at as createdAt',
                'asset_items.updated_at as updatedAt',
            ])
            .where('asset_items.asset_code', '=', assetItemCode)
            .executeTakeFirst();

        if (!assetItem) {
            return null;
        }

        return assetItem;
    }

    async checkQtyAvailable(assetItemCode: string, quantity: number): Promise<boolean> {
        const assetItem = await db
            .selectFrom('asset_items')
            .innerJoin('asset_requests', 'asset_items.asset_code', 'asset_requests.asset_item_code')
            .select([
                'asset_item_code as asset_code',
                'asset_items.quantity as assetItem_quantity',
                sql<number>`CAST(COALESCE(SUM(asset_requests.quantity), 0) AS INTEGER)`.as('assetRequest_qty'),
                sql<number>`CAST(COALESCE(SUM(asset_items.quantity), 0) - COALESCE(SUM(asset_requests.quantity), 0) AS INTEGER)`.as('remaining_quantity'),
            ])
            .where('asset_requests.status', 'in', ['PENDING', 'APPROVED'])
            .where('asset_code', '=', assetItemCode)
            .executeTakeFirst();

        if (!assetItem) {
            return false;
        }

        return assetItem.remaining_quantity >= quantity;
    }
}