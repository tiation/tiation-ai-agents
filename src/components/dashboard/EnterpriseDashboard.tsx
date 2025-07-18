import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Bot, 
  TrendingUp, 
  Shield, 
  Settings, 
  Monitor,
  Users,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface AgentMetrics {
  activeAgents: number;
  totalRequests: number;
  successRate: number;
  averageResponseTime: number;
  systemHealth: 'healthy' | 'warning' | 'error';
}

interface AgentStatus {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'idle' | 'error';
  uptime: string;
  requests: number;
  lastActivity: string;
}

const EnterpriseDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AgentMetrics>({
    activeAgents: 0,
    totalRequests: 0,
    successRate: 0,
    averageResponseTime: 0,
    systemHealth: 'healthy'
  });

  const [agents, setAgents] = useState<AgentStatus[]>([]);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        activeAgents: Math.floor(Math.random() * 50) + 20,
        totalRequests: Math.floor(Math.random() * 10000) + 50000,
        successRate: Math.floor(Math.random() * 10) + 90,
        averageResponseTime: Math.floor(Math.random() * 200) + 100,
        systemHealth: Math.random() > 0.8 ? 'warning' : 'healthy'
      }));

      // Update agent data
      const sampleAgents: AgentStatus[] = [
        {
          id: '1',
          name: 'DocumentProcessor',
          type: 'NLP',
          status: 'active',
          uptime: '99.9%',
          requests: 1234,
          lastActivity: '2 min ago'
        },
        {
          id: '2',
          name: 'CustomerService',
          type: 'Chatbot',
          status: 'active',
          uptime: '98.7%',
          requests: 892,
          lastActivity: '1 min ago'
        },
        {
          id: '3',
          name: 'DataAnalytics',
          type: 'Analytics',
          status: 'idle',
          uptime: '99.5%',
          requests: 567,
          lastActivity: '15 min ago'
        }
      ];
      setAgents(sampleAgents);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'idle': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-sm border-b border-cyan-500/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-cyan-500 to-magenta-500 p-2 rounded-lg">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent">
                  Tiation AI Agents
                </h1>
                <p className="text-gray-400">Enterprise Automation Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${getHealthColor(metrics.systemHealth)}`}>
                <Monitor className="w-5 h-5" />
                <span className="font-semibold capitalize">{metrics.systemHealth}</span>
              </div>
              <Settings className="w-6 h-6 text-gray-400 hover:text-cyan-400 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-cyan-500/10">
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8">
            {['overview', 'agents', 'analytics', 'integrations'].map((view) => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  selectedView === view
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-gray-400 hover:text-cyan-400'
                }`}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Agents</p>
                    <p className="text-3xl font-bold text-cyan-400">{metrics.activeAgents}</p>
                  </div>
                  <Activity className="w-8 h-8 text-cyan-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-magenta-500/20 hover:border-magenta-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Requests</p>
                    <p className="text-3xl font-bold text-magenta-400">{metrics.totalRequests.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-magenta-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-green-500/20 hover:border-green-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Success Rate</p>
                    <p className="text-3xl font-bold text-green-400">{metrics.successRate}%</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/20 hover:border-yellow-500/40 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg Response</p>
                    <p className="text-3xl font-bold text-yellow-400">{metrics.averageResponseTime}ms</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Agent Status Table */}
            <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-cyan-500/20">
              <div className="p-6 border-b border-cyan-500/20">
                <h2 className="text-xl font-semibold text-cyan-400">Active Agents</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-cyan-500/20">
                      <th className="text-left p-4 text-gray-400">Agent</th>
                      <th className="text-left p-4 text-gray-400">Type</th>
                      <th className="text-left p-4 text-gray-400">Status</th>
                      <th className="text-left p-4 text-gray-400">Uptime</th>
                      <th className="text-left p-4 text-gray-400">Requests</th>
                      <th className="text-left p-4 text-gray-400">Last Activity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent) => (
                      <tr key={agent.id} className="border-b border-cyan-500/10 hover:bg-cyan-500/5">
                        <td className="p-4 font-medium text-white">{agent.name}</td>
                        <td className="p-4 text-gray-400">{agent.type}</td>
                        <td className="p-4">
                          <span className={`${getStatusColor(agent.status)} font-medium`}>
                            {agent.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{agent.uptime}</td>
                        <td className="p-4 text-gray-400">{agent.requests}</td>
                        <td className="p-4 text-gray-400">{agent.lastActivity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-cyan-500/20">
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Quick Deploy</h3>
                <p className="text-gray-400 mb-4">Deploy a new AI agent instantly</p>
                <button className="bg-gradient-to-r from-cyan-500 to-magenta-500 text-white px-4 py-2 rounded-lg hover:from-cyan-600 hover:to-magenta-600 transition-colors">
                  Deploy Agent
                </button>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-magenta-500/20">
                <h3 className="text-lg font-semibold text-magenta-400 mb-4">System Health</h3>
                <p className="text-gray-400 mb-4">Monitor system performance</p>
                <button className="bg-gradient-to-r from-magenta-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-magenta-600 hover:to-cyan-600 transition-colors">
                  View Details
                </button>
              </div>

              <div className="bg-black/40 backdrop-blur-sm rounded-lg p-6 border border-green-500/20">
                <h3 className="text-lg font-semibold text-green-400 mb-4">Integration</h3>
                <p className="text-gray-400 mb-4">Connect to Liberation System</p>
                <button className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-cyan-600 transition-colors">
                  Configure
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnterpriseDashboard;
