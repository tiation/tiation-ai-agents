import SwiftUI

// MARK: - Color System
struct TiationColors {
    // Background Colors
    static let backgroundPrimary = Color(hex: "0A0A0A")
    static let backgroundSecondary = Color(hex: "1A1A1A")
    static let backgroundTertiary = Color(hex: "2A2A2A")
    static let backgroundCard = Color(hex: "151515")
    
    // Text Colors
    static let textPrimary = Color(hex: "FFFFFF")
    static let textSecondary = Color(hex: "B0B0B0")
    static let textTertiary = Color(hex: "808080")
    
    // Accent Colors
    static let primaryCyan = Color(hex: "00D9FF")
    static let primaryMagenta = Color(hex: "FF0080")
    static let accentYellow = Color(hex: "FFE500")
    static let accentGreen = Color(hex: "00FF88")
    static let accentRed = Color(hex: "FF4444")
    static let accentOrange = Color(hex: "FF8800")
    
    // Border Colors
    static let borderTertiary = Color(hex: "404040")
    
    // Gradient Definitions
    static let gradientBackground = LinearGradient(
        gradient: Gradient(colors: [backgroundPrimary, backgroundSecondary]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let gradientCard = LinearGradient(
        gradient: Gradient(colors: [backgroundCard, backgroundTertiary]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
}

// MARK: - Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

// MARK: - Shadow Modifiers
extension View {
    func tiationNeonShadow(color: Color = TiationColors.primaryCyan, radius: CGFloat = 10) -> some View {
        self.shadow(color: color.opacity(0.5), radius: radius, x: 0, y: 0)
    }
}

// MARK: - Main App
@main
struct TiationAIAgentsApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
                .preferredColorScheme(.dark)
        }
    }
}

// MARK: - Content View
struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView()
                .tabItem {
                    Image(systemName: "chart.bar.fill")
                    Text("Dashboard")
                }
                .tag(0)
            
            AgentsView()
                .tabItem {
                    Image(systemName: "brain.head.profile")
                    Text("Agents")
                }
                .tag(1)
            
            AnalyticsView()
                .tabItem {
                    Image(systemName: "chart.line.uptrend.xyaxis")
                    Text("Analytics")
                }
                .tag(2)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("Settings")
                }
                .tag(3)
        }
        .accentColor(TiationColors.primaryCyan)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [TiationColors.backgroundPrimary, TiationColors.backgroundSecondary]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
        )
    }
}

// MARK: - Dashboard View
struct DashboardView: View {
    var body: some View {
        ZStack {
            TiationColors.gradientBackground
                .ignoresSafeArea()
            
            ScrollView {
                LazyVStack(spacing: 20) {
                    headerSection
                    metricsSection
                    agentCardsSection
                    Spacer(minLength: 80)
                }
                .padding(.horizontal, 20)
                .padding(.top, 10)
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
                
                Button(action: {}) {
                    Image(systemName: "arrow.clockwise")
                        .font(.title2)
                        .foregroundColor(TiationColors.primaryCyan)
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
                value: "12",
                icon: "brain.head.profile",
                color: TiationColors.primaryCyan
            )
            
            MetricCard(
                title: "Tasks Completed",
                value: "2847",
                icon: "checkmark.circle.fill",
                color: TiationColors.accentGreen
            )
            
            MetricCard(
                title: "System Load",
                value: "67%",
                icon: "memorychip",
                color: TiationColors.accentYellow
            )
            
            MetricCard(
                title: "Errors",
                value: "2",
                icon: "exclamationmark.triangle.fill",
                color: TiationColors.accentRed
            )
        }
    }
    
    private var agentCardsSection: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Agent Status")
                .font(.title2)
                .fontWeight(.semibold)
                .foregroundColor(TiationColors.textPrimary)
            
            LazyVStack(spacing: 12) {
                AgentCard(
                    name: "DataProcessor",
                    type: "Analytics Agent",
                    status: "Running",
                    cpuUsage: 45,
                    memoryUsage: 68
                )
                
                AgentCard(
                    name: "EmailBot",
                    type: "Communication Agent",
                    status: "Warning",
                    cpuUsage: 23,
                    memoryUsage: 89
                )
                
                AgentCard(
                    name: "SecurityGuard",
                    type: "Security Agent",
                    status: "Running",
                    cpuUsage: 32,
                    memoryUsage: 52
                )
            }
        }
    }
}

// MARK: - Metric Card
struct MetricCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .fill(TiationColors.gradientCard)
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(TiationColors.borderTertiary, lineWidth: 1)
                )
                .tiationNeonShadow()
            
            VStack(spacing: 12) {
                HStack {
                    ZStack {
                        Circle()
                            .fill(color.opacity(0.2))
                            .frame(width: 40, height: 40)
                        
                        Image(systemName: icon)
                            .font(.title3)
                            .foregroundColor(color)
                    }
                    Spacer()
                }
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(value)
                        .font(.title)
                        .fontWeight(.bold)
                        .foregroundColor(TiationColors.textPrimary)
                    
                    Text(title)
                        .font(.subheadline)
                        .fontWeight(.medium)
                        .foregroundColor(TiationColors.textSecondary)
                        .multilineTextAlignment(.leading)
                }
                .frame(maxWidth: .infinity, alignment: .leading)
            }
            .padding(16)
        }
        .frame(height: 120)
    }
}

