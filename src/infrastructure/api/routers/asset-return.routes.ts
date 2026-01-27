import { Router } from "express";
import { AssetReturnRepository } from "../../database/AssetReturnRepository";
import { GetAllAssetReturnUseCase } from "../../../application/use-case/asset-return/GetAllAssetReturnUseCase";
import { CreateAssetReturnUseCase } from "../../../application/use-case/asset-return/CreateAssetReturnUseCase";
import { AssetReturnController } from "../controllers/AssetReturnController";

export function createAssetReturnRoutes() {
    const router = Router();

    /**
     * Repository
     */
    const assetReturnRepository = new AssetReturnRepository();

    /**
     * Use Case
     */
    const getAllAssetReturnUseCase = new GetAllAssetReturnUseCase(assetReturnRepository);
    const createAssetReturnUseCase = new CreateAssetReturnUseCase(assetReturnRepository);

    /**
     * Controller
     */
    const assetReturnController = new AssetReturnController(
        createAssetReturnUseCase,
        getAllAssetReturnUseCase
    );

    /**
     * Routes
     */
    router.get('/', (req, res) => assetReturnController.getAllAssetReturn(req, res));
    router.post('/', (req, res) => assetReturnController.create(req, res));

    return router;
}