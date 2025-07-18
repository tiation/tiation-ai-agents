import { EventEmitter } from 'events';
import WebSocket from 'ws';

interface AgentMetrics {
  agentId: string;
  timestamp: number;
  cpu: number;
  memory: number;
  network: number;
  requests: number;
  errors: number;
  responseTime: number;
  status: 'active' | 'idle' | 'error' | 'maintenance';
}

interface SystemMetrics {
  timestamp: number;
  totalAgents: number;
  activeAgents: number;
  systemCpu: number;
  systemMemory: number;
  networkThroughput: number;
  errorRate: number;
  averageResponseTime: number;
}

interface Alert {
  id: string;
  type: 'performance' | 'error' | 'security' | 'resource';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  agentId?: string;
  resolved: boolean;
}

class MonitoringService extends EventEmitter {
  private agents: Map<string, AgentMetrics> = new Map();
  private systemMetrics: SystemMetrics[] = [];
  private alerts: Map<string, Alert> = new Map();
  private wsServer: WebSocket.Server | null = null;
  private metricsInterval: NodeJS.Timeout | null = null;
  private alertThresholds = {
    cpu: 80,
    memory: 85,
    errorRate: 5,
    responseTime: 2000
  };

  constructor(private port: number = 8080) {
    super();
    this.initializeWebSocketServer();
    this.startMetricsCollection();
  }

  private initializeWebSocketServer(): void {
    this.wsServer = new WebSocket.Server({ port: this.port });
    
    this.wsServer.on('connection', (ws) => {
      console.log('📡 New monitoring client connected');
      
      // Send initial data to new client
      ws.send(JSON.stringify({
        type: 'initial_data',
        agents: Array.from(this.agents.values()),
        systemMetrics: this.systemMetrics.slice(-50), // Last 50 data points
        alerts: Array.from(this.alerts.values())
      }));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleClientMessage(ws, data);
        } catch (error) {
          console.error('Invalid message from client:', error);
        }
      });

