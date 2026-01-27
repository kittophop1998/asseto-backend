export interface IAssetRequestRepository {
    getAllRequest(): Promise<any>
    create(input: any): Promise<any>
    getLastRequestCode(): Promise<string | null>
}