import dayjs from "dayjs";
import { IAssetRequestRepository } from "../../application/repository/IAssetRequestRepository";
import { db } from "./maria";

export class AssetRequestRepository implements IAssetRequestRepository {
    async create(input: any): Promise<any> {
        await db
            .insertInto('asset_requests')
            .values({
                code: input.code,
                serial_number: input.serialNumber ?? '',
                department_id: input.departmentId,
                status: input.status,
                requester_id: input.requesterId ?? 1,
                request_date: dayjs().toDate(),
                approver_id: null,
                approval_date: null,
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
            .leftJoin('asset_items', 'asset_requests.serial_number', 'asset_items.serial_number')
            .innerJoin('assets', 'asset_items.asset_id', 'assets.id')
            .select([
                'asset_requests.id as requestId',
                'asset_requests.code as requestCode',
                'departments.name as departmentName',
                'asset_requests.status as status',
                'asset_requests.request_date as requestDate',
                'asset_requests.approval_date as approvalDate',
                'asset_requests.created_at as createdAt',
                'asset_requests.updated_at as updatedAt',
                'asset_items.serial_number as serialNumber',
                'assets.name as assetName',
            ])
            .groupBy('asset_requests.id')
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

    async updateStatus(code: string, status: string): Promise<void> {
        await db
            .updateTable('asset_requests')
            .set({
                status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
                approval_date: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .where('code', '=', code)
            .execute();
    }

    async updateRequestItem(code: string, assetItemIds: number[]): Promise<void> {
        const assetRequestCode = await db
            .selectFrom('asset_requests')
            .select('code')
            .where('code', '=', code)
            .executeTakeFirst();

        console.log('Asset Request Code:', assetRequestCode);

        if (!assetRequestCode) {
            throw new Error(`Asset request with code ${code} not found`);
        }

        const values = assetItemIds.map(assetItemId => ({
            asset_request_code: assetRequestCode.code,
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
            .innerJoin('asset_request_item', 'asset_requests.code', 'asset_request_item.asset_request_code')
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