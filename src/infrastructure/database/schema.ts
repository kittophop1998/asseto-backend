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
}

export interface AssetTable {
  id: Generated<number>
  code: string
  name: string
  category_id: number
  unit: string
  description: string
  total_quantity: number
  available_quantity: number
  minimum_qty: number
  status: 'ACTIVE' | 'INACTIVE' | 'IN_USE' | 'LOW_STOCK'
  department_id: number
  created_at: Generated<Date>
  updated_at: Date
}

export interface AssetItemTable {
  id: Generated<number>
  asset_id: number
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
  asset_id: number
  requester_id: number
  department_id: number
  quantity: number
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED' | 'CANCELLED'
  request_date: Date
  approver_id: number | null
  approval_date: Date | null
  fulfillment_date: Date | null
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

export type Assets = Selectable<AssetTable>
export type Categories = Selectable<CategoryTable>
export type Departments = Selectable<DepartmentTable>
export type AssetItems = Selectable<AssetItemTable>
export type AssetRequests = Selectable<AssetRequestTable>