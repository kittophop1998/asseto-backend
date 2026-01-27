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
            .innerJoin('departments', 'asset_requests.department_id', 'departments.id')
            .innerJoin('assets', 'asset_requests.asset_id', 'assets.id')
            .select([
                'asset_requests.id as requestId',
                'asset_requests.code as requestCode',
                'assets.name as assetName',
                'departments.name as departmentName',
                'asset_requests.quantity as quantity',
                'asset_requests.status as status',
                'asset_requests.request_date as requestDate',
                'asset_requests.approval_date as approvalDate',
                'asset_requests.fulfillment_date as fulfillmentDate',
            ])
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