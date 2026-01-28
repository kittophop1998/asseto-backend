import { AssetItem } from "../../domain/model/AssetItem";
import { CreateAssetItemRequest } from "../services/asset-item.service";

export interface IAssetItemRepository {
    create(input:CreateAssetItemRequest): Promise<void>;
    getAllAssetItems(assetId: number): Promise<AssetItem[]>;
    deleteItem(id: number): Promise<void>;
    getItemBySerialNumber(serialNumber: string): Promise<AssetItem | null>;
    updateStatusAfterApproved(ids: number[], status: string): Promise<void>;   
}