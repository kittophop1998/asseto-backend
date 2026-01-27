import { Request, Response } from "express";
import { CreateAssetReturnUseCase } from "../../../application/use-case/asset-return/CreateAssetReturnUseCase";
import { GetAllAssetReturnUseCase } from "../../../application/use-case/asset-return/GetAllAssetReturnUseCase";
import { ResponseUtil } from "../utils/Response";

export class AssetReturnController {
    constructor(
        private createAssetReturnUseCase: CreateAssetReturnUseCase,
        private getAllAssetReturnUseCase: GetAllAssetReturnUseCase,
    ) { }

    async create(req: Request, res: Response) {
        try {
            await this.createAssetReturnUseCase.execute(req.body);

            ResponseUtil.created(res, 'Asset return created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to create asset return', 500, error);
        }
    }

    async getAllAssetReturn(_: Request, res: Response) {
        try {
            const assetReturns = await this.getAllAssetReturnUseCase.execute();

            ResponseUtil.success(res, assetReturns, ' Asset returns retrieved successfully', 200);
        } catch (error: any) {
            ResponseUtil.error(res, ' Failed to get asset returns', 500, error);
        }
    }
}