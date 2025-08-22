'use client'

import { useState, useEffect, useCallback } from 'react'
import { Company, CompanyStats, CompanySettings } from '@/lib/api/company'
import { CompanyAPI } from '@/lib/api/company'
import { useToast } from '@/components/ui/use-toast'
import type { TeamMember } from '@/types/profile'

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Company | null>(null)
  const [stats, setStats] = useState<CompanyStats | null>(null)
  const [settings, setSettings] = useState<CompanySettings | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrganization = useCallback(async () => {
    setLoading(true)
    try {
      const org = await CompanyAPI.getCurrentCompany()
      setOrganization(org)            // org может быть null — это ок
      setError(null)
    } catch (err: any) {
      console.error('fetchOrganization error:', err?.response || err)
      const msg = err.response?.data?.detail || 'Failed to fetch company'
      setError(msg)
      toast({ title: 'Error', description: msg, variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  const fetchCompanyStats = useCallback(async (orgId?: string) => {
    try {
      const fn: any = (CompanyAPI as any).getCompanyStats
      if (typeof fn !== 'function') return
      // Если метод принимает orgId — передадим, иначе вызовем без аргументов
      const s = fn.length >= 1 ? await fn(orgId) : await fn()
      setStats(s)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }, [])

  const fetchCompanySettings = useCallback(async (orgId?: string) => {
    try {
      const fn: any = (CompanyAPI as any).getCompanySettings
      if (typeof fn !== 'function') return
      const s = fn.length >= 1 ? await fn(orgId) : await fn()
      setSettings(s)
    } catch (err) {
      console.error('Failed to fetch company settings:', err)
    }
  }, [])

  const fetchTeamMembers = useCallback(async (orgId?: string) => {
    try {
      const fn: any = (CompanyAPI as any).getTeamMembers
      if (typeof fn !== 'function') { setTeamMembers([]); return }
      const members = fn.length >= 1 ? await fn(orgId) : await fn()
      setTeamMembers(Array.isArray(members) ? members : [])
    } catch (err) {
      console.error('Failed to fetch team members:', err)
      setTeamMembers([])
    }
  }, [])

  const updateOrganization = useCallback(async (updates: Partial<Company>) => {
    try {
      const updated = await CompanyAPI.updateCompany(updates)
      setOrganization(updated)
      toast({ title: 'Company updated successfully' })
      return true
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to update company'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      return false
    }
  }, [toast])

  const updateCompanySettings = useCallback(async (updates: Partial<CompanySettings>) => {
    try {
      const updated = await CompanyAPI.updateCompanySettings(updates)
      setSettings(updated)
      toast({ title: 'Settings updated' })
      return true
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Failed to update settings'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      return false
    }
  }, [toast])

  const inviteUser = useCallback(async (email: string, role: 'member' | 'manager' | 'admin' = 'member') => {
    try {
      if (typeof (CompanyAPI as any).inviteUser === 'function' && organization?.id) {
        await (CompanyAPI as any).inviteUser(organization.id, { email, role })
        toast({ title: 'Invite sent' })
        await fetchTeamMembers(organization.id)
        return true
      }
      toast({ title: 'Invite not implemented', description: 'API inviteUser() отсутствует', variant: 'destructive' })
      return false
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to invite user'
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      return false
    }
  }, [organization?.id, toast, fetchTeamMembers])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  useEffect(() => {
    const orgId = organization?.id
    if (!orgId) { setLoading(false); return }
    (async () => {
      await Promise.all([
        fetchCompanyStats(orgId),
        fetchCompanySettings(orgId),
        fetchTeamMembers(orgId),
      ])
      setLoading(false)
    })()
  }, [organization?.id, fetchCompanySettings, fetchCompanyStats, fetchTeamMembers])

  const refetchAll = useCallback(async () => {
    await fetchOrganization()
    const orgId = organization?.id
    if (orgId) {
      await Promise.all([
        fetchCompanyStats(orgId),
        fetchCompanySettings(orgId),
        fetchTeamMembers(orgId),
      ])
    }
  }, [organization?.id, fetchOrganization, fetchCompanySettings, fetchCompanyStats, fetchTeamMembers])

  return {
    organization,
    stats,
    settings,
    loading,
    error,
    teamMembers,
    updateOrganization,
    updateCompanySettings,
    inviteUser,
    refetch: fetchOrganization,
    refetchTeam: fetchTeamMembers,
    refetchAll,
  }
}