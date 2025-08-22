

import { api } from '@/lib/api/config'
import { Task, TaskStatus, TaskPriority, TaskType } from "./tasks"

export interface CalendarEvent {
  id: string
  title: string
  start: Date
  end: Date
  type: EventType
  description?: string
  priority?: TaskPriority
  status?: TaskStatus | EventStatus
  assignee?: string
  progress?: number
  tags: string[]
  allDay?: boolean
  recurring?: boolean
  location?: string
  attendees?: string[]
  project_id?: string
  task_id?: string
  okr_id?: string
}

export enum EventType {
  TASK = "task",
  MEETING = "meeting",
  DEADLINE = "deadline",
  CALL = "call",
  HOLIDAY = "holiday",
  GOAL = "goal",
  PROJECT_MILESTONE = "milestone"
}

export enum EventStatus {
  SCHEDULED = "scheduled",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled"
}

export interface CreateEventRequest {
  title: string
  start: string
  end: string
  type: EventType
  description?: string
  priority?: TaskPriority
  assignee?: string
  location?: string
  attendees?: string[]
  project_id?: string
  allDay?: boolean
  recurring?: boolean
}

export interface UpdateEventRequest extends Partial<CreateEventRequest> {
  status?: EventStatus
  progress?: number
}

export interface OKREvent {
  id: string
  title: string
  description?: string
  status: string
  timeframe: string
  owner_id: string
  target_date?: string
  progress: number
  created_at: string
  updated_at: string
}

export interface Meeting {
  id: string
  title: string
  description?: string
  start_time: string
  end_time: string
  location?: string
  attendees: string[]
  organizer_id: string
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  created_at: string
}

export class CalendarAPI {
  static async getEvents(startDate?: Date, endDate?: Date): Promise<CalendarEvent[]> {
    const events: CalendarEvent[] = []

    try {
      const tasksResponse = await api.get('tasks/')
      const tasks: Task[] = tasksResponse.data

      const taskEvents: CalendarEvent[] = tasks
        .filter(task => task.due_date)
        .map(task => ({
          id: `task-${task.id}`,
          title: task.title,
          start: new Date(task.due_date!),
          end: new Date(task.due_date!),
          type: EventType.TASK,
          description: task.description,
          priority: task.priority,
          status: task.status,
          assignee: task.assigned_to,
          progress: this.calculateTaskProgress(task),
          tags: [task.priority, task.type, task.status].filter(Boolean) as string[],
          allDay: true,
          task_id: task.id,
          project_id: task.project_id
        }))

      events.push(...taskEvents)
    } catch (error) {
      console.error('Failed to fetch tasks for calendar:', error)
    }

    try {
      const okrsResponse = await api.get('okrs/')
      const okrs: OKREvent[] = okrsResponse.data

      const okrEvents: CalendarEvent[] = okrs
        .filter(okr => okr.target_date)
        .map(okr => ({
          id: `okr-${okr.id}`,
          title: `🌟 ${okr.title}`,
          start: new Date(okr.target_date!),
          end: new Date(okr.target_date!),
          type: EventType.GOAL,
          description: okr.description,
          progress: okr.progress,
          status: okr.status as EventStatus,
          tags: [okr.timeframe, okr.status],
          allDay: true,
          okr_id: okr.id
        }))

      events.push(...okrEvents)
    } catch (error) {
      console.error('Failed to fetch OKRs for calendar:', error)
    }

    try {
      const projectsResponse = await api.get('projects/')
      const projects = projectsResponse.data

      const milestoneEvents: CalendarEvent[] = projects
        .filter((project: any) => project.end_date)
        .map((project: any) => ({
          id: `project-${project.id}`,
          title: `📄 ${project.name} Deadline`,
          start: new Date(project.end_date),
          end: new Date(project.end_date),
          type: EventType.PROJECT_MILESTONE,
          description: project.description,
          priority: project.priority,
          status: project.status,
          tags: [project.status, project.priority],
          allDay: true,
          project_id: project.id
        }))

      events.push(...milestoneEvents)
    } catch (error) {
      console.error('Failed to fetch projects for calendar:', error)
    }

    if (startDate && endDate) {
      return events.filter(event => 
        event.start >= startDate && event.start <= endDate
      )
    }

    return events
  }

