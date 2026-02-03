import { Request, Response } from "express";
import { AssetRequestService } from "../../../application/services/asset-request.service";
import { ResponseUtil } from "../utils/Response";

export class AssetRequestController {
    constructor(
        private assetRequestService: AssetRequestService
    ) { }

    async createAssetRequest(req: Request, res: Response) {
        try {
            const type = req.query.type?.toString();
            if (!type) {
                ResponseUtil.error(res, 'Request type is required', 400);
                return;
            }

            const departmentId = Number(req.user?.department_id);
            const userId = Number(req.user?.id);
            if(!userId) {
                ResponseUtil.error(res, 'User not authenticated', 401);
                return;
            }
            
            const input = {
                serialNumber: req.body.serialNumber,
                departmentId: departmentId,
                requesterId: userId
            };

            await this.assetRequestService.createAssetRequest(input, type);
            
            ResponseUtil.created(res, 'Asset request created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to create asset request', 500, error.message);
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

    async getMyAssetFormRequest(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if(!userId) {
                ResponseUtil.error(res, 'User not authenticated', 401);
                return;
            }

            const myAssets = await this.assetRequestService.getMyAssetFormRequest(userId);
            
            ResponseUtil.success(res, myAssets, ' My asset form request retrieved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to get my asset form request', 500, error);
        }
    }

    async approveRequest(req: Request, res: Response) {
        try {
            const code = req.params.code?.toString();
            if (!code) {
                ResponseUtil.error(res, 'Request code is required', 400);
                return;
            }

            const type = req.query.type?.toString();
            if (!type) {
                ResponseUtil.error(res, 'Request type is required', 400);
                return;
            }
            
            await this.assetRequestService.approveAssetRequest(code, type);

            ResponseUtil.success(res, null, 'Asset request approved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to approve asset request', 500, error);
        }
    }

    async rejectRequest(req: Request, res: Response) {
        try {
            const code = req.params.code?.toString();
            if (!code) {
                ResponseUtil.error(res, 'Request code is required', 400);
                return;
            }
            
            await this.assetRequestService.rejectAssetRequest(code);

            ResponseUtil.success(res, null, 'Asset request rejected successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to reject asset request', 500, error);
        }
    }

    async returnAssetByUserId(req: Request, res: Response) {
        try {
            const assetUserId = Number(req.query.id);
            if (!assetUserId) {
                ResponseUtil.error(res, 'Request code is required', 400);
                return;
            }

            await this.assetRequestService.processReturn(assetUserId);

            // ##### Flow Create Request ##### 
            const type = req.query.type?.toString().toLocaleUpperCase();
            if (!type) {
                ResponseUtil.error(res, 'Request type is required', 400);
                return;
            }

            const input = {
                serialNumber: req.body.serialNumber ?? '',
                departmentId: Number(req.user?.department_id) ?? 0,
                requesterId: Number(req.user?.id) ?? 0
            };

            await this.assetRequestService.createAssetRequest(input, type);
            // ##### End Flow Create Request #####

            ResponseUtil.success(res, null, 'Asset return processed successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to process asset return', 500, error);
        }
    }
}