import s3 from "../../infrastructure/api/utils/s3";
import { IAssetItemRepository } from "../repository/IAssetItemRepositpry";
import { IAssetRequestRepository } from "../repository/IAssetRequestRepository";

export interface CreateAssetRequestInput {
    assetItemCode: string;
    departmentId: number;
    requesterId: number;
}

export class AssetRequestService {
    constructor(
        private assetRequestRepository: IAssetRequestRepository,
        private assetItemRepository: IAssetItemRepository
    ) { }

    async createAssetRequest(data: CreateAssetRequestInput, type: string): Promise<any> {
        const existingItem = await this.assetItemRepository.getItemByAssetItemCode(data.assetItemCode);
        if (!existingItem) {
            throw new Error('Asset item not found');
        }

        const existingRequest = await this.assetRequestRepository.getPendingRequestByAssetItemCodeAndRequesterId(data.assetItemCode, data.requesterId);
        if (existingRequest) {
            throw new Error('There is already a pending request for this asset by the same requester');
        }

        const lastCode = await this.assetRequestRepository.getLastRequestCode();
        const code = this.generateAssetRequestCode('AR-', lastCode ? parseInt(lastCode.replace('AR-', '')) : 0);

        const input = {
            ...data,
            status: 'PENDING',
            code: code,
            type: type.toLocaleUpperCase()
        };
        const request = await this.assetRequestRepository.create(input);

        if (type === 'REQUEST') {
            await this.assetRequestRepository.createAssetUser(
                data.requesterId,
                data.assetItemCode,
                data.departmentId,
                'PENDING'
            );
        }

        return request;
    }

    async processReturn(assetUserId: number): Promise<void> {
        await this.assetRequestRepository.updateAssetUserById(assetUserId, 'PENDING_RETURN');
    }

    async getAllAssetRequests(): Promise<any> {
        const requests = await this.assetRequestRepository.getAllRequest();
        const requestsWithImages = await Promise.all(
            requests.map(async (request: any) => {
                if (request.imageUrl) {
                    try {
                        const signedUrl = await s3.getSignedDownloadUrl({
                            key: request.imageUrl,
                            expiresIn: 3600,
                        });
                        return {
                            ...request,
                            imageUrl: signedUrl.url,
                        };
                    } catch (error) {
                        console.error(`Error generating signed URL for ${request.imageUrl}:`, error);
                        return request;
                    }
                }
                return request;
            })
        );

        return requestsWithImages;
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

        const assetItem = await this.assetItemRepository.getItemByAssetItemCode(request.asset_item_code);
        if (!assetItem || !assetItem.id) {
            throw new Error('Asset item not found');
        }

        if (type === 'REQUEST') {
            await this.assetRequestRepository.updateAssetUserStatus(request.requester_id, request.serial_number, 'APPROVED');
            await this.assetItemRepository.updateAssetItem(assetItem.id.toString(), {status: 'IN_USE'});
            await this.assetRequestRepository.updateAssetUserStatus(request.requester_id, request.serial_number, 'APPROVED');
            await this.assetRequestRepository.updateStatus(code, 'APPROVED');
        } else if (type === 'RETURN') {
            await this.assetRequestRepository.updateAssetUserReturnDate(request.requester_id, request.serial_number);
            await this.assetItemRepository.updateAssetItem(assetItem.id.toString(), {status: 'AVAILABLE'});
            await this.assetRequestRepository.updateAssetUserStatus(request.requester_id, request.serial_number, 'RETURNED');
            await this.assetRequestRepository.updateStatus(code, 'APPROVED');
        }
    }

    async rejectAssetRequest(code: string): Promise<void> {
        const request = await this.assetRequestRepository.getRequestByCode(code);
        if (!request) {
            throw new Error('Asset request not found');
        }

        const assetItem = await this.assetItemRepository.getItemByAssetItemCode(request.asset_item_code);
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

    async uploadRequestImage(file: Express.Multer.File, requestCode: string): Promise<string> {
        const result = await s3.uploadFromMultipart(file, 'asset-requests');

        if (!result.success) {
            throw new Error('Failed to upload image to S3');
        }

        const imageUrl = result.key;

        await this.assetRequestRepository.update({ requestCode, imageUrl });

        return imageUrl;
    }
}
