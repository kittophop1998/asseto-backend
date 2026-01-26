import { AssetItem } from "../../../domain/model/AssetItem";
import { IAssetItemRepository } from "../../repository/IAssetItemRepositpry";

export class GetAllAssetItemsUseCase {
    constructor(
        private assetItemRepository: IAssetItemRepository 
    ) { }

    async execute(assetId: number): Promise<AssetItem[]> {
        const assetItems = await this.assetItemRepository.getAllAssetItems(assetId);
        return assetItems;
    }
}