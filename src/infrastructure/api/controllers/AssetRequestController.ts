import { Request, Response } from "express";
import { AssetRequestService } from "../../../application/services/asset-request.service";
import { ResponseUtil } from "../utils/Response";

export class AssetRequestController {
    constructor(
        private assetRequestService: AssetRequestService
    ) { }

    async createAssetRequest(req: Request, res: Response) {
        try {
            await this.assetRequestService.createAssetRequest(req.body);
            
            ResponseUtil.created(res, 'Asset request created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to create asset request', 500, error);
        }
    }

    async getAllRequests(_: Request, res: Response) {
        try {
            const requests = await this.assetRequestService.getAllAssetRequests();

            ResponseUtil.success(res, requests, ' Asset requests retrieved successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset requests', 500, error);
        }
    }

    async approveRequest(req: Request, res: Response) {
        try {
            const code = req.params.code?.toString();
            if (!code) {
                ResponseUtil.error(res, 'Request code is required', 400);
                return;
            }
            
            await this.assetRequestService.approveAssetRequest(code, req.body);

            ResponseUtil.success(res, null, 'Asset request approved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to approve asset request', 500, error);
        }
    }
}