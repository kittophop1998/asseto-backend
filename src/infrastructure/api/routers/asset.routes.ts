import { Router } from 'express';
import { AssetRepository } from '../../database/AssetRepository';
import { GetAllAssetsUseCase } from '../../../application/use-case/asset/GetAllAssetUseCase';
import { AssetController } from '../controllers/AssetController';
import { CreateAssetUseCase } from '../../../application/use-case/asset/CreateAssetUseCase';
import { GetAssetByIdUseCase } from '../../../application/use-case/asset/GetAssetByIdUseCase';
import { UpdateAssetUseCase } from '../../../application/use-case/asset/UpdateAssetUseCase';

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
    const updateAssetUseCase = new UpdateAssetUseCase(assetRepository);

    /**
     * Controller
     */
    const assetController = new AssetController(
        createAssetUseCase,
        getAllAssetsUseCase,
        getAssetByIdUseCase,
        updateAssetUseCase
    );

    router.get('/', (req, res) => assetController.getAll(req, res));
    router.post('/', (req, res) => assetController.create(req, res));
    router.get('/:id', (req, res) => assetController.getById(req, res));
    router.put('/:id', (req, res) => assetController.update(req, res));

    return router;
}