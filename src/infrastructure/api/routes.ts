import { Router } from 'express';
import { createAssetRoutes } from './routers/asset.routes';

export const router = Router();

router.use('/assets', createAssetRoutes());