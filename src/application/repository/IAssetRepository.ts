import { Asset } from "../../domain/model/Asset";
import { CreateAssetRequest } from "../services/asset.service";

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
  findAll(filters?: any): Promise<any>;
  getById(id: number): Promise<Asset>;
  update(id: number, input: CreateAssetRequest): Promise<void>;
}