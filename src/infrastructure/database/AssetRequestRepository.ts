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

    async updateStatus(id: number, status: string): Promise<void> {
        await db
            .updateTable('asset_requests')
            .set({
                status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED',
                updated_at: dayjs().toDate(),
            })
            .where('id', '=', id)
            .execute();
    }

    async updateRequestItem(id: number, assetItemIds: number[]): Promise<void> {
        const assetRequestId = await db
            .selectFrom('asset_requests')
            .select('id')
            .where('id', '=', id)
            .executeTakeFirst();

        if (!assetRequestId) {
            throw new Error(`Asset request with id ${id} not found`);
        }

        const values = assetItemIds.map(assetItemId => ({
            asset_request_id: assetRequestId.id,
            asset_item_id: assetItemId,
            created_at: dayjs().toDate(),
            updated_at: dayjs().toDate(),
        }));

        if (values.length > 0) {
            await db
                .insertInto('asset_request_item')
                .values(values)
                .execute();
        }
    }

    async getListRequestDetail(): Promise<any> {
        const requestDetails = await db
            .selectFrom('asset_requests')
            .innerJoin('asset_request_item', 'asset_requests.id', 'asset_request_item.asset_request_id')
            .innerJoin('asset_items', 'asset_request_item.asset_item_id', 'asset_items.id')
            .innerJoin('departments', 'asset_requests.department_id', 'departments.id')
            .select([
                'asset_requests.id as requestId',
                'asset_requests.code as requestCode',
                'departments.name as departmentName',
                'asset_items.serial_number as serialNumber',
                'asset_requests.status as status',
            ])
            .execute();

        return requestDetails;
    }
}