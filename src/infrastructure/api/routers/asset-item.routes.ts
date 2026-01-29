import { Router } from 'express';
import { AssetItemRepository } from '../../database/AssetItemRepository';
import { AssetItemService } from '../../../application/services/asset-item.service';
import { AssetItemController } from '../controllers/AssetItemController';

export function createAssetItemRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetItemRepository = new AssetItemRepository();

    /**
     * Service
     */
    const assetItemService = new AssetItemService(assetItemRepository);

    /**
     * Controller
     */
    const assetItemController = new AssetItemController(assetItemService);

    router.post('/', (req, res) => assetItemController.create(req, res));
    router.get('/serial-number/:serialNumber', (req, res) => assetItemController.getAssetItemBySerialNumber(req, res));
    router.get('/:assetId', (req, res) => assetItemController.getAllAssetItems(req, res));
    router.delete('/:id', (req, res) => assetItemController.delete(req, res));

    return router;
}