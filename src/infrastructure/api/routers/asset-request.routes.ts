import { Router } from 'express';
import { AssetRequestRepository } from '../../database/AssetRequestRepository';
import { GetAllAssetRequestUseCase } from '../../../application/use-case/asset-request/GetAllRequestUseCase';
import { AssetRequestController } from '../controllers/AssetRequestController';
import { CreateAssetRequestUseCase } from '../../../application/use-case/asset-request/CreateAssetRequestUseCase';
import { ApprovedAssetRequestUseCase } from '../../../application/use-case/asset-request/ApprovedAssetRequestUseCase';
import { AssetItemRepository } from '../../database/AssetItemRepository';

export function createAssetRequestRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetRequestRepository = new AssetRequestRepository();
    const assetItemRepository = new AssetItemRepository();

    /**
     * Use Case
     */
    const getAllAssetRequestUseCase = new GetAllAssetRequestUseCase(assetRequestRepository);
    const createAssetRequestUseCase = new CreateAssetRequestUseCase(assetRequestRepository);
    const approvedAssetRequestUseCase = new ApprovedAssetRequestUseCase(assetRequestRepository, assetItemRepository);

    /**
     * Controller
     */
    const assetRequestController = new AssetRequestController(
        getAllAssetRequestUseCase,
        createAssetRequestUseCase,
        approvedAssetRequestUseCase
    );

    /**
     * Routes
     */
    router.put('/:id/approve', (req, res) => assetRequestController.approveRequest(req, res));
    router.get('/', (req, res) => assetRequestController.getAllRequests(req, res));
    router.post('/', (req, res) => assetRequestController.createAssetRequest(req, res));

    return router;
}