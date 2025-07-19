import Foundation

struct Agent: Identifiable, Codable {
    let id: UUID
    var name: String
    var status: AgentStatus
    var type: AgentType
    var metrics: AgentMetrics
    var configuration: AgentConfiguration
    
    init(id: UUID = UUID(), name: String, status: AgentStatus = .inactive, type: AgentType, metrics: AgentMetrics = AgentMetrics(), configuration: AgentConfiguration = AgentConfiguration()) {
        self.id = id
        self.name = name
        self.status = status
        self.type = type
        self.metrics = metrics
        self.configuration = configuration
    }
}

enum AgentStatus: String, Codable {
    case active
    case inactive
    case error
    case processing
}

enum AgentType: String, Codable {
    case assistant
    case counselor
    case analyst
    case supervisor
}

struct AgentMetrics: Codable {
    var completedTasks: Int = 0
    var successRate: Double = 0.0
    var averageResponseTime: TimeInterval = 0
    var uptime: TimeInterval = 0
}

struct AgentConfiguration: Codable {
    var maxConcurrentTasks: Int = 1
    var timeout: TimeInterval = 300 // 5 minutes
    var retryAttempts: Int = 3
    var allowedActions: [String] = []
}
