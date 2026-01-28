import { Router } from "express";
import { AssetReturnRepository } from "../../database/AssetReturnRepository";
import { AssetReturnService } from "../../../application/services/asset-return.service";
import { AssetReturnController } from "../controllers/AssetReturnController";

export function createAssetReturnRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetReturnRepository = new AssetReturnRepository();

    /**
     * Service
     */
    const assetReturnService = new AssetReturnService(assetReturnRepository);

    /**
     * Controller
     */
    const assetReturnController = new AssetReturnController(assetReturnService);

    /**
     * Routes
     */
    router.post('/:code/approve', (req, res) => assetReturnController.approveAssetReturnByCode(req, res));
    router.get('/:code', (req, res) => assetReturnController.getAssetReturnByCode(req, res));
    router.delete('/:code', (req, res) => assetReturnController.deleteAssetReturnByCode(req, res));
    router.get('/', (req, res) => assetReturnController.getAllAssetReturn(req, res));
    router.post('/', (req, res) => assetReturnController.create(req, res));

    return router;
}