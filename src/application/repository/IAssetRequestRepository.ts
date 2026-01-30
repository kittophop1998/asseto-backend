export interface IAssetRequestRepository {
    getAllRequest(id?: number, status?: string): Promise<any>
    create(input: any): Promise<any>
    getLastRequestCode(): Promise<string | null>
    updateStatus(
        code: string,
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED'
    ): Promise<void>
    getListRequestDetail(): Promise<any>
    getMyAsset(id: number): Promise<any>
    getRequestByCode(code: string): Promise<any>
    createAssetUser(userId: number, serialNumber: string, departmentId: number, status: string): Promise<void>
    updateAssetUserStatus(userId: number, serialNumber: string, status: string): Promise<void>;
    updateAssetUserReturnDate(userId: number, serialNumber: string): Promise<void>
    updateAssetUserById(id: number, status: string): Promise<void>;
}