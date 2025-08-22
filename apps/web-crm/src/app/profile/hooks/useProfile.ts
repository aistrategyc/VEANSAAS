// ✅ Updated `useProfile.ts` for VEANCRM project structure
// Location: `src/app/profile/hooks/useProfile.ts`

import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/app/(auth)/hooks/useAuth'
import {
  getCurrentUser,
  updateUserProfile,
  uploadUserAvatar,
  changeUserPassword,
  getUserStats,
} from '@/lib/api/profile'
import { UserProfile, UserProfileUpdate, UserStats } from '@/types/profile'

// 🔹 Profile Hook
export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  const fetchProfile = useCallback(async () => {
    try {
      setError(null)
      setLoading(true)
      const data = await getCurrentUser()
      setProfile(data)
    } catch (err: any) {
      const status = err?.response?.status
      if (status === 401) {
        // likely unauthenticated – keep silent toast-wise
        setError('Unauthorized')
      } else {
        const msg = err?.response?.data?.detail || 'Failed to fetch profile'
        setError(msg)
        toast({ title: 'Error', description: msg, variant: 'destructive' })
      }
    } finally {
      setLoading(false)
    }
  }, [toast])



  const updateProfile = useCallback(async (payload: UserProfileUpdate) => {
    try {
      setUpdating(true)
      const updated = await updateUserProfile(payload)
      setProfile(updated)
      toast({ title: 'Success', description: 'Profile updated' })
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Update failed'
      setError(msg)
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      return false
    } finally {
      setUpdating(false)
    }
  }, [toast])

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setUpdating(true)
      const updated = await uploadUserAvatar(file)
      setProfile(updated)
      toast({ title: 'Avatar Updated', description: 'Avatar uploaded successfully' })
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Avatar upload failed'
      setError(msg)
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      return false
    } finally {
      setUpdating(false)
    }
  }, [toast])

  const changePassword = useCallback(async (current: string, next: string) => {
    try {
      await changeUserPassword(current, next)
      toast({ title: 'Password Changed', description: 'Successfully changed password' })
      return true
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Password change failed'
      setError(msg)
      toast({ title: 'Error', description: msg, variant: 'destructive' })
      return false
    }
  }, [toast])

  useEffect(() => {
  if (user) {
    fetchProfile()
  }
}, [user, fetchProfile])

useEffect(() => {
  if (!profile?.id) return
  (async () => {
    try {
      const s = await getUserStats(profile.id)
      setStats(s)
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  })()
}, [profile?.id])

  return {
    profile,
    stats,
    loading,
    updating,
    error,
    updateProfile,
    uploadAvatar,
    changePassword,
    refetch: fetchProfile,
    resetError: () => setError(null),
  }
}