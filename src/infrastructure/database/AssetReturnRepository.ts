import dayjs from "dayjs";
import { IAssetReturnRepository } from "../../application/repository/IAssetReturnRepository";
import { db } from "./maria";

export class AssetReturnRepository implements IAssetReturnRepository {
    async create(input: any): Promise<void> {
        await db
            .insertInto("asset_returns")
            .values({
                code: input.code,
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
            .select([
                'asset_returns.code as return_code',
                'asset_returns.asset_request_code',
                'asset_returns.return_date',
                'asset_returns.status',
                'asset_returns.notes',
                'asset_requests.quantity',
                'asset_requests.status as request_status'
            ])
            .execute();

        return assetReturns;
    }

    async getLastReturnCode(): Promise<string | null> {
        const result = await db
            .selectFrom("asset_returns")
            .select("code")
            .orderBy("id", "desc")
            .limit(1)
            .executeTakeFirst();

        return result ? result.code : null;
    }
}