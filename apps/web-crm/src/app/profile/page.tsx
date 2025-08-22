"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/app/profile/hooks/useProfile"
import { useOrganization } from "@/app/profile/hooks/useOrganization"
import { useTasks } from "@/app/tasks/hooks/useTasks"
import ProtectedRoute from "@/components/auth/ProtectedRoute"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

import {
  AlertTriangle,
  Award,
  Building2,
  Calendar,
  Camera,
  CheckSquare,
  Clock,
  Edit3,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Save,
  Star,
  Target,
  TrendingUp,
  Twitter,
  User,
  Users,
  X,
  Github,
  Loader2,
  Plus,
  Shield,
  Settings,
  BarChart3,
  FileText,
  Activity
} from "lucide-react"

interface PasswordChangeForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function ProfilePageContent() {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Hooks
  const { profile, stats, loading: profileLoading, updating, updateProfile, uploadAvatar, changePassword } = useProfile()
  const { organization: currentOrg, loading: orgLoading, updateOrganization, teamMembers, inviteUser } = useOrganization()
  const { tasks, loading: tasksLoading } = useTasks(profile ? { assignee: profile.id } : undefined)
  // State
  const [isEditing, setIsEditing] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("member")
  const [passwordForm, setPasswordForm] = useState<PasswordChangeForm>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Form data for editing
  const [formData, setFormData] = useState({
    username: profile?.username || "",
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    bio: profile?.bio || "",
    timezone: profile?.timezone || ""
  })

  const [orgFormData, setOrgFormData] = useState({
    name: currentOrg?.name || "",
    description: currentOrg?.description || "",
    website: currentOrg?.website || ""
  })

