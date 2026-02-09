import { AssetItem } from "../../domain/model/AssetItem";
import { IAssetItemRepository } from "../repository/IAssetItemRepositpry";

export interface CreateAssetItemRequest {
    assetId: number;
    assetCodeAC: string;
    assetCode: string;
    serialNumber: string;
    quantity: number;
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

    async getAssetItemByAssetItemCode(assetItemCode: string): Promise<any | null> {
        return this.assetItemRepository.getItemByAssetItemCode(assetItemCode);
    }

    async update(assetCode: string, input: any): Promise<void> {
        const inputUpdate = {
            asset_code_ac: input.assetCodeAC,
            asset_code: input.assetCode,
            serial_number: input.serialNumber,
            purchase_date: input.purchaseDate,
            warranty_end_date: input.warrantyEnd
        };
        
        await this.assetItemRepository.updateAssetItem(assetCode, inputUpdate);
    }
}