// MARK: - Agent Card
struct AgentCard: View {
    let name: String
    let type: String
    let status: String
    let cpuUsage: Int
    let memoryUsage: Int
    
    private var statusColor: Color {
        switch status {
        case "Running":
            return TiationColors.accentGreen
        case "Warning":
            return TiationColors.accentYellow
        case "Error":
            return TiationColors.accentRed
        default:
            return TiationColors.textSecondary
        }
    }
    
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
                // Header
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(name)
                            .font(.headline)
                            .fontWeight(.semibold)
                            .foregroundColor(TiationColors.textPrimary)
                        
                        Text(type)
                            .font(.subheadline)
                            .foregroundColor(TiationColors.textSecondary)
                    }
                    
                    Spacer()
                    
                    HStack(spacing: 6) {
                        Circle()
                            .fill(statusColor)
                            .frame(width: 8, height: 8)
                        
                        Text(status)
                            .font(.subheadline)
                            .fontWeight(.medium)
                            .foregroundColor(statusColor)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(
                        Capsule()
                            .fill(statusColor.opacity(0.15))
                    )
                }
                
                // Progress bars
                VStack(spacing: 12) {
                    ProgressRow(title: "CPU", value: cpuUsage, color: TiationColors.primaryCyan)
                    ProgressRow(title: "Memory", value: memoryUsage, color: TiationColors.primaryMagenta)
                }
            }
            .padding(16)
        }
    }
}

// MARK: - Progress Row
struct ProgressRow: View {
    let title: String
    let value: Int
    let color: Color
    
    var body: some View {
        HStack(spacing: 12) {
            Text(title)
                .font(.caption)
                .foregroundColor(TiationColors.textSecondary)
                .frame(width: 50, alignment: .leading)
            
            GeometryReader { geometry in
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 3)
                        .fill(TiationColors.backgroundTertiary)
                        .frame(height: 6)
                    
                    RoundedRectangle(cornerRadius: 3)
                        .fill(color)
                        .frame(
                            width: geometry.size.width * CGFloat(value) / 100.0,
                            height: 6
                        )
                        .tiationNeonShadow(color: color, radius: 3)
                }
            }
            .frame(height: 6)
            
            Text("\(value)%")
                .font(.caption)
                .fontWeight(.medium)
                .foregroundColor(TiationColors.textPrimary)
                .frame(width: 35, alignment: .trailing)
        }
    }
}

// MARK: - Other Views
struct AgentsView: View {
    var body: some View {
        ZStack {
            TiationColors.gradientBackground
                .ignoresSafeArea()
            
            VStack {
                Text("⚡ AI Agents")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Text("Manage your intelligent agents")
                    .font(.headline)
                    .foregroundColor(TiationColors.textSecondary)
                
                Spacer()
                
                Image(systemName: "brain.head.profile")
                    .font(.system(size: 80))
                    .foregroundColor(TiationColors.primaryCyan)
                    .tiationNeonShadow()
                
                Text("Coming Soon")
                    .font(.title2)
                    .foregroundColor(TiationColors.textSecondary)
                    .padding(.top)
                
                Spacer()
            }
            .padding()
        }
    }
}

struct AnalyticsView: View {
    var body: some View {
        ZStack {
            TiationColors.gradientBackground
                .ignoresSafeArea()
            
            VStack {
                Text("📊 Analytics")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Text("Advanced performance insights")
                    .font(.headline)
                    .foregroundColor(TiationColors.textSecondary)
                
                Spacer()
                
                Image(systemName: "chart.line.uptrend.xyaxis")
                    .font(.system(size: 80))
                    .foregroundColor(TiationColors.primaryMagenta)
                    .tiationNeonShadow(color: TiationColors.primaryMagenta)
                
                Text("Coming Soon")
                    .font(.title2)
                    .foregroundColor(TiationColors.textSecondary)
                    .padding(.top)
                
                Spacer()
            }
            .padding()
        }
    }
}

struct SettingsView: View {
    var body: some View {
        ZStack {
            TiationColors.gradientBackground
                .ignoresSafeArea()
            
            VStack {
                Text("⚙️ Settings")
                    .font(.largeTitle)
                    .fontWeight(.bold)
                    .foregroundColor(TiationColors.textPrimary)
                
                Text("Configure your AI environment")
                    .font(.headline)
                    .foregroundColor(TiationColors.textSecondary)
                
                Spacer()
                
                Image(systemName: "gearshape.fill")
                    .font(.system(size: 80))
                    .foregroundColor(TiationColors.accentGreen)
                    .tiationNeonShadow(color: TiationColors.accentGreen)
                
                Text("Coming Soon")
                    .font(.title2)
                    .foregroundColor(TiationColors.textSecondary)
                    .padding(.top)
                
                Spacer()
            }
            .padding()
        }
    }
}

// MARK: - Preview
#Preview {
    ContentView()
}
