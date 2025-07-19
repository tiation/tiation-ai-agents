import SwiftUI

struct DashboardView: View {
    var body: some View {
        VStack {
            Text("AI Dashboard")
                .font(.largeTitle)
                .foregroundColor(TiationColors.textPrimary)
            Text("Monitor your AI agents in real-time")
                .font(.headline)
                .foregroundColor(TiationColors.textSecondary)
            Spacer()
        }
        .padding()
        .background(TiationColors.backgroundPrimary)
    }
}

struct AgentsView: View {
    var body: some View {
        Text("Agents View")
    }
}

struct AnalyticsView: View {
    var body: some View {
        Text("Analytics View")
    }
}

struct SettingsView: View {
    var body: some View {
        Text("Settings View")
    }
}
