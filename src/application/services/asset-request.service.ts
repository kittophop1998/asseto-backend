import { IAssetItemRepository } from "../repository/IAssetItemRepositpry";
import { IAssetRequestRepository } from "../repository/IAssetRequestRepository";

export interface CreateAssetRequestInput {
    serialNumber: string;
    departmentId: string;
}

export class AssetRequestService {
    constructor(
        private assetRequestRepository: IAssetRequestRepository,
        private assetItemRepository: IAssetItemRepository
    ) { }

    async createAssetRequest(data: CreateAssetRequestInput): Promise<any> {
        const lastCode = await this.assetRequestRepository.getLastRequestCode();
        const code = this.generateAssetRequestCode('AR-', lastCode ? parseInt(lastCode.replace('AR-', '')) : 0);
        
        const input = {
            ...data,
            status: 'PENDING',
            code: code
        };
        const request = await this.assetRequestRepository.create(input);

        return request;
    }

    async getAllAssetRequests(): Promise<any> {
        const requests = await this.assetRequestRepository.getAllRequest();
        return requests;
    }

    async approveAssetRequest(code: string, requestBody: any): Promise<void> {
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
        await this.assetRequestRepository.updateRequestItem(code, assetItemIds);
        
        // อัปเดตสถานะเป็น APPROVED
        await this.assetRequestRepository.updateStatus(code, 'APPROVED');
    }

    private generateAssetRequestCode(prefix: string, lastNumber: number, length: number = 4): string {
        const nextNumber = lastNumber + 1;

        const paddedNumber = nextNumber
            .toString()
            .padStart(length, '0');

        return `${prefix}${paddedNumber}`;
    }
}
