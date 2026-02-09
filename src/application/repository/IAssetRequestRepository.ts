export interface IAssetRequestRepository {
    getAllRequest(filter?: any): Promise<any>;
    create(input: any): Promise<any>;
    getLastRequestCode(): Promise<string | null>;
    updateStatus(
        code: string,
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED'
    ): Promise<void>;
    getListRequestDetail(): Promise<any>;
    getMyAsset(id: number): Promise<any>;
    getRequestByCode(code: string): Promise<any>;
    getRequestByAssetItemCode(assetItemCode: string): Promise<any>;
    createAssetUser(input: any): Promise<void>;
    updateAssetUserStatus(userId: number, assetItemCode: string, status: string): Promise<void>;
    updateAssetUserReturnDate(userId: number, assetItemCode: string): Promise<void>;
    updateAssetUserById(id: number, status: string): Promise<void>;
    getPendingRequestByAssetItemCodeAndRequesterId(assetItemCode: string, requesterId: number): Promise<any>;
    update(input: any): Promise<void>;
}