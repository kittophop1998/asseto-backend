export interface IMasterDataRepository {
    getDepartment(): Promise<any>
    getCategory(): Promise<any>
}