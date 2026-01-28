import { Router } from "express";
import { AssetRequestRepository } from "../../database/AssetRequestRepository";
import { DashboardService } from "../../../application/services/dashboard.service";
import { DashboardController } from "../controllers/DashboardController";

export function createDashboardRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetRequestRepository = new AssetRequestRepository();

    /**
     * Service
     */
    const dashboardService = new DashboardService(assetRequestRepository);

    /**
     * Controller
     */
    const dashboardController = new DashboardController(dashboardService);

    /**
     * Routes
     */
    router.get('/', (req, res) => dashboardController.getAssetDashboard(req, res));

    return router;
}