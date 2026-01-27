import { IAssetReturnRepository } from "../../repository/IAssetReturnRepository";

export interface CreateAssetReturnRequest {
    assetRequestCode: string;
    notes?: string;
}

export class CreateAssetReturnUseCase {
    constructor(
        private assetReturnRepository: IAssetReturnRepository
    ) {}

    async execute(data: CreateAssetReturnRequest): Promise<void> {
        const lastCode = await this.assetReturnRepository.getLastReturnCode();
        const code = this.generateAssetRequestCode('ART-', lastCode ? parseInt(lastCode.replace('ART-', '')) : 0);
        
        const input = {
            ...data,
            code: code,
        };
        await this.assetReturnRepository.create(input);
    }

    generateAssetRequestCode(prefix: string, lastNumber: number, length: number = 4): string {
        const nextNumber = lastNumber + 1;

        const paddedNumber = nextNumber
            .toString()
            .padStart(length, '0');

        return `${prefix}${paddedNumber}`;
    }
}