import { IAssetReturnRepository } from "../repository/IAssetReturnRepository";

export interface CreateAssetReturnRequest {
    assetRequestCode: string;
    notes?: string;
}

export class AssetReturnService {
    constructor(
        private assetReturnRepository: IAssetReturnRepository
    ) {}

    async createAssetReturn(data: CreateAssetReturnRequest): Promise<void> {
        const lastCode = await this.assetReturnRepository.getLastReturnCode();
        const code = this.generateAssetReturnCode('ART-', lastCode ? parseInt(lastCode.replace('ART-', '')) : 0);
        
        const input = {
            ...data,
            code: code,
        };
        await this.assetReturnRepository.create(input);
    }

    async getAllAssetReturns(): Promise<any[]> {
        return await this.assetReturnRepository.getAllAssetReturns();
    }

    async getAssetReturnByCode(code: string): Promise<any | null> {
        return this.assetReturnRepository.getAssetReturnByCode(code);
    }

    async approveAssetReturn(code: string): Promise<void> {
        await this.assetReturnRepository.approveByCode(code);
    }

    async deleteAssetReturn(code: string): Promise<void> {
        return this.assetReturnRepository.deleteByCode(code);
    }

    private generateAssetReturnCode(prefix: string, lastNumber: number, length: number = 4): string {
        const nextNumber = lastNumber + 1;

        const paddedNumber = nextNumber
            .toString()
            .padStart(length, '0');

        return `${prefix}${paddedNumber}`;
    }
}
