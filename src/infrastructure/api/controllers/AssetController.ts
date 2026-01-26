import { Request, Response } from "express";
import { AssetFilters, GetAllAssetsUseCase } from "../../../application/use-case/asset/GetAllAssetUseCase";
import { ResponseUtil } from "../utils/Response";
import { CreateAssetUseCase } from "../../../application/use-case/asset/CreateAssetUseCase";

export class AssetController {
    constructor(
        private getAllAssetsUseCase: GetAllAssetsUseCase,
        private createAssetUseCase: CreateAssetUseCase
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            const asset = await this.createAssetUseCase.execute(req.body);

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

            const assets = await this.getAllAssetsUseCase.execute(filters);

            ResponseUtil.successWithPagination(res, assets.data, assets.pagination, 'Assets retrieved successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to get assets', 500);
        }
    }
}