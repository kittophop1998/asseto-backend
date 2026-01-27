import { IAssetReturnRepository } from "../../repository/IAssetReturnRepository";

export class GetAllAssetReturnUseCase {
    constructor(
        private assetReturnRepository: IAssetReturnRepository
    ) {}

    async execute(): Promise<any[]> {
        return await this.assetReturnRepository.getAllAssetReturns();
    }
}