import SwiftUI

/// Tiation AI Agents Color System
/// Dark neon theme with cyan/magenta accents for enterprise-grade mobile experience
struct TiationColors {
    
    // MARK: - Background Colors
    static let backgroundPrimary = Color(hex: "0A0A0A")     // Deep black
    static let backgroundSecondary = Color(hex: "1A1A1A")   // Dark gray
    static let backgroundTertiary = Color(hex: "2A2A2A")    // Medium gray
    static let backgroundCard = Color(hex: "151515")        // Card background
    static let backgroundModal = Color(hex: "0F0F0F")       // Modal background
    
    // MARK: - Text Colors
    static let textPrimary = Color(hex: "FFFFFF")           // White
    static let textSecondary = Color(hex: "B0B0B0")         // Light gray
    static let textTertiary = Color(hex: "808080")          // Medium gray
    static let textDisabled = Color(hex: "505050")          // Dark gray
    static let textPlaceholder = Color(hex: "606060")       // Placeholder text
    
    // MARK: - Accent Colors
    static let primaryCyan = Color(hex: "00D9FF")           // Bright cyan
    static let primaryMagenta = Color(hex: "FF0080")        // Bright magenta
    static let accentYellow = Color(hex: "FFE500")          // Bright yellow
    static let accentGreen = Color(hex: "00FF88")           // Bright green
    static let accentRed = Color(hex: "FF4444")             // Bright red
    static let accentOrange = Color(hex: "FF8800")          // Bright orange
    
    // MARK: - Status Colors
    static let statusSuccess = Color(hex: "00FF88")         // Success green
    static let statusWarning = Color(hex: "FFE500")         // Warning yellow
    static let statusError = Color(hex: "FF4444")           // Error red
    static let statusInfo = Color(hex: "00D9FF")            // Info cyan
    
    // MARK: - Border Colors
    static let borderPrimary = Color(hex: "00D9FF")         // Cyan border
    static let borderSecondary = Color(hex: "FF0080")       // Magenta border
    static let borderTertiary = Color(hex: "404040")        // Dark gray border
    static let borderDisabled = Color(hex: "202020")        // Very dark gray
    
    // MARK: - Chart Colors
    static let chartPrimary = Color(hex: "00D9FF")          // Main chart color
    static let chartSecondary = Color(hex: "FF0080")        // Secondary chart color
    static let chartTertiary = Color(hex: "00FF88")         // Tertiary chart color
    static let chartQuaternary = Color(hex: "FFE500")       // Quaternary chart color
    static let chartGrid = Color(hex: "404040")             // Chart grid lines
    static let chartAxis = Color(hex: "808080")             // Chart axis
    
    // MARK: - Gradient Definitions
    static let gradientPrimary = LinearGradient(
        gradient: Gradient(colors: [primaryCyan, primaryMagenta]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let gradientSecondary = LinearGradient(
        gradient: Gradient(colors: [accentGreen, accentYellow]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let gradientTertiary = LinearGradient(
        gradient: Gradient(colors: [primaryMagenta, accentOrange]),
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
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

// MARK: - Color Extension for Hex Support
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
    
    func tiationCardShadow() -> some View {
        self.shadow(color: Color.black.opacity(0.8), radius: 4, x: 0, y: 2)
    }
}
