import { Router } from 'express';
import { createAssetRoutes } from './routers/asset.routes';
import { createAssetItemRoutes } from './routers/asset-item.routes';
import { createMasterDataRoutes } from './routers/master-data.routes';
import { createAssetRequestRoutes } from './routers/asset-request.routes';
import { createDashboardRoutes } from './routers/dashboard.routes';
import { createAuthRoutes } from './routers/auth.routes';
import { createUserRoutes } from './routers/user.routes';

export const router = Router();

router.use('/auth', createAuthRoutes());
router.use('/assets', createAssetRoutes());
router.use('/asset-items', createAssetItemRoutes());
router.use('/master-data', createMasterDataRoutes());
router.use('/asset-requests', createAssetRequestRoutes());
router.use('/dashboard', createDashboardRoutes());
router.use('/users', createUserRoutes());