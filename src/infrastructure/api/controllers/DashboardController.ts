import { Request, Response } from "express";
import { GetAssetDashboardUseCase } from "../../../application/use-case/dashboard/GetAssetDashboardUseCase";
import { ResponseUtil } from "../utils/Response";

export class DashboardController {
    constructor(
        private getAssetDashboardUseCase: GetAssetDashboardUseCase
    ) {}

    async getAssetDashboard(_: Request, res: Response) {
        try {
            const assetDashboard = await this.getAssetDashboardUseCase.execute();

            ResponseUtil.success(res, assetDashboard, ' Asset dashboard data retrieved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset dashboard data', 500, error);
        }
    }
}