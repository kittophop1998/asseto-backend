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

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface AssetAllResponse {
    data: any[];
    totalItems: number;
}

export interface IAssetRepository {
    findAll(filters?: AssetFilters): Promise<AssetAllResponse>;
}