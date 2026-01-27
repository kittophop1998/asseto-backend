import { IAssetItemRepository } from "../../repository/IAssetItemRepositpry";
import { IAssetRequestRepository } from "../../repository/IAssetRequestRepository";

export class ApprovedAssetRequestUseCase {
    constructor(
        private assetRequestRepository: IAssetRequestRepository,
        private assetItemRepository: IAssetItemRepository
    ) {}

    async execute(id: number, requestBody: any): Promise<void> {
        const serialNumbers = requestBody.serialNumbers.map((item: any) => item);
        const assetItems = await this.assetItemRepository.getItemBySerialNumber(serialNumbers);

        if (!assetItems || assetItems.length === 0) {
            throw new Error('No asset items found with the provided serial numbers');
        }

        if (assetItems.length !== serialNumbers.length) {
            throw new Error('Some serial numbers not found in the system');
        }

        // ดึง asset_item_id ทั้งหมด
        const assetItemIds = assetItems.map((item: any) => item.id);

        // อัปเดตสถานะของ asset items เป็น IN_USE
        await this.assetItemRepository.updateStatusByIds(assetItemIds, 'IN_USE');

        // บันทึกลงใน asset_request_item table
        await this.assetRequestRepository.updateRequestItem(id, assetItemIds);
        
        // อัปเดตสถานะเป็น APPROVED
        await this.assetRequestRepository.updateStatus(id, 'APPROVED');
    }
}