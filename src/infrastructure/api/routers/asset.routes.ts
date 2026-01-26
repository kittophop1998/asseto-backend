import { Router } from 'express';
import { AssetRepository } from '../../database/AssetRepository';
import { GetAllAssetsUseCase } from '../../../application/use-case/asset/GetAllAssetUseCase';
import { AssetController } from '../controllers/AssetController';
import { CreateAssetUseCase } from '../../../application/use-case/asset/CreateAssetUseCase';

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
    const createAssetUseCase = new CreateAssetUseCase(assetRepository);

    /**
     * Controller
     */
    const assetController = new AssetController(
        getAllAssetsUseCase,
        createAssetUseCase
    );

    router.get('/', (req, res) => assetController.getAll(req, res));
    router.post('/', (req, res) => assetController.create(req, res));

    return router;
}