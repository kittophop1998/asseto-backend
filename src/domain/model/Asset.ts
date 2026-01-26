
export type AssetStatusType = 'ACTIVE' | 'INACTIVE' | 'IN_USE' | 'LOW_STOCK';

export interface AssetProps {
  id?: number;
  code: string;
  name: string;
  category?: string;
  categoryId: number;
  description: string;
  unit: string;
  totalQuantity: number;
  availableQuantity: number;
  departmentId: number;
  departmentName?: string;
  minimumQty: number;
  status: AssetStatusType;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Asset {
  private constructor(
    public readonly id: number | undefined,
    public readonly code: string,
    public readonly name: string,
    public readonly category: string | undefined,
    public readonly categoryId: number,
    public readonly description: string | undefined,
    public readonly unit: string,
    public readonly totalQuantity: number,
    public readonly availableQuantity: number,
    public readonly departmentId: number,
    public readonly departmentName: string | undefined,
    public readonly minimumQty: number,
    public readonly status: AssetStatusType,
    public readonly createdAt: Date | undefined,
    public readonly updatedAt: Date | undefined
  ) {}

  static create(props: AssetProps): Asset {
    return new Asset(
      props.id,
      props.code,
      props.name,
      props.category,
      props.categoryId,
      props.description,
      props.unit,
      props.totalQuantity,
      props.availableQuantity,
      props.departmentId,
      props.departmentName,
      props.minimumQty,
      props.status,
      props.createdAt,
      props.updatedAt
    );
  }

  toJSON(): any {
    return {
      id: this.id?.toString(),
      code: this.code,
      name: this.name,
      category: this.category,
      categoryId: this.categoryId,
      description: this.description,
      unit: this.unit,
      totalQuantity: this.totalQuantity,
      availableQuantity: this.availableQuantity,
      departmentId: this.departmentId.toString(),
      departmentName: this.departmentName,
      minimumQty: this.minimumQty,
      status: this.status,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString()
    };
  }
}
