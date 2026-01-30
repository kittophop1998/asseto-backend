import dayjs from "dayjs";
import { IAssetItemRepository } from "../../application/repository/IAssetItemRepositpry";
import { db } from "./maria";
import { CreateAssetItemRequest } from "../../application/services/asset-item.service";

export class AssetItemRepository implements IAssetItemRepository {
    async create(input: CreateAssetItemRequest): Promise<void> {
        await db
            .insertInto('asset_items')
            .values({
                asset_id: input.assetId,
                asset_code_ac: input.assetCodeAC.trim(),
                serial_number: input.serialNumber.trim(),
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
                'asset_items.status as status',
                'asset_items.purchase_date as purchaseDate',
                'asset_items.warranty_end_date as warrantyEnd',
                'asset_items.created_at as createdAt',
                'asset_items.updated_at as updatedAt',
            ])
            .where('asset_id', '=', assetId)
            .execute();

        // const assetResults = assetItems.map(item => AssetItem.create({
        //     id: item.id,
        //     assetId: item.asset_id,
        //     assetCodeAC: item.asset_code_ac.trim(),
        //     serialNumber: item.serial_number.trim(),
        //     status: item.status,
        //     purchaseDate: dayjs(item.purchase_date).toDate(),
        //     warrantyEnd: dayjs(item.warranty_end_date).toDate(),
        //     createdAt: item.created_at ? dayjs(item.created_at).toDate() : undefined,
        //     updatedAt: item.updated_at ? dayjs(item.updated_at).toDate() : undefined,
        // }));
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

    async updateAssetItem(id: number, status: string): Promise<void> {
        await db
            .updateTable('asset_items')
            .set({
                status: status as 'AVAILABLE' | 'IN_USE',
                updated_at: dayjs().toDate(),
            })
            .where('id', '=', id)
            .execute();
    }
}