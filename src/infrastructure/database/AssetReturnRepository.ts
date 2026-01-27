import dayjs from "dayjs";
import { IAssetReturnRepository } from "../../application/repository/IAssetReturnRepository";
import { CreateAssetReturnRequest } from "../../application/use-case/asset-return/CreateAssetReturnUseCase";
import { db } from "./maria";

export class AssetReturnRepository implements IAssetReturnRepository {
    async create(input: CreateAssetReturnRequest): Promise<void> {
        await db
            .insertInto("asset_returns")
            .values({
                asset_request_code: input.assetRequestCode,
                return_date: dayjs().toDate(),
                status: 'PENDING',
                notes: input.notes || null,
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate()
            })
            .execute();
    }

    async getAllAssetReturns(): Promise<any[]> {
        const assetReturns = await db
            .selectFrom("asset_returns")
            .innerJoin("asset_requests", "asset_returns.asset_request_code", "asset_requests.code")
            .selectAll()
            .execute();

        return assetReturns;
    }
}