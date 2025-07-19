import SwiftUI
import PlaygroundSupport

// Include the color system and components from the complete app
struct TiationColors {
    static let backgroundPrimary = Color(hex: "0A0A0A")
    static let backgroundSecondary = Color(hex: "1A1A1A")
    static let backgroundTertiary = Color(hex: "2A2A2A")
    static let backgroundCard = Color(hex: "151515")
    
    static let textPrimary = Color(hex: "FFFFFF")
    static let textSecondary = Color(hex: "B0B0B0")
    
    static let primaryCyan = Color(hex: "00D9FF")
    static let primaryMagenta = Color(hex: "FF0080")
    static let accentYellow = Color(hex: "FFE500")
    static let accentGreen = Color(hex: "00FF88")
    static let accentRed = Color(hex: "FF4444")
    
    static let borderTertiary = Color(hex: "404040")
    
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

extension View {
    func tiationNeonShadow(color: Color = TiationColors.primaryCyan, radius: CGFloat = 10) -> some View {
        self.shadow(color: color.opacity(0.5), radius: radius, x: 0, y: 0)
    }
}

// Demo view showing the components
struct TiationAIAgentsDemoView: View {
    var body: some View {
        ZStack {
            TiationColors.gradientBackground
                .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 20) {
                    // Header
                    Text("🤖 Tiation AI Agents")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .foregroundColor(TiationColors.textPrimary)
                        .tiationNeonShadow()
                    
                    Text("Swift iOS Version - Running in Simulator!")
                        .font(.headline)
                        .foregroundColor(TiationColors.primaryCyan)
                    
                    // Metrics Grid
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
                    .padding(.horizontal)
                    
                    // Status message
                    ZStack {
                        RoundedRectangle(cornerRadius: 16)
                            .fill(TiationColors.gradientCard)
                            .overlay(
                                RoundedRectangle(cornerRadius: 16)
                                    .stroke(TiationColors.borderTertiary, lineWidth: 1)
                            )
                            .tiationNeonShadow()
                        
                        VStack(spacing: 10) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 40))
                                .foregroundColor(TiationColors.accentGreen)
                                .tiationNeonShadow(color: TiationColors.accentGreen)
                            
                            Text("🎉 SUCCESS!")
                                .font(.title2)
                                .fontWeight(.bold)
                                .foregroundColor(TiationColors.textPrimary)
                            
                            Text("TiationAIAgents Swift app is running in iOS Simulator")
                                .font(.body)
                                .foregroundColor(TiationColors.textSecondary)
                                .multilineTextAlignment(.center)
                        }
                        .padding(20)
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
        }
        .preferredColorScheme(.dark)
    }
}

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

// Set up the playground
PlaygroundPage.current.setLiveView(TiationAIAgentsDemoView())
