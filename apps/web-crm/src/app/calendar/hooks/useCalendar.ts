// hooks/useCalendar.ts
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { 
  CalendarAPI, 
  CalendarEvent, 
  CreateEventRequest, 
  UpdateEventRequest,
  EventType,
  EventStatus 
} from '@/lib/api/calendar'

// Hook for calendar events management
export const useCalendar = (startDate?: Date, endDate?: Date) => {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch calendar events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const fetchedEvents = await CalendarAPI.getEvents(startDate, endDate)
      setEvents(fetchedEvents)
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to fetch calendar events'
      setError(errorMessage)
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate, toast])

  // Create new event
  const createEvent = useCallback(async (eventData: CreateEventRequest): Promise<CalendarEvent | null> => {
    try {
      const newEvent = await CalendarAPI.createEvent(eventData)
      setEvents(prev => [...prev, newEvent])
      toast({
        title: 'Event Created',
        description: `"${newEvent.title}" has been added to your calendar`,
      })
      return newEvent
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to create event'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return null
    }
  }, [toast])

  // Update event
  const updateEvent = useCallback(async (eventId: string, updates: UpdateEventRequest): Promise<CalendarEvent | null> => {
    try {
      const updatedEvent = await CalendarAPI.updateEvent(eventId, updates)
      setEvents(prev => prev.map(event => 
        event.id === eventId ? updatedEvent : event
      ))
      toast({
        title: 'Event Updated',
        description: `"${updatedEvent.title}" has been updated`,
      })
      return updatedEvent
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update event'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return null
    }
  }, [toast])

  // Delete event
  const deleteEvent = useCallback(async (eventId: string, eventTitle: string): Promise<boolean> => {
    try {
      await CalendarAPI.deleteEvent(eventId)
      setEvents(prev => prev.filter(event => event.id !== eventId))
      toast({
        title: 'Event Deleted',
        description: `"${eventTitle}" has been removed from your calendar`,
      })
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to delete event'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }, [toast])

  // Update event status
  const updateEventStatus = useCallback(async (eventId: string, status: EventStatus): Promise<boolean> => {
    try {
      await CalendarAPI.updateEventStatus(eventId, status)
      
      // Update local state
      setEvents(prev => prev.map(event => 
        event.id === eventId ? { ...event, status } : event
      ))
      
      toast({
        title: 'Status Updated',
        description: `Event status changed to ${status}`,
      })
      return true
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to update status'
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      })
      return false
    }
  }, [toast])

  // Initialize
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    refetch: fetchEvents,
  }
}

// Hook for calendar statistics
export const useCalendarStats = () => {
  const [stats, setStats] = useState({
    total_events: 0,
    completed_events: 0,
    upcoming_events: 0,
    overdue_events: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const statsData = await CalendarAPI.getCalendarStats()
      setStats(statsData)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch calendar statistics')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}

// Hook for upcoming deadlines
export const useUpcomingDeadlines = (days: number = 7) => {
  const [deadlines, setDeadlines] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDeadlines = useCallback(async () => {
    try {
      setLoading(true)
      const upcomingDeadlines = await CalendarAPI.getUpcomingDeadlines(days)
      setDeadlines(upcomingDeadlines)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch upcoming deadlines')
    } finally {
      setLoading(false)
    }
  }, [days])

  useEffect(() => {
    fetchDeadlines()
  }, [fetchDeadlines])

  return {
    deadlines,
    loading,
    error,
    refetch: fetchDeadlines,
  }
}

// Hook for overdue events
export const useOverdueEvents = () => {
  const [overdueEvents, setOverdueEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOverdueEvents = useCallback(async () => {
    try {
      setLoading(true)
      const overdue = await CalendarAPI.getOverdueEvents()
      setOverdueEvents(overdue)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch overdue events')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOverdueEvents()
  }, [fetchOverdueEvents])

  return {
    overdueEvents,
    loading,
    error,
    refetch: fetchOverdueEvents,
  }
}

// Hook for filtering and searching events
export const useEventFilters = (events: CalendarEvent[]) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(Object.values(EventType))
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>(['high', 'medium', 'low'])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])

  const filteredEvents = useCallback(() => {
    return events.filter(event => {
      // Search filter
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.assignee?.toLowerCase().includes(searchQuery.toLowerCase())

      // Type filter
      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(event.type)

      // Priority filter
      const matchesPriority = selectedPriorities.length === 0 || 
        !event.priority || 
        selectedPriorities.includes(event.priority)

      // Status filter
      const matchesStatus = selectedStatuses.length === 0 || 
        !event.status || 
        selectedStatuses.includes(event.status)

      return matchesSearch && matchesType && matchesPriority && matchesStatus
    })
  }, [events, searchQuery, selectedTypes, selectedPriorities, selectedStatuses])

  const toggleType = useCallback((type: EventType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }, [])

  const togglePriority = useCallback((priority: string) => {
    setSelectedPriorities(prev => 
      prev.includes(priority) 
        ? prev.filter(p => p !== priority)
        : [...prev, priority]
    )
  }, [])

  const toggleStatus = useCallback((status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }, [])

  const resetFilters = useCallback(() => {
    setSearchQuery('')
    setSelectedTypes(Object.values(EventType))
    setSelectedPriorities(['high', 'medium', 'low'])
    setSelectedStatuses([])
  }, [])

  return {
    filteredEvents: filteredEvents(),
    searchQuery,
    setSearchQuery,
    selectedTypes,
    selectedPriorities,
    selectedStatuses,
    toggleType,
    togglePriority,
    toggleStatus,
    resetFilters,
  }
}