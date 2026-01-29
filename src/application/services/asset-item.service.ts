import { AssetItem } from "../../domain/model/AssetItem";
import { IAssetItemRepository } from "../repository/IAssetItemRepositpry";

export interface CreateAssetItemRequest {
    assetId: number;
    assetCodeAC: string;
    serialNumber: string;
    purchaseDate: string;
    warrantyEnd: string;
}

export class AssetItemService {
    constructor(
        private assetItemRepository: IAssetItemRepository
    ) { }

    async createAssetItem(input: CreateAssetItemRequest): Promise<void> {
        await this.assetItemRepository.create(input);
    }

    async getAllAssetItems(assetCodeFromAC: number): Promise<AssetItem[]> {
        const assetItems = await this.assetItemRepository.getAllAssetItems(assetCodeFromAC);
        return assetItems;
    }

    async deleteAssetItem(id: number): Promise<void> {
        await this.assetItemRepository.deleteItem(id);
    }

    async getAssetItemBySerialNumber(serialNumber: string): Promise<AssetItem | null> {
        return this.assetItemRepository.getItemBySerialNumber(serialNumber);
    }
}
