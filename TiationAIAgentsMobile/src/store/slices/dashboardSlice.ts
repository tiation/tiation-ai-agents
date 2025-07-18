import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Agent {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'error' | 'warning';
  uptime: number;
  tasksCompleted: number;
  cpuUsage: number;
  memoryUsage: number;
  lastActivity: string;
  type: string;
  description: string;
}

export interface DashboardMetrics {
  activeAgents: number;
  completedTasks: number;
  systemLoad: number;
  errors: number;
  totalRevenue: number;
  avgResponseTime: number;
}

interface DashboardState {
  metrics: DashboardMetrics | null;
  agents: Agent[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: DashboardState = {
  metrics: null,
  agents: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Mock API call - replace with actual API integration
export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockMetrics: DashboardMetrics = {
      activeAgents: 12,
      completedTasks: 1847,
      systemLoad: 67,
      errors: 3,
      totalRevenue: 24750,
      avgResponseTime: 1.2,
    };

    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'DataProcessor',
        status: 'running',
        uptime: 86400,
        tasksCompleted: 342,
        cpuUsage: 45,
        memoryUsage: 67,
        lastActivity: '2 minutes ago',
        type: 'Data Processing',
        description: 'Processes customer data and generates insights',
      },
      {
        id: '2',
        name: 'EmailBot',
        status: 'warning',
        uptime: 43200,
        tasksCompleted: 156,
        cpuUsage: 23,
        memoryUsage: 89,
        lastActivity: '5 minutes ago',
        type: 'Communication',
        description: 'Handles automated email responses',
      },
      {
        id: '3',
        name: 'ReportGenerator',
        status: 'running',
        uptime: 172800,
        tasksCompleted: 87,
        cpuUsage: 12,
        memoryUsage: 34,
        lastActivity: '1 minute ago',
        type: 'Analytics',
        description: 'Generates automated reports and dashboards',
      },
      {
        id: '4',
        name: 'SecurityMonitor',
        status: 'running',
        uptime: 259200,
        tasksCompleted: 1024,
        cpuUsage: 8,
        memoryUsage: 23,
        lastActivity: '30 seconds ago',
        type: 'Security',
        description: 'Monitors system security and compliance',
      },
    ];

    return {
      metrics: mockMetrics,
      agents: mockAgents,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    updateMetrics: (state, action: PayloadAction<DashboardMetrics>) => {
      state.metrics = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    updateAgentStatus: (state, action: PayloadAction<{ agentId: string; status: Agent['status'] }>) => {
      const agent = state.agents.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.metrics = action.payload.metrics;
        state.agents = action.payload.agents;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export const { clearError, updateMetrics, updateAgentStatus } = dashboardSlice.actions;
export default dashboardSlice.reducer;