  // Update form data when profile/org changes
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        timezone: profile.timezone || ""
      })
    }
  }, [profile])

  useEffect(() => {
    if (currentOrg) {
      setOrgFormData({
        name: currentOrg.name || "",
        description: currentOrg.description || "",
        website: currentOrg.website || ""
      })
    }
  }, [currentOrg])

  // Handlers
  const handleSaveProfile = useCallback(async () => {
    const success = await updateProfile(formData)
    if (success) {
      setIsEditing(false)
    }
  }, [formData, updateProfile])

  const handleSaveOrganization = useCallback(async () => {
  if (!currentOrg) return
  const success = await updateOrganization(orgFormData) // ← без id
  if (success) setIsEditing(false)
}, [currentOrg, orgFormData, updateOrganization])

  const handleAvatarUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File',
        description: 'Please select an image file',
        variant: 'destructive',
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'File Too Large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      })
      return
    }

    await uploadAvatar(file)
  }, [uploadAvatar, toast])

  const handlePasswordChange = useCallback(async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New passwords do not match',
        variant: 'destructive',
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: 'Weak Password',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      })
      return
    }

    const success = await changePassword(passwordForm.currentPassword, passwordForm.newPassword)
    if (success) {
      setIsPasswordDialogOpen(false)
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    }
  }, [passwordForm, changePassword, toast])

  const handleInviteUser = useCallback(async () => {
    if (!currentOrg || !inviteEmail.trim()) return

    const success = await inviteUser(inviteEmail, inviteRole as 'member' | 'manager' | 'admin')
    if (success) {
      setInviteEmail("")
      setInviteRole("member")
    }
  }, [currentOrg, inviteEmail, inviteRole, inviteUser])

  const router = useRouter()

  const handleVerifyEmail = useCallback(() => {
    if (!profile?.email) return
    router.push(`/verify-email?email=${encodeURIComponent(profile.email)}`)
  }, [profile?.email, router])

  // Helper functions
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (isActive?: boolean, lastLogin?: string | null) => {
  const active = !!isActive
  if (!active) return "bg-gray-400"
  if (!lastLogin) return "bg-yellow-500"

  const lastLoginDate = new Date(lastLogin)
  const now = new Date()
  const diffHours = (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60)

  if (diffHours < 1) return "bg-green-500"
  if (diffHours < 24) return "bg-yellow-500"
  return "bg-gray-400"
}

  const getStatusText = (isActive?: boolean, lastLogin?: string | null) => {
  const active = !!isActive
  if (!active) return "Inactive"
  if (!lastLogin) return "Never logged in"

  const lastLoginDate = new Date(lastLogin)
  const now = new Date()
  const diffHours = (now.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60)

  if (diffHours < 1) return "Online"
  if (diffHours < 24) return "Away"
  return "Offline"
}

  // Loading state
  if (profileLoading || orgLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground">Unable to load your profile information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground mt-1">
            Manage your personal information, organization, and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button 
                onClick={() => {
                  handleSaveProfile()
                  if (currentOrg) handleSaveOrganization()
                }} 
                disabled={updating}
                className="bg-green-600 hover:bg-green-700"
              >
                {updating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={updating}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="organization" className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            Organization
          </TabsTrigger>
          <TabsTrigger value="team" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4" />
            My Tasks
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src={profile.avatar_url} />
                      <AvatarFallback className="text-2xl">
                        {getInitials(profile.username || profile.email || "U")}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button 
                        size="sm" 
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0" 
                        variant="secondary"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={updating}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">{profile.username}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                    <Badge variant={profile.is_verified ? "default" : "secondary"} className="mt-2">
                      {profile.is_verified ? "Verified" : "Not Verified"}
                    </Badge>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        value={profile.email}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) => setFormData({ ...formData, timezone: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UTC">UTC</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="Europe/London">London</SelectItem>
                          <SelectItem value="Europe/Paris">Paris</SelectItem>
                          <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  {/* Account Info */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {formatDate(profile.created_at)}</span>
                      </div>
                      {profile.last_login_at && (
                        <div className="flex items-center gap-2">
                          <Activity className="w-4 h-4" />
                          <span>Last login: {formatDate(profile.last_login_at)}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>Account Status: <Badge variant={profile.is_active ? "default" : "secondary"}>{profile.is_active ? "Active" : "Inactive"}</Badge></div>
                      <div>User ID: <code className="text-xs">{profile.id}</code></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Organization Tab */}
        <TabsContent value="organization" className="space-y-6">
          {currentOrg ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Organization Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="orgName">Organization Name</Label>
                  <Input
                    id="orgName"
                    value={orgFormData.name}
                    onChange={(e) => setOrgFormData({ ...orgFormData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="orgWebsite">Website</Label>
                  <Input
                    id="orgWebsite"
                    value={orgFormData.website}
                    onChange={(e) => setOrgFormData({ ...orgFormData, website: e.target.value })}
                    disabled={!isEditing}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="orgDescription">Description</Label>
                  <Textarea
                    id="orgDescription"
                    value={orgFormData.description}
                    onChange={(e) => setOrgFormData({ ...orgFormData, description: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Tell us about your organization..."
                    rows={4}
                  />
                </div>

                {/* Organization Stats */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Founded: {formatDate(currentOrg.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Team Members ({(teamMembers?.length ?? 0)})</span>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>Organization ID: <code className="text-xs">{currentOrg.id}</code></div>
                    {currentOrg.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={currentOrg.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Visit Website
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <Building2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Organization</h3>
                <p className="text-muted-foreground mb-4">You're not part of any organization yet.</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Organization
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Members ({teamMembers?.length ?? 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(teamMembers ?? []).map(member => (
                  <div key={member.id} className="flex flex-col items-center space-y-3 p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={member.avatar_url} />
                        <AvatarFallback>{getInitials(member.username)}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(member.is_active, member.last_login_at)}`} />
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-sm">{member.username}</div>
                      <div className="text-xs text-muted-foreground">{member.email}</div>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {member.role}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {getStatusText(member.is_active, member.last_login_at)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Invite User Card */}
          {currentOrg && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Invite Team Member
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="inviteEmail">Email Address</Label>
                    <Input
                      id="inviteEmail"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="colleague@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inviteRole">Role</Label>
                    <Select value={inviteRole} onValueChange={setInviteRole}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Employee</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    onClick={handleInviteUser} 
                    className="w-full"
                    disabled={!inviteEmail.trim()}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* My Tasks Tab */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" />
                My Tasks ({tasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tasksLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                  <p className="text-muted-foreground">Loading tasks...</p>
                </div>
              ) : tasks.length > 0 ? (
                <div className="space-y-4">
                  {tasks.slice(0, 10).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {task.status.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.priority.toUpperCase()}
                          </Badge>
                          {task.due_date && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {formatDate(task.due_date)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {tasks.length > 10 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" size="sm">
                        View All Tasks ({tasks.length})
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">No Tasks Assigned</h3>
                  <p className="text-muted-foreground">You don't have any tasks assigned to you yet.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="stats" className="space-y-6">
          {stats ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold">{stats.total_tasks}</p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{stats.completed_tasks}</p>
                    </div>
                    <CheckSquare className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold">{stats.active_projects}</p>
                    </div>
                    <Target className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">{stats.completion_rate}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No Statistics Available</h3>
                <p className="text-muted-foreground">Start working on tasks to see your statistics.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Password & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Password</h4>
                  <p className="text-sm text-muted-foreground">Last changed: Never</p>
                </div>
                <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">Change Password</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Change Password</DialogTitle>
                      <DialogDescription>
                        Enter your current password and choose a new secure password.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handlePasswordChange}>
                        Change Password
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Two Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                </div>
                <Button variant="outline" disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div>
                  <h4 className="font-medium">Account Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Status: {profile.is_verified ? "Verified" : "Not Verified"}
                  </p>
                </div>
                {!profile.is_verified && (
                  <Button variant="outline" onClick={handleVerifyEmail}>
                    <Mail className="w-4 h-4 mr-2" />
                    Verify Email
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      requireVerified={true}
    >
      <ProfilePageContent />
    </ProtectedRoute>
  )
}