import { Router } from 'express';
import { AssetRequestRepository } from '../../database/AssetRequestRepository';
import { GetAllAssetRequestUseCase } from '../../../application/use-case/asset-request/GetAllRequestUseCase';
import { AssetRequestController } from '../controllers/AssetRequestController';
import { CreateAssetRequestUseCase } from '../../../application/use-case/asset-request/CreateAssetRequestUseCase';

export function createAssetRequestRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetRequestRepository = new AssetRequestRepository();

    /**
     * Use Case
     */
    const getAllAssetRequestUseCase = new GetAllAssetRequestUseCase(assetRequestRepository);
    const createAssetRequestUseCase = new CreateAssetRequestUseCase(assetRequestRepository);

    /**
     * Controller
     */
    const assetRequestController = new AssetRequestController(
        getAllAssetRequestUseCase,
        createAssetRequestUseCase
    );

    /**
     * Routes
     */
    router.get('/', (req, res) => assetRequestController.getAllRequests(req, res));
    router.post('/', (req, res) => assetRequestController.createAssetRequest(req, res));

    return router;
}