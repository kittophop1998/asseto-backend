import { AssetItem } from "../../domain/model/AssetItem";
import { CreateAssetItemRequest } from "../use-case/asset-item/CreateAssetItemUseCase";

export interface IAssetItemRepository {
    create(input:CreateAssetItemRequest): Promise<void>;
    getAllAssetItems(assetId: number): Promise<AssetItem[]>;
    deleteItem(id: number): Promise<void>;
}