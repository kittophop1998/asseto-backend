import { IAssetItemRepository } from "../repository/IAssetItemRepositpry";
import { IAssetRequestRepository } from "../repository/IAssetRequestRepository";

export interface CreateAssetRequestInput {
    serialNumber: string;
    departmentId: number;
    requesterId: number;
}

export class AssetRequestService {
    constructor(
        private assetRequestRepository: IAssetRequestRepository,
        private assetItemRepository: IAssetItemRepository
    ) { }

    async createAssetRequest(data: CreateAssetRequestInput, type: string): Promise<any> {
        const lastCode = await this.assetRequestRepository.getLastRequestCode();
        const code = this.generateAssetRequestCode('AR-', lastCode ? parseInt(lastCode.replace('AR-', '')) : 0);

        const input = {
            ...data,
            status: 'PENDING',
            code: code,
            type: type
        };
        const request = await this.assetRequestRepository.create(input);

        return request;
    }

    async getAllAssetRequests(): Promise<any> {
        const requests = await this.assetRequestRepository.getAllRequest();
        return requests;
    }

    async getMyAssetFormRequest(id: number): Promise<any> {
        const requests = await this.assetRequestRepository.getMyAsset(id);
        return requests;
    }

    async approveAssetRequest(code: string, type: string): Promise<void> {
        const request = await this.assetRequestRepository.getRequestByCode(code);
        if (!request) {
            throw new Error('Asset request not found');
        }

        const assetItem = await this.assetItemRepository.getItemBySerialNumber(request.serial_number);
        if (!assetItem || !assetItem.id) {
            throw new Error('Asset item not found');
        }

        if (type === 'REQUEST') {
            await this.assetRequestRepository.createAssetUser(request.requester_id, request.serial_number, request.department_id);
            await this.assetItemRepository.updateStatusAfterApproved([assetItem.id], 'IN_USE');
            await this.assetRequestRepository.updateStatus(code, 'APPROVED');
        } else if (type === 'RETURN') {
            await this.assetRequestRepository.updateAssetUserReturnDate(request.requester_id, request.serial_number);
            await this.assetItemRepository.updateStatusAfterApproved([assetItem.id], 'AVAILABLE');
            await this.assetRequestRepository.updateStatus(code, 'APPROVED');
        }
    }

    async rejectAssetRequest(code: string): Promise<void> {
        const request = await this.assetRequestRepository.getRequestByCode(code);
        if (!request) {
            throw new Error('Asset request not found');
        }

        const assetItem = await this.assetItemRepository.getItemBySerialNumber(request.serial_number);
        if (!assetItem || !assetItem.id) {
            throw new Error('Asset item not found');
        }
        
        await this.assetRequestRepository.updateStatus(code, 'REJECTED');
    }

    private generateAssetRequestCode(prefix: string, lastNumber: number, length: number = 4): string {
        const nextNumber = lastNumber + 1;

        const paddedNumber = nextNumber
            .toString()
            .padStart(length, '0');

        return `${prefix}${paddedNumber}`;
    }
}
