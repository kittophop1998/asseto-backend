import { Request, Response } from "express";
import { AssetFilters, AssetService } from "../../../application/services/asset.service";
import { ResponseUtil } from "../utils/Response";

export class AssetController {
    constructor(
        private assetService: AssetService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const asset = await this.assetService.createAsset(req.body);

            ResponseUtil.created(res, asset, 'Asset created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to create asset', 500);
        }
    }

    async getAll(req: Request, res: Response): Promise<void> {
        try {
            const filters: AssetFilters = {
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                categoryId: req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined,
                category: req.query.category as string | undefined,
                departmentId: req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined,
                department: req.query.department as string | undefined,
                status: req.query.status as string | undefined,
                search: req.query.search as string | undefined,
                sortBy: req.query.sortBy as string | undefined,
                sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
            };

            const assets = await this.assetService.getAllAssets(filters);

            ResponseUtil.successWithPagination(res, assets.data, assets.pagination, 'Assets retrieved successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to get assets', 500);
        }
    }

    async getById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            const asset = await this.assetService.getAssetById(id);

            ResponseUtil.success(res, asset, 'Asset retrieved successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to get asset by id', 500);
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            await this.assetService.updateAsset(id, req.body);

            ResponseUtil.success(res, null, 'Asset updated successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to update asset', 500);
        }
    }
}