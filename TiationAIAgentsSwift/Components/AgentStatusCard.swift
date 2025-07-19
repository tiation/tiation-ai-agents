import SwiftUI

enum AgentStatus: String, CaseIterable {
    case running = "Running"
    case warning = "Warning"
    case error = "Error"
    case stopped = "Stopped"
    
    var color: Color {
        switch self {
        case .running:
            return TiationColors.accentGreen
        case .warning:
            return TiationColors.accentYellow
        case .error:
            return TiationColors.accentRed
        case .stopped:
            return TiationColors.textSecondary
        }
    }
    
    var icon: String {
        switch self {
        case .running:
            return "checkmark.circle.fill"
        case .warning:
            return "exclamationmark.triangle.fill"
        case .error:
            return "xmark.circle.fill"
        case .stopped:
            return "pause.circle.fill"
        }
    }
}

struct Agent: Identifiable {
    let id = UUID()
    let name: String
    let type: String
    let status: AgentStatus
    let cpuUsage: Double
    let memoryUsage: Double
    let lastActivity: String
}

struct AgentStatusCard: View {
    let agent: Agent
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .fill(TiationColors.gradientCard)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(TiationColors.borderTertiary, lineWidth: 1)
                )
                .tiationNeonShadow()
            
            VStack(spacing: 16) {
                headerSection
                progressSection
                footerSection
            }
            .padding(16)
        }
    }
    
    private var headerSection: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(agent.name)
                    .font(.headline)
                    .fontWeight(.semibold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Text(agent.type)
                    .font(.subheadline)
                    .foregroundColor(TiationColors.textSecondary)
            }
            
            Spacer()
            
            HStack(spacing: 6) {
                Image(systemName: agent.status.icon)
                    .font(.subheadline)
                    .foregroundColor(agent.status.color)
                
                Text(agent.status.rawValue)
                    .font(.subheadline)
                    .fontWeight(.medium)
                    .foregroundColor(agent.status.color)
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 6)
            .background(
                Capsule()
                    .fill(agent.status.color.opacity(0.15))
                    .overlay(
                        Capsule()
                            .stroke(agent.status.color.opacity(0.3), lineWidth: 1)
                    )
            )
        }
    }
    
    private var progressSection: some View {
        VStack(spacing: 12) {
            ProgressRow(
                title: "CPU Usage",
                value: agent.cpuUsage,
                color: cpuColor,
                icon: "cpu"
            )
            
            ProgressRow(
                title: "Memory Usage",
                value: agent.memoryUsage,
                color: memoryColor,
                icon: "memorychip"
            )
        }
    }
    
    private var footerSection: some View {
        HStack {
            HStack(spacing: 6) {
                Image(systemName: "clock")
                    .font(.caption)
                    .foregroundColor(TiationColors.textSecondary)
                
                Text("Last activity: \(agent.lastActivity)")
                    .font(.caption)
                    .foregroundColor(TiationColors.textSecondary)
            }
            
            Spacer()
            
            Button(action: {
                // Handle agent control actions
            }) {
                Image(systemName: "ellipsis")
                    .font(.caption)
                    .foregroundColor(TiationColors.primaryCyan)
                    .padding(6)
                    .background(
                        Circle()
                            .fill(TiationColors.primaryCyan.opacity(0.1))
                    )
            }
        }
    }
    
    private var cpuColor: Color {
        switch agent.cpuUsage {
        case 0..<50:
            return TiationColors.accentGreen
        case 50..<80:
            return TiationColors.accentYellow
        default:
            return TiationColors.accentRed
        }
    }
    
    private var memoryColor: Color {
        switch agent.memoryUsage {
        case 0..<60:
            return TiationColors.accentGreen
        case 60..<85:
            return TiationColors.accentYellow
        default:
            return TiationColors.accentRed
        }
    }
}

struct ProgressRow: View {
    let title: String
    let value: Double
    let color: Color
    let icon: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundColor(color)
                .frame(width: 16)
            
            Text(title)
                .font(.caption)
                .foregroundColor(TiationColors.textSecondary)
                .frame(width: 80, alignment: .leading)
            
            ProgressView(value: value / 100.0)
                .progressViewStyle(TiationProgressViewStyle(color: color))
                .frame(height: 6)
            
            Text("\(Int(value))%")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(TiationColors.textPrimary)
                .frame(width: 30, alignment: .trailing)
        }
    }
}

struct TiationProgressViewStyle: ProgressViewStyle {
    let color: Color
    
    func makeBody(configuration: Configuration) -> some View {
        GeometryReader { geometry in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 3)
                    .fill(TiationColors.backgroundTertiary)
                    .frame(height: 6)
                
                RoundedRectangle(cornerRadius: 3)
                    .fill(
                        LinearGradient(
                            colors: [color, color.opacity(0.7)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .frame(
                        width: geometry.size.width * CGFloat(configuration.fractionCompleted ?? 0),
                        height: 6
                    )
                    .tiationNeonShadow(color: color, radius: 3)
            }
        }
    }
}

#Preview {
    VStack {
        AgentStatusCard(agent: Agent(
            name: "DataProcessor",
            type: "Analytics Agent",
            status: .running,
            cpuUsage: 45.2,
            memoryUsage: 67.8,
            lastActivity: "2m ago"
        ))
        
        AgentStatusCard(agent: Agent(
            name: "EmailBot",
            type: "Communication Agent",
            status: .warning,
            cpuUsage: 23.1,
            memoryUsage: 89.4,
            lastActivity: "12m ago"
        ))
        
        AgentStatusCard(agent: Agent(
            name: "SecurityGuard",
            type: "Security Agent",
            status: .error,
            cpuUsage: 91.7,
            memoryUsage: 95.2,
            lastActivity: "45m ago"
        ))
    }
    .padding()
    .background(TiationColors.backgroundPrimary)
}
