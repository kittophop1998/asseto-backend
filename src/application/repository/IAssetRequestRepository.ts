export interface IAssetRequestRepository {
    getAllRequest(): Promise<any>
    create(input: any): Promise<any>
    getLastRequestCode(): Promise<string | null>
    updateRequestItem(code:  string, assetItemIds: number[]): Promise<void>
    updateStatus(
        code: string,
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED'
    ): Promise<void>
    getListRequestDetail(): Promise<any>
}