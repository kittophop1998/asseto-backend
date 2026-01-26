import { IAssetItemRepository } from "../../repository/IAssetItemRepositpry";

export class DeleteAssetItemUseCase {
    constructor(
        private assetItemRepository: IAssetItemRepository
    ) { }

    async execute(id: number): Promise<void> {
        await this.assetItemRepository.deleteItem(id);
    }
}