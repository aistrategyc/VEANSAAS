import { getAuthToken } from "@/lib/auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class CRMApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message)
    this.name = 'CRMApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const url = `${API_BASE_URL}/api/v1${endpoint}`
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  })

  if (!response.ok) {
    let errorData
    try {
      errorData = await response.json()
    } catch {
      errorData = { message: response.statusText }
    }
    
    throw new CRMApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData
    )
  }

  return response.json()
}

// Studios API
export const studiosApi = {
  create: async (studioData: any) => {
    return apiRequest('/studios', {
      method: 'POST',
      body: JSON.stringify(studioData),
    })
  },
  
  list: async () => {
    return apiRequest('/studios')
  },
  
  get: async (id: string) => {
    return apiRequest(`/studios/${id}`)
  },
  
  update: async (id: string, studioData: any) => {
    return apiRequest(`/studios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studioData),
    })
  }
}

// Clients API
export const clientsApi = {
  create: async (clientData: any) => {
    return apiRequest('/clients_crm', {
      method: 'POST',
      body: JSON.stringify(clientData),
    })
  },
  
  list: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/clients_crm?${searchParams}`)
  },
  
  get: async (id: string) => {
    return apiRequest(`/clients_crm/${id}`)
  },
  
  update: async (id: string, clientData: any) => {
    return apiRequest(`/clients_crm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(clientData),
    })
  },
  
  delete: async (id: string) => {
    return apiRequest(`/clients_crm/${id}`, {
      method: 'DELETE',
    })
  }
}

// Appointments API  
export const appointmentsApi = {
  create: async (appointmentData: any) => {
    return apiRequest('/appointments_crm', {
      method: 'POST',
      body: JSON.stringify(appointmentData),
    })
  },
  
  list: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/appointments_crm?${searchParams}`)
  },
  
  get: async (id: string) => {
    return apiRequest(`/appointments_crm/${id}`)
  },
  
  update: async (id: string, appointmentData: any) => {
    return apiRequest(`/appointments_crm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(appointmentData),
    })
  },
  
  updateStatus: async (id: string, status: string) => {
    return apiRequest(`/appointments_crm/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },
  
  delete: async (id: string) => {
    return apiRequest(`/appointments_crm/${id}`, {
      method: 'DELETE',
    })
  }
}

// Services API
export const servicesApi = {
  create: async (serviceData: any) => {
    return apiRequest('/services_crm', {
      method: 'POST',
      body: JSON.stringify(serviceData),
    })
  },
  
  list: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/services_crm?${searchParams}`)
  },
  
  get: async (id: string) => {
    return apiRequest(`/services_crm/${id}`)
  },
  
  update: async (id: string, serviceData: any) => {
    return apiRequest(`/services_crm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(serviceData),
    })
  },
  
  delete: async (id: string) => {
    return apiRequest(`/services_crm/${id}`, {
      method: 'DELETE',
    })
  }
}

// Employees API
export const employeesApi = {
  create: async (employeeData: any) => {
    return apiRequest('/employees_crm', {
      method: 'POST',
      body: JSON.stringify(employeeData),
    })
  },
  
  list: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/employees_crm?${searchParams}`)
  },
  
  get: async (id: string) => {
    return apiRequest(`/employees_crm/${id}`)
  },
  
  update: async (id: string, employeeData: any) => {
    return apiRequest(`/employees_crm/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employeeData),
    })
  },
  
  delete: async (id: string) => {
    return apiRequest(`/employees_crm/${id}`, {
      method: 'DELETE',
    })
  }
}

// Transactions API
export const transactionsApi = {
  create: async (transactionData: any) => {
    return apiRequest('/transactions_crm', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    })
  },
  
  list: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/transactions_crm?${searchParams}`)
  },
  
  get: async (id: string) => {
    return apiRequest(`/transactions_crm/${id}`)
  }
}

// Dashboard/Analytics API
export const analyticsApi = {
  getDashboardStats: async () => {
    return apiRequest('/analytics/dashboard')
  },
  
  getRevenueReport: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/analytics/revenue?${searchParams}`)
  },
  
  getClientStats: async (params: any = {}) => {
    const searchParams = new URLSearchParams(params)
    return apiRequest(`/analytics/clients?${searchParams}`)
  }
}

export { CRMApiError }