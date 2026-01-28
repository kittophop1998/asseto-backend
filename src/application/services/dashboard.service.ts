import { AssetRequestRepository } from "../../infrastructure/database/AssetRequestRepository";

export class DashboardService {
    constructor(
        private assetRequestRepository: AssetRequestRepository
    ) { }

    async getAssetDashboard(): Promise<any> {
        const assetRequestDashBoard = await this.assetRequestRepository.getListRequestDetail();
        return assetRequestDashBoard;
    }
}
