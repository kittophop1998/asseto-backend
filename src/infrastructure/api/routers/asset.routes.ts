import { Router } from 'express';
import { AssetRepository } from '../../database/AssetRepository';
import { GetAllAssetsUseCase } from '../../../application/use-case/asset/GetAllAssetUseCase';
import { AssetController } from '../controllers/AssetController';
import { CreateAssetUseCase } from '../../../application/use-case/asset/CreateAssetUseCase';
import { GetAssetByIdUseCase } from '../../../application/use-case/asset/GetAssetByIdUseCase';

export function createAssetRoutes() {
    const router = Router();
    
    /**
     * Repository
     */
    const assetRepository = new AssetRepository();

    /**
     * Use Case
     */
    const createAssetUseCase = new CreateAssetUseCase(assetRepository);
    const getAllAssetsUseCase = new GetAllAssetsUseCase(assetRepository);
    const getAssetByIdUseCase = new GetAssetByIdUseCase(assetRepository);

    /**
     * Controller
     */
    const assetController = new AssetController(
        createAssetUseCase,
        getAllAssetsUseCase,
        getAssetByIdUseCase
    );

    router.get('/', (req, res) => assetController.getAll(req, res));
    router.post('/', (req, res) => assetController.create(req, res));
    router.get('/:id', (req, res) => assetController.getById(req, res));

    return router;
}