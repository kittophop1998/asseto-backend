export interface AssetItemProps {
    id?: number;
    assetId: number;
    serialNumber: string;
    status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE' | 'RETIRED';
    purchaseDate: Date;
    warrantyEnd: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

export class AssetItem {
    private constructor(
        public readonly id: number | undefined,
        public readonly assetId: number,
        public readonly serialNumber: string,
        public readonly status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE' | 'RETIRED',
        public readonly purchaseDate: Date,
        public readonly warrantyEnd: Date,
        public readonly createdAt: Date | undefined,
        public readonly updatedAt: Date | undefined
    ) { }

    static create(props: AssetItemProps): AssetItem {
        return new AssetItem(
            props.id,
            props.assetId,
            props.serialNumber,
            props.status,
            props.purchaseDate,
            props.warrantyEnd,
            props.createdAt,
            props.updatedAt
        );
    }

    toJSON(): any {
        return {
            id: this.id,
            assetId: this.assetId,
            serialNumber: this.serialNumber,
            status: this.status,
            purchaseDate: this.purchaseDate,
            warrantyEnd: this.warrantyEnd,
            createdAt: this.createdAt?.toISOString(),
            updatedAt: this.updatedAt?.toISOString()
        };
    }
}