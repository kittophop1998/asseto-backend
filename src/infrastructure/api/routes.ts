import { Router } from 'express';
import { createAssetRoutes } from './routers/asset.routes';
import { createAssetItemRoutes } from './routers/asset-item.routes';

export const router = Router();

router.use('/assets', createAssetRoutes());
router.use('/asset-items', createAssetItemRoutes());