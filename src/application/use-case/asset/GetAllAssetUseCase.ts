import { Asset } from "../../../domain/model/Asset";
import { AssetFilters, IAssetRepository, PaginatedResult } from "../../repository/IAssetRepository";

export class GetAllAssetsUseCase {
  constructor(private assetRepository: IAssetRepository) {}

  async execute(filters?: AssetFilters): Promise<PaginatedResult<Asset>> {
    const assets = await this.assetRepository.findAll(filters);

    // Prepare pagination metadata
    const pagination = {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      totalItems: assets.totalItems,
      totalPages: Math.ceil(assets.totalItems / (filters?.limit || 10)),
    };

    return {
      data: assets.data,
      pagination,
    };
  }
}
