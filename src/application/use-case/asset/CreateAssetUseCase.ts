import { AssetStatusType } from "../../../domain/model/Asset";
import { IAssetRepository } from "../../repository/IAssetRepository";

export interface CreateAssetRequest {
  code: string;
  name: string;
  categoryId: number;
  description: string;
  unit: string;
  totalQuantity: number;
  availableQuantity: number;
  minimumQty: number;
  status: AssetStatusType;
  departmentId: number;
}

export class CreateAssetUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(input: CreateAssetRequest): Promise<void> {
    return await this.assetRepository.create(input);
  }
}
