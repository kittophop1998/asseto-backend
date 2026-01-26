import { Router } from 'express';
import { AssetItemRepository } from '../../database/AssetItemRepository';
import { GetAllAssetItemsUseCase } from '../../../application/use-case/asset-item/GetAllAssetItemsUseCase';
import { AssetItemController } from '../controllers/AssetItemController';
import { CreateAssetItemUseCase } from '../../../application/use-case/asset-item/CreateAssetItemUseCase';
import { DeleteAssetItemUseCase } from '../../../application/use-case/asset-item/DeleteAssetItemUseCase';

export function createAssetItemRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetItemRepository = new AssetItemRepository();

    /**
     * Use Case
     */
    const createAssetItemUseCase = new CreateAssetItemUseCase(assetItemRepository);
    const getAllAssetItemsUseCase = new GetAllAssetItemsUseCase(assetItemRepository);
    const deleteAssetItemUseCase = new DeleteAssetItemUseCase(assetItemRepository);

    /**
     * Controller
     */
    const assetItemController = new AssetItemController(
        createAssetItemUseCase,
        getAllAssetItemsUseCase,
        deleteAssetItemUseCase
    );

    router.post('/', (req, res) => assetItemController.create(req, res));
    router.get('/:assetId', (req, res) => assetItemController.getAllAssetItems(req, res));
    router.delete('/:id', (req, res) => assetItemController.delete(req, res));

    return router;
}