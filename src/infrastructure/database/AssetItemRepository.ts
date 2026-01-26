import dayjs from "dayjs";
import { IAssetItemRepository } from "../../application/repository/IAssetItemRepositpry";
import { CreateAssetItemRequest } from "../../application/use-case/asset-item/CreateAssetItemUseCase";
import { db } from "./maria";
import { AssetItem } from "../../domain/model/AssetItem";

export class AssetItemRepository implements IAssetItemRepository {
    async create(input: CreateAssetItemRequest): Promise<void> {
        await db
            .insertInto('asset_items')
            .values({
                asset_id: input.assetId,
                serial_number: input.serialNumber,
                status: 'AVAILABLE',
                purchase_date: dayjs(input.purchaseDate).toDate(),
                warranty_end_date: dayjs(input.warrantyEnd).toDate(),
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .execute();
    }

    async getAllAssetItems(assetId: number): Promise<AssetItem[]> {
        const assetItems = await db
            .selectFrom('asset_items')
            .selectAll()
            .where('asset_id', '=', assetId)
            .execute();

        const assetResults = assetItems.map(item => AssetItem.create({
            id: item.id,
            assetId: item.asset_id,
            serialNumber: item.serial_number,
            status: item.status,
            purchaseDate: dayjs(item.purchase_date).toDate(),
            warrantyEnd: dayjs(item.warranty_end_date).toDate(),
            createdAt: item.created_at ? dayjs(item.created_at).toDate() : undefined,
            updatedAt: item.updated_at ? dayjs(item.updated_at).toDate() : undefined,
        }));
        return assetResults;
    }

    async deleteItem(id: number): Promise<void> {
        await db
            .deleteFrom('asset_items')
            .where('id', '=', id)
            .execute();
    }
}