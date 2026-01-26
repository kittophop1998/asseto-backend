import { Router } from "express";
import { MasterDataRepository } from "../../database/MasterDataRepository";
import { GetMasterDataUseCase } from "../../../application/use-case/master-data/GetMasterDataUseCase";
import { MasterDataController } from "../controllers/MasterDataController";

export function createMasterDataRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const masterDataRepository = new MasterDataRepository();

    /**
     * Use Case
     */
    const getMasterDataUseCase = new GetMasterDataUseCase(masterDataRepository);

    /**
     * Controller
     */
    const masterDataController = new MasterDataController(
        getMasterDataUseCase
    );

    /**
     * Routes
     */
    router.get('/', (req, res) => masterDataController.getMasterData(req, res));

    return router;
}