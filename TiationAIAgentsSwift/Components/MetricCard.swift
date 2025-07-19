import SwiftUI

enum TrendDirection {
    case up, down, neutral
}

struct MetricCard: View {
    let title: String
    let value: String
    let icon: String
    let color: Color
    let trend: String?
    let trendDirection: TrendDirection
    
    init(title: String, value: String, icon: String, color: Color, trend: String? = nil, trendDirection: TrendDirection = .neutral) {
        self.title = title
        self.value = value
        self.icon = icon
        self.color = color
        self.trend = trend
        self.trendDirection = trendDirection
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
            
            VStack(spacing: 12) {
                headerSection
                valueSection
            }
            .padding(16)
        }
        .frame(height: 120)
    }
    
    private var headerSection: some View {
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
            
            if let trend = trend {
                HStack(spacing: 4) {
                    Image(systemName: trendIcon)
                        .font(.caption)
                        .foregroundColor(trendColor)
                    
                    Text(trend)
                        .font(.caption)
                        .fontWeight(.semibold)
                        .foregroundColor(trendColor)
                }
            }
        }
    }
    
    private var valueSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(formatValue(value))
                .font(.title)
                .fontWeight(.bold)
                .foregroundColor(TiationColors.textPrimary)
                .minimumScaleFactor(0.8)
                .lineLimit(1)
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(TiationColors.textSecondary)
                .lineLimit(2)
                .multilineTextAlignment(.leading)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
    }
    
    private var trendIcon: String {
        switch trendDirection {
        case .up:
            return "arrow.up.right"
        case .down:
            return "arrow.down.right"
        case .neutral:
            return "arrow.right"
        }
    }
    
    private var trendColor: Color {
        switch trendDirection {
        case .up:
            return TiationColors.accentGreen
        case .down:
            return TiationColors.accentRed
        case .neutral:
            return TiationColors.textSecondary
        }
    }
    
    private func formatValue(_ value: String) -> String {
        // If it's a number, format it properly
        if let number = Int(value) {
            if number >= 1_000_000 {
                return String(format: "%.1fM", Double(number) / 1_000_000.0)
            } else if number >= 1_000 {
                return String(format: "%.1fK", Double(number) / 1_000.0)
            }
            return "\(number)"
        }
        return value
    }
}

#Preview {
    VStack {
        HStack {
            MetricCard(
                title: "Active Agents",
                value: "12",
                icon: "brain.head.profile",
                color: TiationColors.primaryCyan,
                trend: "+12%",
                trendDirection: .up
            )
            
            MetricCard(
                title: "Tasks Completed",
                value: "2847",
                icon: "checkmark.circle.fill",
                color: TiationColors.accentGreen,
                trend: "+8%",
                trendDirection: .up
            )
        }
        
        HStack {
            MetricCard(
                title: "System Load",
                value: "67%",
                icon: "memorychip",
                color: TiationColors.accentYellow,
                trend: "-3%",
                trendDirection: .down
            )
            
            MetricCard(
                title: "Errors",
                value: "2",
                icon: "exclamationmark.triangle.fill",
                color: TiationColors.accentRed,
                trend: "0%",
                trendDirection: .neutral
            )
        }
    }
    .padding()
    .background(TiationColors.backgroundPrimary)
}
