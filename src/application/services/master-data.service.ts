import { IMasterDataRepository } from "../repository/IMasterDataRepository";

export class MasterDataService {
    constructor(
        private readonly masterDataRepository: IMasterDataRepository
    ) {}

    async getMasterData(): Promise<any> {
        const departments = await this.masterDataRepository.getDepartment();
        const categories = await this.masterDataRepository.getCategory();
        
        return { departments, categories };
    }
}