  static async createEvent(eventData: CreateEventRequest): Promise<CalendarEvent> {
    if (eventData.type === EventType.TASK) {
      const taskResponse = await api.post('tasks/', {
        title: eventData.title,
        description: eventData.description,
        priority: eventData.priority || TaskPriority.MEDIUM,
        type: TaskType.FEATURE,
        due_date: eventData.end,
        assigned_to: eventData.assignee,
        project_id: eventData.project_id
      })

      const task = taskResponse.data
      return {
        id: `task-${task.id}`,
        title: task.title,
        start: new Date(eventData.start),
        end: new Date(eventData.end),
        type: EventType.TASK,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assigned_to,
        progress: 0,
        tags: [task.priority, task.type, task.status],
        allDay: eventData.allDay || false,
        task_id: task.id,
        project_id: task.project_id
      }
    }
    throw new Error('Creating non-task events not yet implemented')
  }

  static async updateEvent(eventId: string, updates: UpdateEventRequest): Promise<CalendarEvent> {
    const [type, id] = eventId.split('-')

    if (type === 'task') {
      const taskResponse = await api.patch(`tasks/${id}`, {
        title: updates.title,
        description: updates.description,
        priority: updates.priority,
        due_date: updates.end,
        assigned_to: updates.assignee
      })

      const task = taskResponse.data
      return {
        id: eventId,
        title: task.title,
        start: new Date(updates.start!),
        end: new Date(updates.end!),
        type: EventType.TASK,
        description: task.description,
        priority: task.priority,
        status: task.status,
        assignee: task.assigned_to,
        progress: this.calculateTaskProgress(task),
        tags: [task.priority, task.type, task.status],
        task_id: task.id,
        project_id: task.project_id
      }
    }

    throw new Error('Updating non-task events not yet implemented')
  }

  static async deleteEvent(eventId: string): Promise<void> {
    const [type, id] = eventId.split('-')

    if (type === 'task') {
      await api.delete(`tasks/${id}`)
      return
    }

    throw new Error('Deleting non-task events not yet implemented')
  }

  static async updateEventStatus(eventId: string, status: EventStatus): Promise<void> {
    const [type, id] = eventId.split('-')

    if (type === 'task') {
      const taskStatus = status === EventStatus.COMPLETED ? TaskStatus.DONE : 
                        status === EventStatus.IN_PROGRESS ? TaskStatus.IN_PROGRESS :
                        TaskStatus.TODO

      await api.patch(`tasks/${id}/status`, { status: taskStatus })
      return
    }

    throw new Error('Updating status for non-task events not yet implemented')
  }

  static async getCalendarStats(): Promise<{
    total_events: number
    completed_events: number
    upcoming_events: number
    overdue_events: number
  }> {
    const events = await this.getEvents()
    const now = new Date()

    return {
      total_events: events.length,
      completed_events: events.filter(e => 
        e.status === TaskStatus.DONE || e.status === EventStatus.COMPLETED
      ).length,
      upcoming_events: events.filter(e => e.start > now).length,
      overdue_events: events.filter(e => 
        e.start < now && 
        e.status !== TaskStatus.DONE && 
        e.status !== EventStatus.COMPLETED
      ).length
    }
  }

  private static calculateTaskProgress(task: Task): number {
    const { status, estimated_hours, actual_hours } = task

    // Hard stops first
    if (status === TaskStatus.DONE) return 100
    if (status === TaskStatus.CANCELLED) return 0

    // If time tracking is available, use it
    if (estimated_hours && actual_hours) {
      const pct = (actual_hours / estimated_hours) * 100
      return Math.min(Math.max(Math.round(pct), 0), 100)
    }

    // Fallback heuristic by status — note: DON'T include DONE here,
    // it is handled above; otherwise TS narrows the union and complains.
    switch (status) {
      case TaskStatus.TODO:
        return 0
      case TaskStatus.IN_PROGRESS:
        return 50
      case TaskStatus.REVIEW:
        return 80
      default:
        return 0
    }
  }

  static async getUpcomingDeadlines(days: number = 7): Promise<CalendarEvent[]> {
    const events = await this.getEvents()
    const now = new Date()
    const futureDate = new Date()
    futureDate.setDate(now.getDate() + days)

    return events.filter(event => 
      event.start >= now && 
      event.start <= futureDate &&
      (event.type === EventType.TASK || event.type === EventType.DEADLINE)
    ).sort((a, b) => a.start.getTime() - b.start.getTime())
  }

  static async getOverdueEvents(): Promise<CalendarEvent[]> {
    const events = await this.getEvents()
    const now = new Date()

    return events.filter(event => 
      event.start < now &&
      event.status !== TaskStatus.DONE &&
      event.status !== EventStatus.COMPLETED
    ).sort((a, b) => a.start.getTime() - b.start.getTime())
  }
}