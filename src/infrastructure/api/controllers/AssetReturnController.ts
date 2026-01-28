import { Request, Response } from "express";
import { AssetReturnService } from "../../../application/services/asset-return.service";
import { ResponseUtil } from "../utils/Response";

export class AssetReturnController {
    constructor(
        private assetReturnService: AssetReturnService
    ) { }

    async create(req: Request, res: Response) {
        try {
            await this.assetReturnService.createAssetReturn(req.body);

            ResponseUtil.created(res, 'Asset return created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to create asset return', 500, error);
        }
    }

    async getAllAssetReturn(_: Request, res: Response) {
        try {
            const assetReturns = await this.assetReturnService.getAllAssetReturns();

            ResponseUtil.success(res, assetReturns, ' Asset returns retrieved successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset returns', 500, error);
        }
    }

    async getAssetReturnByCode(req: Request, res: Response) {
        try {
            const code = req.params.code?.toString();
            const assetReturn = await this.assetReturnService.getAssetReturnByCode(code);

            ResponseUtil.success(res, assetReturn, ' Asset return retrieved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset return by code', 500, error);
        }
    }

    async deleteAssetReturnByCode(req: Request, res: Response) {
        try {
            const code = req.params.code?.toString();
            await this.assetReturnService.deleteAssetReturn(code);

            ResponseUtil.success(res, null, ' Asset return deleted successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to delete asset return by code', 500, error);
        }
    }

    async approveAssetReturnByCode(req: Request, res: Response) {
        try {
            const code = req.params.code?.toString();
            await this.assetReturnService.approveAssetReturn(code);

            ResponseUtil.success(res, null, ' Asset return approved successfully', 200);
        }catch (error: any) {   
            ResponseUtil.error(res, ' Failed to approve asset return by code', 500, error);
        }
    }
}