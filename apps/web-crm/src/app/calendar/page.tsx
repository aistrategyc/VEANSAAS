"use client"

import { useState, useCallback, useMemo } from "react"
import { Calendar, Views, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { useCalendar, useCalendarStats, useUpcomingDeadlines, useOverdueEvents, useEventFilters } from "@/app/calendar/hooks/useCalendar"
import ProtectedRoute from "@/components/auth/ProtectedRoute"
import { CalendarEvent, EventType, EventStatus, CreateEventRequest } from "@/lib/api/calendar"
import { TaskPriority } from "@/lib/api/tasks"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

import {
  Plus,
  Search,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  AlertTriangle,
  Target,
  CheckCircle2,
  XCircle,
  Loader2,
  Eye,
  Edit3,
  Trash2,
  BarChart3,
  TrendingUp
} from "lucide-react"

// Calendar localization
const locales = { 'en-US': enUS }
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function CalendarPage() {
  return (
    <ProtectedRoute>
      <CalendarPageContent />
    </ProtectedRoute>
  )
}

function CalendarPageContent() {
  const { toast } = useToast()

  const { events, loading, createEvent, updateEvent, deleteEvent, updateEventStatus } = useCalendar()
  const { stats } = useCalendarStats()
  const { deadlines } = useUpcomingDeadlines(7)
  const { overdueEvents } = useOverdueEvents()
  const {
    filteredEvents,
    searchQuery,
    setSearchQuery,
    selectedTypes,
    selectedPriorities,
    toggleType,
    togglePriority,
    resetFilters
  } = useEventFilters(events)

  const [view, setView] = useState<typeof Views[keyof typeof Views]>(Views.MONTH)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [isCreating, setIsCreating] = useState(false)

  const [newEvent, setNewEvent] = useState<CreateEventRequest>({
    title: "",
    start: "",
    end: "",
    type: EventType.TASK,
    description: "",
    priority: TaskPriority.MEDIUM,
    assignee: "",
    allDay: true
  })

  const handleCreateEvent = useCallback(async () => {
    if (!newEvent.title.trim() || !newEvent.start || !newEvent.end) {
      toast({ title: 'Validation Error', description: 'Fill all required fields', variant: 'destructive' })
      return
    }

    setIsCreating(true)
    const success = await createEvent(newEvent)

    if (success) {
      setNewEvent({
        title: "",
        start: "",
        end: "",
        type: EventType.TASK,
        description: "",
        priority: TaskPriority.MEDIUM,
        assignee: "",
        allDay: true
      })
      setShowCreateDialog(false)
    }

    setIsCreating(false)
  }, [newEvent, createEvent, toast])

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.URGENT:
        return '#dc2626'
      case TaskPriority.HIGH:
        return '#ea580c'
      case TaskPriority.MEDIUM:
        return '#ca8a04'
      case TaskPriority.LOW:
        return '#16a34a'
      default:
        return '#3b82f6'
    }
  }

  const getStatusIcon = (status: EventStatus) => {
    switch (status) {
      case EventStatus.COMPLETED:
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case EventStatus.IN_PROGRESS:
        return <Clock className="w-4 h-4 text-blue-600" />
      case EventStatus.CANCELLED:
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <CalendarIcon className="w-4 h-4 text-gray-600" />
    }
  }

  const deleteEventHandler = useCallback(async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      const event = events.find(e => e.id === eventId)
      await deleteEvent(eventId, event?.title || 'Event')
      setShowEventDialog(false)
    }
  }, [deleteEvent, events])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-6 h-6" />
          <h1 className="text-3xl font-bold">Calendar</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          
          <Select value={view} onValueChange={(v: any) => setView(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={Views.MONTH}>Month</SelectItem>
              <SelectItem value={Views.WEEK}>Week</SelectItem>
              <SelectItem value={Views.DAY}>Day</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new event to your calendar</DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    placeholder="Event title..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    placeholder="Event description..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="start">Start Date</Label>
                    <Input
                      id="start"
                      type="datetime-local"
                      value={newEvent.start}
                      onChange={(e) => setNewEvent({ ...newEvent, start: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="end">End Date</Label>
                    <Input
                      id="end"
                      type="datetime-local"
                      value={newEvent.end}
                      onChange={(e) => setNewEvent({ ...newEvent, end: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={newEvent.type}
                      onValueChange={(value) => setNewEvent({ ...newEvent, type: value as EventType })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={EventType.TASK}>Task</SelectItem>
                        <SelectItem value={EventType.MEETING}>Meeting</SelectItem>
                        <SelectItem value={EventType.DEADLINE}>Deadline</SelectItem>
                        <SelectItem value={EventType.CALL}>Call</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newEvent.priority}
                      onValueChange={(value) => setNewEvent({ ...newEvent, priority: value as TaskPriority })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TaskPriority.LOW}>Low</SelectItem>
                        <SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
                        <SelectItem value={TaskPriority.HIGH}>High</SelectItem>
                        <SelectItem value={TaskPriority.URGENT}>Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateEvent} disabled={isCreating}>
                  {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Event
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Upcoming</p>
                <p className="text-2xl font-bold">{deadlines.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold">{overdueEvents.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {events.filter(e => e.status === EventStatus.COMPLETED).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Calendar */}
      <Card>
        <CardContent className="p-6">
          <Calendar
            localizer={localizer}
            events={filteredEvents.map(event => ({
              ...event,
              start: new Date(event.start),
              end: new Date(event.end),
            }))}
            startAccessor="start"
            endAccessor="end"
            views={[Views.MONTH, Views.WEEK, Views.DAY]}
            view={view}
            onView={setView}
            style={{ height: 600 }}
            eventPropGetter={(event: any) => {
              return {
                style: {
                  backgroundColor: event.priority ? getPriorityColor(event.priority) : '#3b82f6',
                  color: 'white',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '12px',
                }
              }
            }}
            components={{
              event: ({ event }: any) => (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="cursor-pointer text-white p-1 rounded flex items-center gap-1 truncate"
                        onClick={() => {
                          setSelectedEvent(event)
                          setShowEventDialog(true)
                        }}
                      >
                        {event.status ? getStatusIcon(event.status as EventStatus) : <CalendarIcon className="w-4 h-4 text-gray-600" />}
                        <span className="truncate">{event.title}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="space-y-1">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-xs">{event.type.toUpperCase()}</p>
                        {event.description && (
                          <p className="text-xs text-muted-foreground">{event.description}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )
            }}
          />
        </CardContent>
      </Card>

      {/* Upcoming Deadlines Sidebar */}
      {deadlines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {deadlines.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center gap-2 p-2 border rounded-lg">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: event.priority ? getPriorityColor(event.priority) : '#3b82f6' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.start).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {event.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Detail Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedEvent.status ? getStatusIcon(selectedEvent.status as EventStatus) : <CalendarIcon className="w-4 h-4 text-gray-600" />}
                  {selectedEvent.title}
                  <Badge
                    variant="outline"
                    style={{ backgroundColor: selectedEvent.priority ? getPriorityColor(selectedEvent.priority) : '#3b82f6', color: 'white' }}
                  >
                    {selectedEvent.priority?.toUpperCase() || 'MEDIUM'}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedEvent.type.toUpperCase()} • {new Date(selectedEvent.start).toLocaleString()} - {new Date(selectedEvent.end).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="actions">Actions</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4 mt-4">
                  {selectedEvent.description && (
                    <div>
                      <Label>Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedEvent.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start</Label>
                      <p className="text-sm">{new Date(selectedEvent.start).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>End</Label>
                      <p className="text-sm">{new Date(selectedEvent.end).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label>Type</Label>
                      <p className="text-sm">{selectedEvent.type}</p>
                    </div>
                    <div>
                      <Label>Priority</Label>
                      <p className="text-sm">{selectedEvent.priority}</p>
                    </div>
                    <div>
                      <Label>Status</Label>
                      <p className="text-sm">{selectedEvent.status}</p>
                    </div>
                  </div>

                  {selectedEvent.assignee && (
                    <div>
                      <Label>Assignee</Label>
                      <p className="text-sm">{selectedEvent.assignee}</p>
                    </div>
                  )}

                  <div className="text-xs text-muted-foreground border-t pt-2">
                    Event ID: {selectedEvent.id}
                  </div>
                </TabsContent>

                <TabsContent value="actions" className="space-y-4 mt-4">
                  <div className="grid gap-2">
                    <Label>Change Status</Label>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateEventStatus(selectedEvent.id, EventStatus.IN_PROGRESS)}
                        disabled={selectedEvent.status === EventStatus.IN_PROGRESS}
                      >
                        In Progress
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateEventStatus(selectedEvent.id, EventStatus.COMPLETED)}
                        disabled={selectedEvent.status === EventStatus.COMPLETED}
                      >
                        Complete
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateEventStatus(selectedEvent.id, EventStatus.CANCELLED)}
                        disabled={selectedEvent.status === EventStatus.CANCELLED}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Event
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteEventHandler(selectedEvent.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}