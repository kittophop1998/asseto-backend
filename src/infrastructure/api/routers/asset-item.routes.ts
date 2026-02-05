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
    router.get('/items/:assetId', (req, res) => assetItemController.getAllAssetItems(req, res));
    router.get('/:id', (req, res) => assetItemController.getAssetItemByAssetItemCode(req, res));
    router.put('/:id', (req, res) => assetItemController.update(req, res));
    router.delete('/:id', (req, res) => assetItemController.delete(req, res));

    return router;
}