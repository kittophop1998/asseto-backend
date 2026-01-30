import { Router } from 'express';
import { AssetRequestRepository } from '../../database/AssetRequestRepository';
import { AssetRequestService } from '../../../application/services/asset-request.service';
import { AssetRequestController } from '../controllers/AssetRequestController';
import { AssetItemRepository } from '../../database/AssetItemRepository';
import { authMiddleware } from '../middlewares/authMiddleware';

export function createAssetRequestRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetRequestRepository = new AssetRequestRepository();
    const assetItemRepository = new AssetItemRepository();

    /**
     * Service
     */
    const assetRequestService = new AssetRequestService(assetRequestRepository, assetItemRepository);

    /**
     * Controller
     */
    const assetRequestController = new AssetRequestController(assetRequestService);

    /**
     * Routes
     */
    router.get('/my-requests', authMiddleware, (req, res) => assetRequestController.getMyAssetFormRequest(req, res));
    router.put('/:code/approve', (req, res) => assetRequestController.approveRequest(req, res));
    router.put('/:code/reject', (req, res) => assetRequestController.rejectRequest(req, res));
    router.put('/return', authMiddleware, (req, res) => assetRequestController.returnAssetByUserId(req, res));
    router.get('/', (req, res) => assetRequestController.getAllRequests(req, res));
    router.post('/', authMiddleware, (req, res) => assetRequestController.createAssetRequest(req, res));

    return router;
}