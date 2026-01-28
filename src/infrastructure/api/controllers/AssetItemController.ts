import { Request, Response } from "express";
import { ResponseUtil } from "../utils/Response";
import { AssetItemService } from "../../../application/services/asset-item.service";

export class AssetItemController {
    constructor(
        private assetItemService: AssetItemService
    ) { }

    async create(req: Request, res: Response): Promise<void> {
        try {
            await this.assetItemService.createAssetItem(req.body);

            ResponseUtil.created(res, 'Asset item created successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to create asset item', 500);
        }
    }

    async getAllAssetItems(req: Request, res: Response): Promise<void> {
        try {
            const assetId = Number(req.params.assetId);
            if (!assetId) {
                ResponseUtil.error(res, 'Asset ID is required', 400);
                return;
            }

            const assetItems = await this.assetItemService.getAllAssetItems(assetId);

            ResponseUtil.success(res, assetItems, 'Asset items retrieved successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to retrieve asset items', 500);
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                ResponseUtil.error(res, 'Asset item ID is required', 400);
                return;
            }

            await this.assetItemService.deleteAssetItem(id);

            ResponseUtil.success(res, null, 'Asset item deleted successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to delete asset item', 500);
        }
    }
}