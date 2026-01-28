import { Request, Response } from "express";
import { DashboardService } from "../../../application/services/dashboard.service";
import { ResponseUtil } from "../utils/Response";

export class DashboardController {
    constructor(
        private dashboardService: DashboardService
    ) {}

    async getAssetDashboard(_: Request, res: Response) {
        try {
            const assetDashboard = await this.dashboardService.getAssetDashboard();

            ResponseUtil.success(res, assetDashboard, ' Asset dashboard data retrieved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset dashboard data', 500, error);
        }
    }
}