import { Asset } from "../../domain/model/Asset";
import { CreateAssetRequest } from "../use-case/asset/CreateAssetUseCase";
import { AssetAllResponse, AssetFilters } from "../use-case/asset/GetAllAssetUseCase";

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface IAssetRepository {
  create(input: CreateAssetRequest) : Promise<void>;
  findAll(filters?: AssetFilters): Promise<AssetAllResponse>;
  getById(id: number): Promise<Asset>;
}