      ws.on('close', () => {
        console.log('📡 Monitoring client disconnected');
      });
    });

    console.log(`📊 Monitoring WebSocket server started on port ${this.port}`);
  }

  private handleClientMessage(ws: WebSocket, data: any): void {
    switch (data.type) {
      case 'subscribe_agent':
        // Handle agent-specific subscriptions
        this.emit('client:subscribe', { agentId: data.agentId, client: ws });
        break;
      case 'get_agent_history':
        this.sendAgentHistory(ws, data.agentId);
        break;
      case 'acknowledge_alert':
        this.acknowledgeAlert(data.alertId);
        break;
      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.collectSystemMetrics();
      this.checkAlerts();
      this.broadcastMetrics();
    }, 5000); // Collect metrics every 5 seconds
  }

  private collectSystemMetrics(): void {
    const currentTime = Date.now();
    const activeAgents = Array.from(this.agents.values()).filter(a => a.status === 'active');
    
    // Generate realistic system metrics
    const systemMetrics: SystemMetrics = {
      timestamp: currentTime,
      totalAgents: this.agents.size,
      activeAgents: activeAgents.length,
      systemCpu: Math.random() * 100,
      systemMemory: Math.random() * 100,
      networkThroughput: Math.random() * 1000,
      errorRate: Math.random() * 10,
      averageResponseTime: Math.random() * 500 + 100
    };

    this.systemMetrics.push(systemMetrics);
    
    // Keep only last 1000 data points
    if (this.systemMetrics.length > 1000) {
      this.systemMetrics.shift();
    }

    // Update individual agent metrics
    this.updateAgentMetrics(currentTime);
  }

  private updateAgentMetrics(timestamp: number): void {
    this.agents.forEach((agent, agentId) => {
      const updatedMetrics: AgentMetrics = {
        ...agent,
        timestamp,
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        network: Math.random() * 100,
        requests: agent.requests + Math.floor(Math.random() * 10),
        errors: agent.errors + (Math.random() < 0.1 ? 1 : 0),
        responseTime: Math.random() * 300 + 50
      };

      this.agents.set(agentId, updatedMetrics);
    });
  }

  private checkAlerts(): void {
    // Check system-wide alerts
    const latestSystemMetrics = this.systemMetrics[this.systemMetrics.length - 1];
    if (latestSystemMetrics) {
      this.checkSystemAlerts(latestSystemMetrics);
    }

    // Check agent-specific alerts
    this.agents.forEach(agent => {
      this.checkAgentAlerts(agent);
    });
  }

  private checkSystemAlerts(metrics: SystemMetrics): void {
    if (metrics.systemCpu > this.alertThresholds.cpu) {
      this.createAlert({
        type: 'performance',
        severity: 'high',
        message: `High system CPU usage: ${metrics.systemCpu.toFixed(1)}%`,
        timestamp: Date.now()
      });
    }

    if (metrics.systemMemory > this.alertThresholds.memory) {
      this.createAlert({
        type: 'resource',
        severity: 'high',
        message: `High system memory usage: ${metrics.systemMemory.toFixed(1)}%`,
        timestamp: Date.now()
      });
    }

    if (metrics.errorRate > this.alertThresholds.errorRate) {
      this.createAlert({
        type: 'error',
        severity: 'critical',
        message: `High error rate: ${metrics.errorRate.toFixed(1)}%`,
        timestamp: Date.now()
      });
    }
  }

  private checkAgentAlerts(agent: AgentMetrics): void {
    if (agent.cpu > this.alertThresholds.cpu) {
      this.createAlert({
        type: 'performance',
        severity: 'medium',
        message: `Agent ${agent.agentId} high CPU: ${agent.cpu.toFixed(1)}%`,
        timestamp: Date.now(),
        agentId: agent.agentId
      });
    }

    if (agent.responseTime > this.alertThresholds.responseTime) {
      this.createAlert({
        type: 'performance',
        severity: 'medium',
        message: `Agent ${agent.agentId} slow response: ${agent.responseTime.toFixed(0)}ms`,
        timestamp: Date.now(),
        agentId: agent.agentId
      });
    }

    if (agent.status === 'error') {
      this.createAlert({
        type: 'error',
        severity: 'high',
        message: `Agent ${agent.agentId} is in error state`,
        timestamp: Date.now(),
        agentId: agent.agentId
      });
    }
  }

  private createAlert(alertData: Omit<Alert, 'id' | 'resolved'>): void {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;\n    const alert: Alert = {\n      id: alertId,\n      ...alertData,\n      resolved: false\n    };\n\n    this.alerts.set(alertId, alert);\n    this.broadcastAlert(alert);\n    this.emit('alert:created', alert);\n  }\n\n  private broadcastMetrics(): void {\n    if (!this.wsServer) return;\n\n    const data = {\n      type: 'metrics_update',\n      timestamp: Date.now(),\n      agents: Array.from(this.agents.values()),\n      systemMetrics: this.systemMetrics.slice(-1)[0], // Latest system metrics\n      alerts: Array.from(this.alerts.values()).filter(a => !a.resolved)\n    };\n\n    this.wsServer.clients.forEach(client => {\n      if (client.readyState === WebSocket.OPEN) {\n        client.send(JSON.stringify(data));\n      }\n    });\n  }\n\n  private broadcastAlert(alert: Alert): void {\n    if (!this.wsServer) return;\n\n    const data = {\n      type: 'new_alert',\n      alert\n    };\n\n    this.wsServer.clients.forEach(client => {\n      if (client.readyState === WebSocket.OPEN) {\n        client.send(JSON.stringify(data));\n      }\n    });\n  }\n\n  private sendAgentHistory(ws: WebSocket, agentId: string): void {\n    const agent = this.agents.get(agentId);\n    if (!agent) {\n      ws.send(JSON.stringify({\n        type: 'error',\n        message: `Agent ${agentId} not found`\n      }));\n      return;\n    }\n\n    // In a real implementation, this would query a database\n    const history = this.generateAgentHistory(agentId);\n    \n    ws.send(JSON.stringify({\n      type: 'agent_history',\n      agentId,\n      history\n    }));\n  }\n\n  private generateAgentHistory(agentId: string): AgentMetrics[] {\n    const history: AgentMetrics[] = [];\n    const now = Date.now();\n    \n    for (let i = 0; i < 100; i++) {\n      history.push({\n        agentId,\n        timestamp: now - (i * 60000), // 1 minute intervals\n        cpu: Math.random() * 100,\n        memory: Math.random() * 100,\n        network: Math.random() * 100,\n        requests: Math.floor(Math.random() * 100),\n        errors: Math.floor(Math.random() * 5),\n        responseTime: Math.random() * 500 + 100,\n        status: Math.random() > 0.1 ? 'active' : 'idle'\n      });\n    }\n\n    return history.reverse();\n  }\n\n  private acknowledgeAlert(alertId: string): void {\n    const alert = this.alerts.get(alertId);\n    if (alert) {\n      alert.resolved = true;\n      this.alerts.set(alertId, alert);\n      this.emit('alert:acknowledged', alert);\n    }\n  }\n\n  // Public API methods\n  public registerAgent(agentId: string, initialMetrics?: Partial<AgentMetrics>): void {\n    const metrics: AgentMetrics = {\n      agentId,\n      timestamp: Date.now(),\n      cpu: 0,\n      memory: 0,\n      network: 0,\n      requests: 0,\n      errors: 0,\n      responseTime: 0,\n      status: 'active',\n      ...initialMetrics\n    };\n\n    this.agents.set(agentId, metrics);\n    console.log(`📊 Agent registered for monitoring: ${agentId}`);\n    this.emit('agent:registered', metrics);\n  }\n\n  public unregisterAgent(agentId: string): void {\n    if (this.agents.has(agentId)) {\n      this.agents.delete(agentId);\n      console.log(`📊 Agent unregistered from monitoring: ${agentId}`);\n      this.emit('agent:unregistered', { agentId });\n    }\n  }\n\n  public updateAgentStatus(agentId: string, status: AgentMetrics['status']): void {\n    const agent = this.agents.get(agentId);\n    if (agent) {\n      agent.status = status;\n      agent.timestamp = Date.now();\n      this.agents.set(agentId, agent);\n      this.emit('agent:status_updated', { agentId, status });\n    }\n  }\n\n  public getAgentMetrics(agentId: string): AgentMetrics | null {\n    return this.agents.get(agentId) || null;\n  }\n\n  public getSystemMetrics(): SystemMetrics[] {\n    return this.systemMetrics;\n  }\n\n  public getAlerts(): Alert[] {\n    return Array.from(this.alerts.values());\n  }\n\n  public setAlertThresholds(thresholds: Partial<typeof this.alertThresholds>): void {\n    this.alertThresholds = { ...this.alertThresholds, ...thresholds };\n    console.log('🔔 Alert thresholds updated:', this.alertThresholds);\n  }\n\n  public shutdown(): void {\n    if (this.metricsInterval) {\n      clearInterval(this.metricsInterval);\n      this.metricsInterval = null;\n    }\n\n    if (this.wsServer) {\n      this.wsServer.close();\n      this.wsServer = null;\n    }\n\n    console.log('📊 Monitoring service shutdown');\n    this.emit('service:shutdown');\n  }\n}\n\nexport default MonitoringService;\nexport { AgentMetrics, SystemMetrics, Alert };"}}]}
