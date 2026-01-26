import { Request, Response } from "express";
import { GetMasterDataUseCase } from "../../../application/use-case/master-data/GetMasterDataUseCase";
import { ResponseUtil } from "../utils/Response";

export class MasterDataController {
    constructor(
        private getMasterDataUseCase: GetMasterDataUseCase
    ) { }

    async getMasterData(_: Request, res: Response): Promise<void> {
        try {
            const masterData = await this.getMasterDataUseCase.execute();

            ResponseUtil.success(res, masterData, ' Master data retrieved successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to get master data', 500, error);
        }
    }
}