export interface IAssetRequestRepository {
    getAllRequest(id?: number, status?: string): Promise<any>
    create(input: any): Promise<any>
    getLastRequestCode(): Promise<string | null>
    updateRequestItem(code:  string, assetItemIds: number[]): Promise<void>
    updateStatus(
        code: string,
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED'
    ): Promise<void>
    getListRequestDetail(): Promise<any>
    getRequestByCode(code: string): Promise<any>
    createAssetUser(userId: number, serialNumber: string, departmentId: number): Promise<void>
    updateAssetUserReturnDate(userId: number, serialNumber: string): Promise<void>
    getMyAsset(id: number): Promise<any>
}