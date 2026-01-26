import { Router } from 'express';
import { AssetRepository } from '../../database/AssetRepository';
import { GetAllAssetsUseCase } from '../../../application/use-case/asset/GetAllAssetUseCase';
import { AssetController } from '../controllers/AssetController';

export function createAssetRoutes() {
    const router = Router();
    
    /**
     * Repository
     */
    const assetRepository = new AssetRepository();

    /**
     * Use Case
     */
    const getAllAssetsUseCase = new GetAllAssetsUseCase(assetRepository);

    /**
     * Controller
     */
    const assetController = new AssetController(
        getAllAssetsUseCase
    );

    router.get('/', (req, res) => assetController.getAll(req, res));

    return router;
}