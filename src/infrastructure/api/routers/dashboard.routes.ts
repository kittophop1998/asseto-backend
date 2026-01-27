import { Router } from "express";
import { AssetRequestRepository } from "../../database/AssetRequestRepository";
import { GetAssetDashboardUseCase } from "../../../application/use-case/dashboard/GetAssetDashboardUseCase";
import { DashboardController } from "../controllers/DashboardController";

export function createDashboardRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetRequestRepository = new AssetRequestRepository();

    /**
     * Use Case
     */
    const getAssetDashboardUseCase = new GetAssetDashboardUseCase(assetRequestRepository);

    /**
     * Controller
     */
    const dashboardController = new DashboardController(
        getAssetDashboardUseCase
    );

    /**
     * Routes
     */
    router.get('/', (req, res) => dashboardController.getAssetDashboard(req, res));

    return router;
}