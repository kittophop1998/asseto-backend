import dayjs from "dayjs";
import { IAssetRequestRepository } from "../../application/repository/IAssetRequestRepository";
import { db } from "./maria";

export class AssetRequestRepository implements IAssetRequestRepository {
    async create(input: any): Promise<any> {
        await db
            .insertInto('asset_requests')
            .values({
                code: input.code,
                type: input.type,
                asset_item_code: input.assetItemCode ?? '',
                department_id: input.departmentId,
                location: input.location ?? 0,
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

    async getAllRequest(id?: number, status?:string): Promise<any> {
        let query = await db
            .selectFrom('asset_requests')
            .innerJoin('departments', 'asset_requests.department_id', 'departments.id')
            .leftJoin('asset_items', 'asset_requests.asset_item_code', 'asset_items.asset_code')
            .innerJoin('assets', 'asset_items.asset_id', 'assets.id')
            .innerJoin('users as requester', 'asset_requests.requester_id', 'requester.id')
            .leftJoin('locations', 'asset_requests.location', 'locations.id')
            .leftJoin('asset_users', (join) => join
                .onRef('asset_users.asset_item_code', '=', 'asset_requests.asset_item_code')
                .onRef('asset_users.user_id', '=', 'asset_requests.requester_id')
                .on('asset_users.returned_date', 'is', null)
            )

        if (id) {
            query = query.where('asset_requests.requester_id', '=', id);
        }

        if (status) {
            query = query.where('asset_requests.status', '=', status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED');
        }

        query = query.orderBy('asset_requests.created_at', 'desc');

        const requests = await query
            .select([
                'asset_requests.id as requestId',
                'asset_requests.code as requestCode',
                'asset_requests.type as requestType',
                'locations.name as locationName',
                'departments.name as departmentName',
                'asset_requests.status as status',
                'asset_requests.image_url as imageUrl',
                'asset_requests.request_date as requestDate',
                'asset_requests.approval_date as approvalDate',
                'asset_requests.created_at as createdAt',
                'asset_requests.updated_at as updatedAt',
                'asset_items.serial_number as serialNumber',
                'assets.name as assetName',
                'asset_users.status as assetUserStatus',
                'requester.full_name as requesterName',
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

    async updateStatus(code: string, status: string): Promise<void> {
        await db
            .updateTable('asset_requests')
            .set({
                status: status as 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED',
                approver_id: 1,
                approval_date: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .where('code', '=', code)
            .execute();
    }

    async getListRequestDetail(): Promise<any> {
        const requestDetails = await db
            .selectFrom('asset_users')
            .innerJoin('departments', 'asset_users.department_id', 'departments.id')
            .innerJoin('asset_items', 'asset_users.asset_item_code', 'asset_items.asset_code')
            .innerJoin('assets', 'asset_items.asset_id', 'assets.id')
            .innerJoin('users', 'asset_users.user_id', 'users.id')
            .select([
                'assets.name as assetName',
                'asset_items.serial_number as serialNumber',
                'departments.name as departmentName',
                'users.full_name as userName',
                'asset_users.assigned_date as assignedDate',
                'asset_users.returned_date as returnedDate',
            ])
            .execute();

        return requestDetails;
    }

    async getRequestByCode(code: string): Promise<any> {
        const request = await db
            .selectFrom('asset_requests')
            .selectAll()
            .where('code', '=', code.trim())
            .executeTakeFirst();

        return request;
    }

    async createAssetUser(
        userId: number, 
        assetItemCode: string, 
        departmentId: number,
        status: string
    ) : Promise<void> {
        await db
            .insertInto('asset_users')
            .values({
                user_id: userId,
                asset_item_code: assetItemCode,
                department_id: departmentId,
                status: status,
                assigned_date: dayjs().toDate(),
                returned_date: null,
                created_at: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .execute();
    }

    async updateAssetUserStatus(userId: number, assetItemCode: string, status: string): Promise<void> {
        await db
            .updateTable('asset_users')
            .set({
                status: status,
                updated_at: dayjs().toDate(),
            })
            .where('user_id', '=', userId)
            .where('asset_item_code', '=', assetItemCode)
            .where('returned_date', 'is', null)
            .execute();
    }

    async updateAssetUserReturnDate(userId: number, assetItemCode: string): Promise<void> {
        await db
            .updateTable('asset_users')
            .set({
                returned_date: dayjs().toDate(),
                updated_at: dayjs().toDate(),
            })
            .where('user_id', '=', userId)
            .where('asset_item_code', '=', assetItemCode)
            .execute();
    }

    async getMyAsset(id: number): Promise<any> {
        const assets = await db
            .selectFrom('asset_users')
            .leftJoin('asset_items', 'asset_users.asset_item_code', 'asset_items.asset_code')
            .leftJoin('assets', 'asset_items.asset_id', 'assets.id')
            .select([
                'assets.name as assetName',
                'asset_items.asset_code as assetItemCode',
                'asset_items.serial_number as serialNumber',
                'asset_users.department_id as departmentId',
                'asset_users.assigned_date as assignedDate',
                'asset_users.returned_date as returnedDate',
                'asset_users.status as status',
            ])
            .where('user_id', '=', id)
            .where('returned_date', 'is', null)
            .execute();

        return assets;
    }

    async updateAssetUserById(id: number, status: string): Promise<void> {
        await db
            .updateTable('asset_users')
            .set({
                status: status,
                updated_at: dayjs().toDate(),
            })
            .where('id', '=', id)
            .execute();
    }

    async getPendingRequestByAssetItemCodeAndRequesterId(assetItemCode: string, requesterId: number): Promise<any> {
        const request = await db
            .selectFrom('asset_requests')
            .selectAll()
            .where('asset_item_code', '=', assetItemCode)
            .where('requester_id', '=', requesterId)
            .where('status', '=', 'PENDING')
            .executeTakeFirst();

        return request;
    }

    async update(input:any): Promise<void> {
        await db
            .updateTable('asset_requests')
            .set({
                image_url: input.imageUrl,
                updated_at: dayjs().toDate(),
            })
            .where('code', '=', input.requestCode)
            .execute();
    }
}