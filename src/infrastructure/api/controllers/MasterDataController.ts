import { Request, Response } from "express";
import { MasterDataService } from "../../../application/services/master-data.service";
import { ResponseUtil } from "../utils/Response";

export class MasterDataController {
    constructor(
        private masterDataService: MasterDataService
    ) { }

    async getMasterData(_: Request, res: Response): Promise<void> {
        try {
            const masterData = await this.masterDataService.getMasterData();

            ResponseUtil.success(res, masterData, ' Master data retrieved successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to get master data', 500, 'GET_MASTER_DATA_FAILED');
        }
    }
}