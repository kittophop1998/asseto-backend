import { IAssetRequestRepository } from "../../repository/IAssetRequestRepository";

export interface CreateAssetRequestInput {
    assetId: string;
    departmentId: string;
    quantity: number;
    requestedDate: Date;
    approverId: number;
}

export class CreateAssetRequestUseCase {
    constructor(
        private assetRequestRepository: IAssetRequestRepository
    ) { }

    async execute(data: CreateAssetRequestInput): Promise<any> {
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

    generateAssetRequestCode(prefix: string, lastNumber: number, length: number = 4): string {
        const nextNumber = lastNumber + 1;

        const paddedNumber = nextNumber
            .toString()
            .padStart(length, '0');

        return `${prefix}${paddedNumber}`;
    }
}