import SwiftUI
import Charts

struct DashboardView: View {
    @StateObject private var dashboardVM = DashboardViewModel()
    @State private var isRefreshing = false
    
    var body: some View {
        NavigationView {
            ZStack {
                TiationColors.gradientBackground
                    .ignoresSafeArea()
                
                ScrollView {
                    LazyVStack(spacing: 20) {
                        headerSection
                        metricsSection
                        performanceChartSection
                        agentStatusSection
                        recentActivitySection
                        Spacer(minLength: 80)
                    }
                    .padding(.horizontal, 20)
                    .padding(.top, 10)
                }
                .refreshable {
                    await refreshDashboard()
                }
            }
            .navigationBarHidden(true)
        }
        .onAppear {
            Task {
                await dashboardVM.loadDashboardData()
            }
        }
    }
    
    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text("🤖 AI Dashboard")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Spacer()
                
                Button(action: {
                    Task { await refreshDashboard() }
                }) {
                    Image(systemName: "arrow.clockwise")
                        .font(.title2)
                        .foregroundColor(TiationColors.primaryCyan)
                        .rotationEffect(.degrees(isRefreshing ? 360 : 0))
                        .animation(.easeInOut(duration: 1).repeatCount(isRefreshing ? 10 : 0), value: isRefreshing)
                }
            }
            
            Text("Monitor your AI agents in real-time")
                .font(.headline)
                .foregroundColor(TiationColors.textSecondary)
        }
    }
    
    private var metricsSection: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 2), spacing: 16) {
            MetricCard(
                title: "Active Agents",
                value: "\(dashboardVM.metrics.activeAgents)",
                icon: "brain.head.profile",
                color: TiationColors.primaryCyan,
                trend: "+12%",
                trendDirection: .up
            )
            
            MetricCard(
                title: "Tasks Completed",
                value: dashboardVM.metrics.completedTasks.formatted(),
                icon: "checkmark.circle.fill",
                color: TiationColors.accentGreen,
                trend: "+8%",
                trendDirection: .up
            )
            
            MetricCard(
                title: "System Load",
                value: "\(dashboardVM.metrics.systemLoad)%",
                icon: "memorychip",
                color: TiationColors.accentYellow,
                trend: "-3%",
                trendDirection: .down
            )
            
            MetricCard(
                title: "Errors",
                value: "\(dashboardVM.metrics.errors)",
                icon: "exclamationmark.triangle.fill",
                color: TiationColors.accentRed,
                trend: "0%",
                trendDirection: .neutral
            )
        }
    }
    
    private var performanceChartSection: some View {
        VStack(alignment: .leading, spacing: 15) {
            HStack {
                Text("Performance Metrics")
                    .font(.title2)
                    .fontWeight(.semibold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Spacer()
                
                Button(action: {}) {
                    Image(systemName: "arrow.up.left.and.arrow.down.right")
                        .foregroundColor(TiationColors.primaryCyan)
                }
            }
            
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(TiationColors.gradientCard)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(TiationColors.borderTertiary, lineWidth: 1)
                    )
                    .tiationNeonShadow()
                
                if #available(iOS 16.0, *) {
                    Chart(dashboardVM.performanceData) { dataPoint in
                        LineMark(
                            x: .value("Day", dataPoint.day),
                            y: .value("Performance", dataPoint.value)
                        )
                        .foregroundStyle(
                            LinearGradient(
                                colors: [TiationColors.primaryCyan, TiationColors.primaryMagenta],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .lineStyle(StrokeStyle(lineWidth: 3))
                        
                        AreaMark(
                            x: .value("Day", dataPoint.day),
                            y: .value("Performance", dataPoint.value)
                        )
                        .foregroundStyle(
                            LinearGradient(
                                colors: [
                                    TiationColors.primaryCyan.opacity(0.3),
                                    TiationColors.primaryMagenta.opacity(0.1)
                                ],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )
                    }
                    .chartYAxis {
                        AxisMarks(position: .leading) { _ in
                            AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5))
                                .foregroundStyle(TiationColors.chartGrid)
                            AxisTick(stroke: StrokeStyle(lineWidth: 0))
                            AxisValueLabel()
                                .foregroundStyle(TiationColors.textSecondary)
                        }
                    }
                    .chartXAxis {
                        AxisMarks(position: .bottom) { _ in
                            AxisGridLine(stroke: StrokeStyle(lineWidth: 0.5))
                                .foregroundStyle(TiationColors.chartGrid)
                            AxisTick(stroke: StrokeStyle(lineWidth: 0))
                            AxisValueLabel()
                                .foregroundStyle(TiationColors.textSecondary)
                        }
                    }
                    .frame(height: 200)
                    .padding(20)
                } else {
                    // Fallback for iOS < 16
                    VStack {
                        Image(systemName: "chart.line.uptrend.xyaxis")
                            .font(.system(size: 60))
                            .foregroundColor(TiationColors.primaryCyan)
                        Text("Performance Chart")
                            .font(.headline)
                            .foregroundColor(TiationColors.textSecondary)
                        Text("Requires iOS 16+")
                            .font(.caption)
                            .foregroundColor(TiationColors.textTertiary)
                    }
                    .frame(height: 200)
                }
            }
        }
    }
    
    private var agentStatusSection: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Agent Status")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(TiationColors.textPrimary)
            
            LazyVStack(spacing: 12) {
                ForEach(dashboardVM.agents) { agent in
                    AgentStatusCard(agent: agent)
                }
            }
        }
    }
    
    private var recentActivitySection: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Recent Activity")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(TiationColors.textPrimary)
            
            ZStack {
                RoundedRectangle(cornerRadius: 16)
                    .fill(TiationColors.gradientCard)
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(TiationColors.borderTertiary, lineWidth: 1)
                    )
                    .tiationNeonShadow()
                
                VStack(spacing: 15) {
                    ActivityItem(
                        icon: "play.fill",
                        iconColor: TiationColors.accentGreen,
                        text: "Agent \"DataProcessor\" started successfully",
                        time: "2m ago"
                    )
                    
                    ActivityItem(
                        icon: "checkmark.circle.fill",
                        iconColor: TiationColors.primaryCyan,
                        text: "Task \"Report Generation\" completed",
                        time: "5m ago"
                    )
                    
                    ActivityItem(
                        icon: "exclamationmark.triangle.fill",
                        iconColor: TiationColors.accentYellow,
                        text: "Agent \"EmailBot\" memory usage high",
                        time: "12m ago"
                    )
                }
                .padding(20)
            }
        }
    }
    
    private func refreshDashboard() async {
        isRefreshing = true
        await dashboardVM.loadDashboardData()
        try? await Task.sleep(nanoseconds: 500_000_000) // Brief delay for UX
        isRefreshing = false
    }
}

struct ActivityItem: View {
    let icon: String
    let iconColor: Color
    let text: String
    let time: String
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(iconColor)
                .frame(width: 20)
            
            Text(text)
                .font(.body)
                .foregroundColor(TiationColors.textPrimary)
                .multilineTextAlignment(.leading)
            
            Spacer()
            
            Text(time)
                .font(.caption)
                .foregroundColor(TiationColors.textSecondary)
        }
    }
}

#Preview {
    DashboardView()
}
