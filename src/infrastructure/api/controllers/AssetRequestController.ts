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
                assetItemCode: req.body.assetItemCode,
                departmentId: departmentId,
                location: Number(req.body.location) ?? 0,
                requesterId: userId
            };

            await this.assetRequestService.createAssetRequest(input, type);
            
            ResponseUtil.created(res, 'Asset request created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to create asset request', 500, error.message);
        }
    }

    async createAssetReturnRequest(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            if(!userId) {
                ResponseUtil.error(res, 'User not authenticated', 401);
                return;
            }
            const assetItemCode = req.body.assetItemCode;

            await this.assetRequestService.createAssetReturnRequest(userId, assetItemCode);

            ResponseUtil.created(res, 'Asset return request created successfully');
        }catch(error: any) {
            ResponseUtil.error(res, ' Failed to create asset return request', 500, error.message);
        }
    }

    async getAllRequests(req: Request, res: Response) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;

            const filter = {
                page,
                limit
            };
            const {data, totalItems} = await this.assetRequestService.getAllAssetRequests(filter);
            const pagination = {
                page: page,
                limit: limit,
                totalItems: totalItems,
                totalPages: Math.ceil(totalItems / limit)
            };

            ResponseUtil.successWithPagination(res, data, pagination, ' Asset requests retrieved successfully', 200);
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
                assetItemCode: req.body.assetItemCode ?? '',
                departmentId: Number(req.user?.department_id) ?? 0,
                location: req.body.location ?? '',
                requesterId: Number(req.user?.id) ?? 0
            };

            await this.assetRequestService.createAssetRequest(input, type);
            // ##### End Flow Create Request #####

            ResponseUtil.success(res, null, 'Asset return processed successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to process asset return', 500, error);
        }
    }

    async uploadRequestImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                ResponseUtil.error(res, 'No file uploaded', 400);
                return;
            }

            const requestCode = req.body.requestCode;
            if (!requestCode) {
                ResponseUtil.error(res, 'Request code is required', 400);
                return;
            }

            const file = req.file;
            
            const imageUrl = await this.assetRequestService.uploadRequestImage(file, requestCode);
            ResponseUtil.success(res, { imageUrl }, 'Request image uploaded successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, 'Failed to upload request image', 500, error.message);
        }
    }
}