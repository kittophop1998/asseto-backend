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
            ResponseUtil.error(res, error.message || 'Failed to create asset item', 500, 'CREATE_ASSET_ITEM_FAILED');
        }
    }

    async getAllAssetItems(req: Request, res: Response): Promise<void> {
        try {
            const assetId = Number(req.params.assetId);
            if (!assetId) {
                ResponseUtil.error(res, 'Asset ID is required', 400, 'ASSET_ID_REQUIRED');
                return;
            }

            const assetItems = await this.assetItemService.getAllAssetItems(assetId);

            ResponseUtil.success(res, assetItems, 'Asset items retrieved successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to retrieve asset items', 500, 'GET_ASSET_ITEMS_FAILED');
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);
            if (!id) {
                ResponseUtil.error(res, 'Asset item ID is required', 400, 'ASSET_ITEM_ID_REQUIRED');
                return;
            }

            await this.assetItemService.deleteAssetItem(id);

            ResponseUtil.success(res, null, 'Asset item deleted successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to delete asset item', 500, 'DELETE_ASSET_ITEM_FAILED');
        }
    }

    // async getAssetItemBySerialNumber(req: Request, res: Response): Promise<void> {
    //     try{
    //         const serialNumber = req.params.serialNumber?.toString();
    //         if (!serialNumber) {
    //             ResponseUtil.error(res, 'Serial number is required', 400);
    //             return;
    //         }

    //         const assetItem = await this.assetItemService.getAssetItemBySerialNumber(serialNumber); 
    //         ResponseUtil.success(res, assetItem, 'Asset item retrieved successfully');
    //     }catch(error: any){
    //         ResponseUtil.error(res, error.message || 'Failed to get asset item by serial number', 500);
    //     }
    // }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const assetCode = req.params?.id.toString();
            if (!assetCode) {
                ResponseUtil.error(res, 'Asset item ID is required', 400, 'ASSET_ITEM_ID_REQUIRED');
                return;
            }

            await this.assetItemService.update(assetCode, req.body);
            ResponseUtil.success(res, null, 'Asset item updated successfully');
        }   catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to update asset item', 500, 'UPDATE_ASSET_ITEM_FAILED');
        }     
    }

    async getAssetItemByAssetItemCode(req: Request, res: Response): Promise<void> {
        try {
            const assetItemCode = req.params.id?.toString();
            if (!assetItemCode) {
                ResponseUtil.error(res, 'Asset item code is required', 400, 'ASSET_ITEM_CODE_REQUIRED');
                return;
            }

            const assetItem = await this.assetItemService.getAssetItemByAssetItemCode(assetItemCode);
            ResponseUtil.success(res, assetItem, 'Asset item retrieved successfully');
        } catch (error: any) {
            ResponseUtil.error(res, error.message || 'Failed to get asset item by asset item code', 500, 'GET_ASSET_ITEM_BY_CODE_FAILED');
        }
    }
}