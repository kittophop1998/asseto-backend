import { CreateAssetReturnRequest } from "../use-case/asset-return/CreateAssetReturnUseCase";

export interface IAssetReturnRepository {
    create(input: CreateAssetReturnRequest): Promise<void>;
    getAllAssetReturns(): Promise<any[]>
}