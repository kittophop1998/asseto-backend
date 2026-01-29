import { Asset, AssetStatusType } from "../../domain/model/Asset";
import { IAssetRepository, PaginatedResult } from "../repository/IAssetRepository";

export interface AssetFilters {
  categoryId?: number;
  category?: string;
  departmentId?: number;
  department?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateAssetRequest {
  code: string;
  name: string;
  categoryId: number;
  description: string;
  minimumQty: number;
  departmentId: number;
}

export class AssetService {
  constructor(private assetRepository: IAssetRepository) {}

  async createAsset(input: CreateAssetRequest): Promise<void> {
    return await this.assetRepository.create(input);
  }

  async getAllAssets(filters?: AssetFilters): Promise<PaginatedResult<Asset>> {
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

  async getAssetById(id: number): Promise<Asset> {
    return this.assetRepository.getById(id);
  }

  async updateAsset(id: number, input: CreateAssetRequest): Promise<void> {
    await this.assetRepository.update(id, input);
  }
}
