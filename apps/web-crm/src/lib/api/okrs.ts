// src/lib/api/okrs.ts
import { api } from '@/lib/api/config'

// ✅ Соответствует backend schemas/okrs.py
export enum OKRTimeframe {
  Q = "q",
  H1 = "h1",
  H2 = "h2",
  Y = "y",
}

export enum OKRStatus {
  DRAFT = "draft",
  ACTIVE = "active",
  DONE = "done",
  CANCELED = "canceled",
}

export interface OKRBase {
  title: string
  description?: string
  timeframe: OKRTimeframe
  status: OKRStatus
  owner_id?: string
  project_id?: string
}

export interface OKRCreate extends OKRBase {}

export interface OKRUpdate {
  title?: string
  description?: string
  timeframe?: OKRTimeframe
  status?: OKRStatus
  owner_id?: string
  project_id?: string
}

export interface OKR extends OKRBase {
  id: string
  created_at: string
  updated_at?: string
  deleted_at?: string
}

export interface OKRListResponse {
  items: OKR[]
  total: number
  page: number
  page_size: number
}

// OKR API methods
export class OKRsAPI {
  static async getOKRs(params?: { page?: number; page_size?: number }): Promise<OKRListResponse> {
    const searchParams = new URLSearchParams()
    if (params?.page) searchParams.append('page', String(params.page))
    if (params?.page_size) searchParams.append('page_size', String(params.page_size))
    
    const query = searchParams.toString()
    const url = query ? `okrs/?${query}` : 'okrs/'
    
    const { data } = await api.get(url)
    return data
  }

  static async getOKR(okrId: string): Promise<OKR> {
    const { data } = await api.get(`okrs/${okrId}`)
    return data
  }

  static async createOKR(okrData: OKRCreate): Promise<OKR> {
    const { data } = await api.post('okrs/', okrData)
    return data
  }

  static async updateOKR(okrId: string, okrData: OKRUpdate): Promise<OKR> {
    const { data } = await api.patch(`okrs/${okrId}`, okrData)
    return data
  }

  static async deleteOKR(okrId: string): Promise<void> {
    await api.delete(`okrs/${okrId}`)
  }
}