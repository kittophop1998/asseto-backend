import dayjs from "dayjs";
import { IAssetRequestRepository } from "../../application/repository/IAssetRequestRepository";
import { db } from "./maria";

export class AssetRequestRepository implements IAssetRequestRepository {
    async create(input: any): Promise<any> {
        await db
            .insertInto('asset_requests')
            .values({
                code: input.code,
                asset_id: input.assetId ?? 1,
                requester_id: input.requesterId ?? 1,
                department_id: input.departmentId,
                quantity: input.quantity ?? 0,
                status: input.status ?? 'PENDING',
                request_date: dayjs().toDate(),
                approver_id: input.approverId ?? 1,
                approval_date: null,
                fulfillment_date: null,
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .execute();

        return input;
    }

    async getAllRequest(): Promise<any> {
        const requests = await db
            .selectFrom('asset_requests')
            .selectAll()
            .execute();

        return requests;
    }

    async getLastRequestCode(): Promise<string | null> {
        const lastRequest = await db
            .selectFrom('asset_requests')
            .select(['code'])
            .orderBy('id', 'desc')
            .limit(1)
            .executeTakeFirst();

        return lastRequest ? lastRequest.code : null;
    }
}