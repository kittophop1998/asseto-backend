import { Router } from 'express';
import { createAssetRoutes } from './routers/asset.routes';
import { createAssetItemRoutes } from './routers/asset-item.routes';
import { createMasterDataRoutes } from './routers/master-data.routes';
import { createAssetRequestRoutes } from './routers/asset-request.routes';

export const router = Router();

router.use('/assets', createAssetRoutes());
router.use('/asset-items', createAssetItemRoutes());
router.use('/master-data', createMasterDataRoutes());
router.use('/asset-requests', createAssetRequestRoutes());