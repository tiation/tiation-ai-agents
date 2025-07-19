import SwiftUI
import Combine

struct DashboardMetrics {
    let activeAgents: Int
    let completedTasks: Int
    let systemLoad: Int
    let errors: Int
}

struct PerformanceDataPoint: Identifiable {
    let id = UUID()
    let day: String
    let value: Double
}

@MainActor
class DashboardViewModel: ObservableObject {
    @Published var metrics = DashboardMetrics(
        activeAgents: 0,
        completedTasks: 0,
        systemLoad: 0,
        errors: 0
    )
    
    @Published var agents: [Agent] = []
    @Published var performanceData: [PerformanceDataPoint] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private var cancellables = Set<AnyCancellable>()
    
    init() {
        setupMockData()
    }
    
    func loadDashboardData() async {
        isLoading = true
        errorMessage = nil
        
        do {
            // Simulate network delay
            try await Task.sleep(nanoseconds: 1_000_000_000)
            
            // Update metrics with mock data
            metrics = DashboardMetrics(
                activeAgents: Int.random(in: 8...15),
                completedTasks: Int.random(in: 2500...3000),
                systemLoad: Int.random(in: 45...85),
                errors: Int.random(in: 0...5)
            )
            
            // Update agents data
            updateAgentsData()
            
            // Update performance data
            updatePerformanceData()
            
        } catch {
            errorMessage = "Failed to load dashboard data: \(error.localizedDescription)"
        }
        
        isLoading = false
    }
    
    private func setupMockData() {
        // Initialize with default data
        metrics = DashboardMetrics(
            activeAgents: 12,
            completedTasks: 2847,
            systemLoad: 67,
            errors: 2
        )
        
        agents = [
            Agent(
                name: "DataProcessor",
                type: "Analytics Agent",
                status: .running,
                cpuUsage: 45.2,
                memoryUsage: 67.8,
                lastActivity: "2m ago"
            ),
            Agent(
                name: "EmailBot",
                type: "Communication Agent",
                status: .warning,
                cpuUsage: 23.1,
                memoryUsage: 89.4,
                lastActivity: "12m ago"
            ),
            Agent(
                name: "SecurityGuard",
                type: "Security Agent",
                status: .running,
                cpuUsage: 31.7,
                memoryUsage: 52.1,
                lastActivity: "5m ago"
            ),
            Agent(
                name: "ReportGenerator",
                type: "Document Agent",
                status: .stopped,
                cpuUsage: 0.0,
                memoryUsage: 15.3,
                lastActivity: "1h ago"
            )
        ]
        
        performanceData = [
            PerformanceDataPoint(day: "Mon", value: 65),
            PerformanceDataPoint(day: "Tue", value: 78),
            PerformanceDataPoint(day: "Wed", value: 82),
            PerformanceDataPoint(day: "Thu", value: 75),
            PerformanceDataPoint(day: "Fri", value: 89),
            PerformanceDataPoint(day: "Sat", value: 94),
            PerformanceDataPoint(day: "Sun", value: 87)
        ]
    }
    
    private func updateAgentsData() {
        // Simulate dynamic agent status updates
        agents = agents.map { agent in
            let statuses: [AgentStatus] = [.running, .warning, .error, .stopped]
            let randomStatus = agent.status == .running ? 
                (Bool.random() ? .running : .warning) : 
                statuses.randomElement() ?? agent.status
            
            return Agent(
                name: agent.name,
                type: agent.type,
                status: randomStatus,
                cpuUsage: Double.random(in: 0...95),
                memoryUsage: Double.random(in: 10...95),
                lastActivity: [
                    "1m ago", "3m ago", "5m ago", "12m ago", 
                    "25m ago", "45m ago", "1h ago"
                ].randomElement() ?? agent.lastActivity
            )
        }
    }
    
    private func updatePerformanceData() {
        // Generate new performance data with some variation
        performanceData = [
            PerformanceDataPoint(day: "Mon", value: Double.random(in: 60...70)),
            PerformanceDataPoint(day: "Tue", value: Double.random(in: 70...85)),
            PerformanceDataPoint(day: "Wed", value: Double.random(in: 75...90)),
            PerformanceDataPoint(day: "Thu", value: Double.random(in: 65...80)),
            PerformanceDataPoint(day: "Fri", value: Double.random(in: 80...95)),
            PerformanceDataPoint(day: "Sat", value: Double.random(in: 85...100)),
            PerformanceDataPoint(day: "Sun", value: Double.random(in: 75...95))
        ]
    }
    
    func refreshAgent(_ agentId: UUID) {
        guard let index = agents.firstIndex(where: { $0.id == agentId }) else { return }
        
        let agent = agents[index]
        agents[index] = Agent(
            name: agent.name,
            type: agent.type,
            status: .running,
            cpuUsage: Double.random(in: 0...60),
            memoryUsage: Double.random(in: 20...70),
            lastActivity: "Just now"
        )
    }
    
    func stopAgent(_ agentId: UUID) {
        guard let index = agents.firstIndex(where: { $0.id == agentId }) else { return }
        
        let agent = agents[index]
        agents[index] = Agent(
            name: agent.name,
            type: agent.type,
            status: .stopped,
            cpuUsage: 0,
            memoryUsage: agent.memoryUsage * 0.1,
            lastActivity: "Just now"
        )
    }
    
    func startAgent(_ agentId: UUID) {
        guard let index = agents.firstIndex(where: { $0.id == agentId }) else { return }
        
        let agent = agents[index]
        agents[index] = Agent(
            name: agent.name,
            type: agent.type,
            status: .running,
            cpuUsage: Double.random(in: 20...50),
            memoryUsage: Double.random(in: 40...70),
            lastActivity: "Just now"
        )
    }
}
