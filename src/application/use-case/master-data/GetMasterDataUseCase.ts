import { IMasterDataRepository } from "../../repository/IMasterDataRepository";

export class GetMasterDataUseCase {
    constructor(
        private readonly masterDataRepository: IMasterDataRepository
    ) {}

    async execute(): Promise<any> {
        const departments = await this.masterDataRepository.getDepartment();
        const categories = await this.masterDataRepository.getCategory();
        
        return { departments, categories };
    }
}