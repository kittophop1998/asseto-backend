import { Asset } from "../../../domain/model/Asset";
import { IAssetRepository } from "../../repository/IAssetRepository";

export class GetAssetByIdUseCase {
    constructor(
        private assetRepository: IAssetRepository
    ) { }

    async execute(id: number) :Promise<Asset>{
        return this.assetRepository.getById(id);
    }
}