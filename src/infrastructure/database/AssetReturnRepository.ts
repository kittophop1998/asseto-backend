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
            .selectAll()
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

    async getAssetReturnByCode(code: string): Promise<any | null> {
        const assetReturn = await db
            .selectFrom("asset_returns")
            .innerJoin("asset_requests", "asset_returns.asset_request_code", "asset_requests.code")
            .innerJoin("asset_request_item", "asset_requests.code", "asset_request_item.asset_request_code")
            .innerJoin("asset_items", "asset_request_item.asset_item_id", "asset_items.id")
            .innerJoin("assets", "asset_items.asset_id", "assets.id")
            .selectAll()
            .where("code", "=", code)
            .executeTakeFirst();

        return assetReturn || null;
    }

    async deleteByCode(code: string): Promise<void> {
        await db
            .deleteFrom("asset_returns")
            .where("code", "=", code)
            .execute();
    }

    async approveByCode(code: string): Promise<void> {
        await db
            .updateTable("asset_returns")
            .set({
                status: 'RETURNED',
                updated_at: dayjs().toDate()
            })
            .where("code", "=", code)
            .execute();
    }
}