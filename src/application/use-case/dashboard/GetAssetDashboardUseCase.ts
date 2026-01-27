import { AssetRequestRepository } from "../../../infrastructure/database/AssetRequestRepository";

export class GetAssetDashboardUseCase {
    constructor(
        private assetRequestRepository: AssetRequestRepository
    ) { }

    async execute(): Promise<any> {
        const assetRequestDashBoard = await this.assetRequestRepository.getListRequestDetail();
        return assetRequestDashBoard;
    }
}