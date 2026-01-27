import { IAssetReturnRepository } from "../../repository/IAssetReturnRepository";

export interface CreateAssetReturnRequest {
    assetRequestCode: string;
    notes?: string;
}

export class CreateAssetReturnUseCase {
    constructor(
        private assetReturnRepository: IAssetReturnRepository
    ) {}

    async execute(input: CreateAssetReturnRequest): Promise<void> {
        await this.assetReturnRepository.create(input);
    }
}