import { Router } from 'express';
import { AssetRepository } from '../../database/AssetRepository';
import { AssetService } from '../../../application/services/asset.service';
import { AssetController } from '../controllers/AssetController';

export function createAssetRoutes() {
    const router = Router();
    
    /**
     * Repository
     */
    const assetRepository = new AssetRepository();

    /**
     * Service
     */
    const assetService = new AssetService(assetRepository);

    /**
     * Controller
     */
    const assetController = new AssetController(assetService);

    router.get('/', (req, res) => assetController.getAll(req, res));
    router.post('/', (req, res) => assetController.create(req, res));
    router.get('/:id', (req, res) => assetController.getById(req, res));
    router.put('/:id', (req, res) => assetController.update(req, res));
    router.delete('/:id', (req, res) => assetController.delete(req, res));

    return router;
}