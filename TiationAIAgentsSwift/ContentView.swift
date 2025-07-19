import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
TabView(selection: $selectedTab) {
            SimpleDashboardView()
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
            
            CounselorView()
                .tabItem {
                    Image(systemName: "heart.text.square.fill")
                    Text("Counselor")
                }
                .tag(2)
            
            AnalyticsView()
                .tabItem {
                    Image(systemName: "chart.line.uptrend.xyaxis")
                    Text("Analytics")
                }
                .tag(3)
            
            SettingsView()
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("Settings")
                }
                .tag(4)
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

struct SimpleDashboardView: View {
    var body: some View {
        ZStack {
            TiationColors.gradientBackground
                .ignoresSafeArea()
            
            ScrollView {
                LazyVStack(spacing: 20) {
                    headerSection
                    metricsSection
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
            }
            
            Text("Monitor your AI agents in real-time")
                .font(.headline)
                .foregroundColor(TiationColors.textSecondary)
        }
    }
    
    private var metricsSection: some View {
        LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: 12), count: 2), spacing: 16) {
            SimpleMetricCard(
                title: "Active Agents",
                value: "12",
                icon: "brain.head.profile",
                color: TiationColors.primaryCyan
            )
            
            SimpleMetricCard(
                title: "Tasks Completed",
                value: "2847",
                icon: "checkmark.circle.fill",
                color: TiationColors.accentGreen
            )
            
            SimpleMetricCard(
                title: "System Load",
                value: "67%",
                icon: "memorychip",
                color: TiationColors.accentYellow
            )
            
            SimpleMetricCard(
                title: "Errors",
                value: "2",
                icon: "exclamationmark.triangle.fill",
                color: TiationColors.accentRed
            )
        }
    }
}

struct SimpleMetricCard: View {
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

#Preview {
    ContentView()
}
