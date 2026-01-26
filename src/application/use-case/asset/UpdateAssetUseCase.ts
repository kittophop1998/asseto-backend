import { IAssetRepository } from "../../repository/IAssetRepository";
import { CreateAssetRequest } from "./CreateAssetUseCase";

export class UpdateAssetUseCase {
    constructor(
        private assetRepository: IAssetRepository
    ) { }

    async execute(id: number, input: CreateAssetRequest): Promise<void> {
        await this.assetRepository.update(id, input);
    }
}