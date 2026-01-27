import { IAssetRequestRepository } from "../../repository/IAssetRequestRepository";

export class GetAllAssetRequestUseCase {
    constructor(
        private assetRequestRepository: IAssetRequestRepository
    ) {}

    async execute(): Promise<any> {
        const requests = await this.assetRequestRepository.getAllRequest();
        return requests;
    }
}