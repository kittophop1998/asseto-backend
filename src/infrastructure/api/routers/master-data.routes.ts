import { Router } from "express";
import { MasterDataRepository } from "../../database/MasterDataRepository";
import { MasterDataService } from "../../../application/services/master-data.service";
import { MasterDataController } from "../controllers/MasterDataController";

export function createMasterDataRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const masterDataRepository = new MasterDataRepository();

    /**
     * Service
     */
    const masterDataService = new MasterDataService(masterDataRepository);

    /**
     * Controller
     */
    const masterDataController = new MasterDataController(masterDataService);

    /**
     * Routes
     */
    router.get('/', (req, res) => masterDataController.getMasterData(req, res));

    return router;
}