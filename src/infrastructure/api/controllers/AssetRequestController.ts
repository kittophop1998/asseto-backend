import { Request, Response } from "express";
import { GetAllAssetRequestUseCase } from "../../../application/use-case/asset-request/GetAllRequestUseCase";
import { ResponseUtil } from "../utils/Response";
import { CreateAssetRequestUseCase } from "../../../application/use-case/asset-request/CreateAssetRequestUseCase";
import { ApprovedAssetRequestUseCase } from "../../../application/use-case/asset-request/ApprovedAssetRequestUseCase";

export class AssetRequestController {
    constructor(
        private getAllAssetRequestUseCase: GetAllAssetRequestUseCase,
        private createAssetRequestUseCase: CreateAssetRequestUseCase,
        private approvedAssetRequestUseCase: ApprovedAssetRequestUseCase
    ) { }

    async createAssetRequest(req: Request, res: Response) {
        try {
            await this.createAssetRequestUseCase.execute(req.body);
            
            ResponseUtil.created(res, 'Asset request created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to create asset request', 500, error);
        }
    }

    async getAllRequests(_: Request, res: Response) {
        try {
            const requests = await this.getAllAssetRequestUseCase.execute();

            ResponseUtil.success(res, requests, ' Asset requests retrieved successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset requests', 500, error);
        }
    }

    async approveRequest(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            if (!id) {
                ResponseUtil.error(res, 'Request id is required', 400);
                return;
            }
            
            await this.approvedAssetRequestUseCase.execute(id, req.body);

            ResponseUtil.success(res, null, 'Asset request approved successfully', 200);
        }catch (error: any) {
            ResponseUtil.error(res, ' Failed to approve asset request', 500, error);
        }
    }
}