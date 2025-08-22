export interface Task {
  id: string
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  assignee: string
  deadline: string
  status: "backlog" | "todo" | "inprogress" | "review" | "done"
  progress: number
  okrObjective?: string
  okrKeyResult?: string
}