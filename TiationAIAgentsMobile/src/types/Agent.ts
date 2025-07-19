export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  type: AgentType;
  metrics: AgentMetrics;
  configuration: AgentConfiguration;
}

export enum AgentStatus {
  Active = 'active',
  Inactive = 'inactive',
  Error = 'error',
  Processing = 'processing',
}

export enum AgentType {
  Assistant = 'assistant',
  Counselor = 'counselor',
  Analyst = 'analyst',
  Supervisor = 'supervisor',
}

export interface AgentMetrics {
  completedTasks: number;
  successRate: number;
  averageResponseTime: number; // in milliseconds
  uptime: number; // in milliseconds
}

export interface AgentConfiguration {
  maxConcurrentTasks: number;
  timeout: number; // in milliseconds
  retryAttempts: number;
  allowedActions: string[];
}
