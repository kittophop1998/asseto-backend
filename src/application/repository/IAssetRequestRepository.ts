export interface IAssetRequestRepository {
    getAllRequest(): Promise<any>
    create(input: any): Promise<any>
    getLastRequestCode(): Promise<string | null>
    updateRequestItem(id:  number, assetItemIds: number[]): Promise<void>
    updateStatus(
        id: number,
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED'
    ): Promise<void>
    getListRequestDetail(): Promise<any>
}