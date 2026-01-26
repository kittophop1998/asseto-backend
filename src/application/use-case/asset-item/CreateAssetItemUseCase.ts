import { IAssetItemRepository } from "../../repository/IAssetItemRepositpry";

export interface CreateAssetItemRequest {
    assetId: number;
    serialNumber: string;
    purchaseDate: string;
    warrantyEnd: string;
}

export class CreateAssetItemUseCase {
    constructor(
        private assetItemRepository: IAssetItemRepository
    ) { }

    async execute(input: CreateAssetItemRequest): Promise<void> {
        await this.assetItemRepository.create(input);
    }
}