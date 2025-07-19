import SwiftUI

struct AgentDetailView: View {
    @Environment(\.colorScheme) var colorScheme
    @ObservedObject var viewModel = AgentDetailViewModel()
    
    var body: some View {
        ZStack {
            // Background with dark neon theme
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(TiationColors.backgroundPrimary),
                    Color(TiationColors.backgroundSecondary)
                ]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(alignment: .leading, spacing: 20) {

                    // Header
                    HStack(alignment: .center, spacing: 15) {
                        Image(systemName: "person.circle.fill")
                            .resizable()
                            .frame(width: 80, height: 80)
                            .foregroundColor(Color(TiationColors.primaryText))
                        VStack(alignment: .leading) {
                            Text(viewModel.agentName)
                                .font(.largeTitle)
                                .foregroundColor(Color(TiationColors.primaryText))
                            ChipView(status: viewModel.agentStatus)
                        }
                        Spacer()
                    }
                    .padding()
                    .background(Color(TiationColors.surface).opacity(0.8))
                    .cornerRadius(12)

                    // Metrics
                    PerformanceMetricsView(metrics: viewModel.agentMetrics)

                    // Configuration
                    ConfigurationView(config: viewModel.agentConfiguration)

                    Spacer()

                    // Action Buttons
                    HStack {
                        Button(action: { viewModel.updateAgentStatus("Restarting") }) {
                            Label("Restart Agent", systemImage: "arrow.clockwise")
                        }
                        .buttonStyle(.borderedProminent)

                        Button(action: { /* Configuration Action */ }) {
                            Label("Configure", systemImage: "gear")
                        }
                        .buttonStyle(.bordered)
                    }
                    .padding()
                }
            }
            .padding()
        }
    }
}

struct ChipView: View {
    var status: String
    
    var body: some View {
        Text(status)
            .padding(8)
            .background(Color(TiationColors.chipBackground))
            .foregroundColor(Color(TiationColors.chipText))
            .cornerRadius(12)
    }
}

struct PerformanceMetricsView: View {
    var metrics: AgentMetrics
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Performance Metrics")
                .font(.headline)
                .padding(.bottom, 4)
            HStack {
                MetricItem(label: "Tasks Completed", value: String(metrics.completedTasks))
                MetricItem(label: "Success Rate", value: String(format: "%.2f%%", metrics.successRate * 100))
            }
            HStack {
                MetricItem(label: "Avg Response Time", value: String(format: "%.2fs", metrics.averageResponseTime))
                MetricItem(label: "Uptime", value: String(format: "%.1fh", metrics.uptime/3600))
            }
        }
        .padding()
        .background(Color(TiationColors.surface).opacity(0.8))
        .cornerRadius(12)
    }
}

struct MetricItem: View {
    var label: String
    var value: String
    
    var body: some View {
        VStack {
            Text(value)
                .font(.title2)
                .bold()
                .foregroundColor(Color(TiationColors.primaryText))
            Text(label)
                .font(.caption)
                .foregroundColor(Color(TiationColors.secondaryText))
        }
        .padding()
        .frame(maxWidth: .infinity)
    }
}

struct ConfigurationView: View {
    var config: AgentConfiguration
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Configuration")
                .font(.headline)
                .padding(.bottom, 4)
            VStack(alignment: .leading) {
                Text("Max Concurrent Tasks: \(config.maxConcurrentTasks)")
                Text("Timeout: \(Int(config.timeout))s")
                Text("Retry Attempts: \(config.retryAttempts)")
            }
        }
        .padding()
        .background(Color(TiationColors.surface).opacity(0.8))
        .cornerRadius(12)
    }
}

#Preview {
    AgentDetailView()
}
