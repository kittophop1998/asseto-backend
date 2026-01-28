import {
  Generated,
  Selectable,
} from 'kysely'

export interface Database {
  assets: AssetTable
  categories: CategoryTable
  departments: DepartmentTable
  asset_items: AssetItemTable
  asset_requests: AssetRequestTable
  asset_users: AssetUserTable
  asset_request_item: AssetRequestItemTable
  users: UserTable
}

export interface AssetTable {
  id: Generated<number>
  code: string
  name: string
  category_id: number
  department_id: number
  description: string
  minimum_qty: number
  status: 'NORMAL' | 'LOW_STOCK'
  created_at: Generated<Date>
  updated_at: Date
}

export interface AssetItemTable {
  id: Generated<number>
  asset_id: number
  asset_code_ac: string
  serial_number: string
  status: 'AVAILABLE' | 'IN_USE' | 'UNDER_MAINTENANCE' | 'RETIRED'
  purchase_date: Date
  warranty_end_date: Date
  created_at: Generated<Date>
  updated_at: Date
}

export interface AssetRequestTable {
  id: Generated<number>
  code: string
  serial_number: string
  department_id: number
  type: 'REQUEST' | 'RETURN'
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED'
  requester_id: number
  request_date: Date
  approver_id: number | null
  approval_date: Date | null
  created_at: Generated<Date>
  updated_at: Date
}

export interface AssetRequestItemTable {
  id: Generated<number>
  asset_request_code: string
  asset_item_id: number
  created_at: Generated<Date>
  updated_at: Date
}

export interface AssetUserTable {
  id: Generated<number>
  user_id: number
  department_id: number
  serial_number: string
  assigned_date: Date
  returned_date: Date | null
  created_at: Generated<Date>
  updated_at: Date
}

export interface CategoryTable {
  id: Generated<number>
  name: string
  description: string
  created_at: Generated<Date>
  updated_at: Date
}

export interface DepartmentTable {
  id: Generated<number>
  code: string
  name: string
  type: 'BACKOFFICE' | 'BRANCH'
  created_at: Generated<Date>
  updated_at: Date
}

export interface UserTable {
  id: Generated<number>
  username: string
  password_hash: string
  full_name: string
  email: string
  department_id: number
}

export type Assets = Selectable<AssetTable>
export type Categories = Selectable<CategoryTable>
export type Departments = Selectable<DepartmentTable>
export type AssetItems = Selectable<AssetItemTable>
export type AssetRequests = Selectable<AssetRequestTable>
export type AssetUsers = Selectable<AssetUserTable>
export type AssetRequestItems = Selectable<AssetRequestItemTable>
export type Users = Selectable<UserTable>