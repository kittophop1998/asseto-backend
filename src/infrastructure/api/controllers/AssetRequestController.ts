import { Request, Response } from "express";
import { AssetRequestService } from "../../../application/services/asset-request.service";
import { ResponseUtil } from "../utils/Response";

export class AssetRequestController {
    constructor(
        private assetRequestService: AssetRequestService
    ) { }

    async createAssetRequest(req: Request, res: Response) {
        try {
            const location = Number(req.body.locationId) ?? 0;
            const assetItemCode = req.body.assetItemCode.toString();
            const userId = Number(req.user?.id);
            const departmentId = Number(req.user?.department_id) ?? 0;
            const quantity = Number(req.body.quantity) ?? 1;
            
            const input = {
                assetItemCode: assetItemCode,
                departmentId: departmentId,
                quantity: quantity,
                location: location,
                requesterId: userId
            };

            await this.assetRequestService.createAssetRequest(input);
            
            ResponseUtil.created(res, 'Asset request created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to create asset request', 500, 'CREATE_ASSET_REQUEST_FAILED');
        }
    }

    async createAssetReturnRequest(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            if(!userId) {
                ResponseUtil.error(res, 'User not authenticated', 401, 'USER_NOT_AUTHENTICATED');
                return;
            }
            const assetItemCode = req.body.assetItemCode;
            const input = {
                assetItemCode: assetItemCode,
                requesterId: userId
            };

            await this.assetRequestService.createAssetReturnRequest(input);

            ResponseUtil.created(res, 'Asset return request created successfully');
        }catch(error: any) {
            ResponseUtil.error(res, error.message || 'Failed to create asset return request', 500, 'CREATE_ASSET_RETURN_REQUEST_FAILED');
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
            ResponseUtil.error(res, error.message || 'Failed to get asset requests', 500, 'GET_ASSET_REQUESTS_FAILED');
        }
    }

    async getMyAssetFormRequest(req: Request, res: Response) {
        try {
            const userId = req.user?.id;
            if(!userId) {
                ResponseUtil.error(res, 'User not authenticated', 401, 'USER_NOT_AUTHENTICATED');
                return;
            }

            const myAssets = await this.assetRequestService.getMyAssetFormRequest(userId);
            
            ResponseUtil.success(res, myAssets, ' My asset form request retrieved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to get my asset form request', 500, 'GET_MY_ASSET_FORM_REQUEST_FAILED');
        }
    }

    async approveRequest(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            const code = req.params.code?.toString();
            if (!code) {
                ResponseUtil.error(res, 'Request code is required', 400, 'REQUEST_CODE_REQUIRED');
                return;
            }

            const type = req.query.type?.toString();
            if (!type) {
                ResponseUtil.error(res, 'Request type is required', 400, 'REQUEST_TYPE_REQUIRED');
                return;
            }
            
            await this.assetRequestService.approveAssetRequest(userId, code, type);

            ResponseUtil.success(res, null, 'Asset request approved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to approve asset request', 500, 'APPROVE_ASSET_REQUEST_FAILED');
        }
    }

    async rejectRequest(req: Request, res: Response) {
        try {
            const userId = Number(req.user?.id);
            const code = req.params.code?.toString();
            if (!code) {
                ResponseUtil.error(res, 'Request code is required', 400, 'REQUEST_CODE_REQUIRED');
                return;
            }
            
            await this.assetRequestService.rejectAssetRequest(userId, code);

            ResponseUtil.success(res, null, 'Asset request rejected successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to reject asset request', 500, 'REJECT_ASSET_REQUEST_FAILED');
        }
    }

    async uploadRequestImage(req: Request, res: Response) {
        try {
            if (!req.file) {
                ResponseUtil.error(res, 'No file uploaded', 400, 'NO_FILE_UPLOADED');
                return;
            }

            const requestCode = req.body.requestCode;
            if (!requestCode) {
                ResponseUtil.error(res, 'Request code is required', 400, 'REQUEST_CODE_REQUIRED');
                return;
            }

            const file = req.file;
            
            const imageUrl = await this.assetRequestService.uploadRequestImage(file, requestCode);
            ResponseUtil.success(res, { imageUrl }, 'Request image uploaded successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to upload request image', 500, 'UPLOAD_REQUEST_IMAGE_FAILED');
        }
    }
}