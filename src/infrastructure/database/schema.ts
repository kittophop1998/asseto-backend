import {
  Generated,
  Selectable,
} from 'kysely'

export interface Database {
  assets: AssetTable
  categories: CategoryTable
  departments: DepartmentTable
}

export interface AssetTable {
    id: Generated<number>
    code: string
    name: string
    category_id: number
    description?: string
    unit: string
    minimum_qty: number
    status: 'ACTIVE' | 'INACTIVE' | 'IN_USE' | 'LOW_STOCK'
    department_id: number
    created_at: Generated<Date>
    updated_at: Date
}

export interface CategoryTable {
  id: Generated<number>
  name: string
  description?: string
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