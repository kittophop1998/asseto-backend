import { AssetItem } from "../../domain/model/AssetItem";
import { CreateAssetItemRequest } from "../services/asset-item.service";

export interface IAssetItemRepository {
    create(input:CreateAssetItemRequest): Promise<void>;
    getAllAssetItems(assetId: number): Promise<AssetItem[]>;
    deleteItem(id: number): Promise<void>;
    getItemBySerialNumber(serialNumber: string): Promise<AssetItem | null>;
    getItemByAssetItemCode(assetItemCode: string): Promise<any | null>;
    updateAssetItem(assetCode: string, input: any): Promise<void>;
}