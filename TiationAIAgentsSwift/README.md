# Tiation AI Agents - Swift iOS Version

🤖 **Enterprise AI Automation Platform** - Native iOS app built with SwiftUI for managing and monitoring AI agents.

## 🚀 Overview

This is the **Swift/SwiftUI native iOS version** of the TiationAIAgents app, complementing the existing React Native implementation. Built with modern iOS development practices and SwiftUI for a native user experience.

## 📱 Features

### ✅ Current Features
- **🎨 Dark Neon Theme**: Stunning dark UI with cyan/magenta gradient accents
- **📊 Dashboard**: Real-time AI agent metrics and system monitoring
- **⚡ Agent Management**: View and monitor individual agent status
- **📈 Performance Cards**: CPU, Memory, Task completion metrics
- **🔄 Live Progress Bars**: Real-time system resource visualization
- **🎯 Native iOS Experience**: Built entirely with SwiftUI for optimal performance

### 🔜 Coming Soon
- **Agent Control**: Start/stop/restart AI agents
- **Live Data**: Real-time updates via WebSocket
- **Push Notifications**: Critical alerts and status changes
- **Advanced Analytics**: Charts and performance insights
- **Settings & Configuration**: User preferences and system settings

## 🛠️ Tech Stack

- **Swift 5.9+** - Modern Swift language features
- **SwiftUI** - Declarative UI framework
- **iOS 15.0+** - Minimum deployment target
- **Xcode 15.0+** - Development environment
- **Combine** - Reactive programming (for future data updates)

## 🏗️ Architecture

```
TiationAIAgentsSwift/
├── TiationAIAgentsComplete.swift    # Complete single-file app
├── Theme/
│   └── TiationColors.swift          # Color system & theme
├── Views/
│   ├── ContentView.swift            # Main tab navigation
│   ├── DashboardView.swift          # Dashboard with metrics
│   ├── AgentsView.swift             # Agent management (placeholder)
│   ├── AnalyticsView.swift          # Analytics (placeholder)
│   └── SettingsView.swift           # Settings (placeholder)
├── Components/
│   ├── MetricCard.swift             # Reusable metric display cards
│   ├── AgentStatusCard.swift        # Individual agent status display
│   └── ProgressRow.swift            # Progress bar component
├── ViewModels/
│   └── DashboardViewModel.swift     # Dashboard state management
└── README.md                        # This file
```

## 🎨 Design System

The app follows **Tiation's Enterprise Dark Neon Theme**:

### Color Palette
- **Background**: Deep black (`#0A0A0A`) to dark gray (`#1A1A1A`)
- **Primary Accent**: Bright cyan (`#00D9FF`)
- **Secondary Accent**: Bright magenta (`#FF0080`)
- **Success**: Neon green (`#00FF88`)
- **Warning**: Bright yellow (`#FFE500`)
- **Error**: Bright red (`#FF4444`)

### Visual Features
- **Neon Shadows**: Glowing effects on cards and components
- **Gradient Backgrounds**: Smooth transitions between dark tones
- **Rounded Corners**: Modern 16px radius on all cards
- **Progress Animations**: Smooth CPU/Memory usage indicators

## 🚀 Getting Started

### Prerequisites
- **Xcode 15.0+** installed on macOS
- **iOS Simulator** or physical iOS device
- **Swift 5.9+** (included with Xcode)

### Installation & Running

1. **Clone the repository**
   ```bash
   git clone https://github.com/tiation/tiation-ai-agents.git
   cd tiation-ai-agents/TiationAIAgentsSwift
   ```

2. **Open in Xcode**
   ```bash
   open TiationAIAgents.xcodeproj
   ```

3. **Build and Run**
   - Select iOS Simulator (iPhone 15 Pro recommended)
   - Press `Cmd + R` to build and run
   - Or use the play button in Xcode

### Alternative: Command Line Compilation
```bash
# Compile for iOS Simulator
xcrun -sdk iphonesimulator swiftc -parse-as-library \
  -target arm64-apple-ios15.0-simulator \
  TiationAIAgentsComplete.swift -o TiationAIAgents-iOS
```

## 📊 Screenshots

### Dashboard View
- **Metrics Grid**: 2x2 layout with Active Agents, Tasks Completed, System Load, and Errors
- **Agent Cards**: Individual agent status with CPU/Memory progress bars
- **Refresh Button**: Pull-to-refresh and manual refresh functionality

### Tab Navigation
- **🤖 Dashboard**: Main monitoring interface
- **⚡ Agents**: Agent management (coming soon)
- **📊 Analytics**: Performance insights (coming soon)  
- **⚙️ Settings**: Configuration options (coming soon)

## 🔧 Development

### Key Components

#### `TiationColors`
Complete color system matching React Native implementation with hex color support and neon shadow modifiers.

#### `DashboardView`
Main dashboard featuring:
- Header with app title and refresh button
- 2x2 metrics grid showing key KPIs
- Agent status cards with progress indicators
- Scrollable layout with proper spacing

#### `MetricCard`
Reusable metric display component:
- Customizable icon, color, and values
- Gradient background with neon shadows
- Proper typography hierarchy

#### `AgentCard`
Individual agent status display:
- Agent name, type, and status indicator
- CPU and memory usage progress bars
- Color-coded status badges

### Adding New Features

1. **New Views**: Add to appropriate folder and import in ContentView
2. **Components**: Create reusable components in Components/
3. **Data Models**: Add ViewModels for state management
4. **Styling**: Extend TiationColors for consistent theming

## 🎯 Comparison with React Native Version

| Feature | React Native | Swift iOS | Notes |
|---------|-------------|-----------|-------|
| **UI Framework** | React Native + TypeScript | SwiftUI + Swift | Native iOS performance |
| **Navigation** | React Navigation | TabView | Platform-specific navigation |
| **State Management** | Redux Toolkit | @State/@StateObject | SwiftUI reactive patterns |
| **Styling** | Styled Components | SwiftUI modifiers | Type-safe styling |
| **Charts** | React Native Chart Kit | iOS Charts (planned) | Native chart rendering |
| **Platform** | Cross-platform | iOS only | Optimized for iOS ecosystem |

## 🚀 Deployment

### App Store Preparation
1. **Code Signing**: Configure development team in Xcode
2. **Bundle Identifier**: Set to `com.tiation.ai.agents`
3. **Version Management**: Update version numbers in project settings
4. **Asset Catalog**: Add app icons and launch screens
5. **Archive & Upload**: Use Xcode's archive process

### TestFlight Distribution
- Build archive in Xcode
- Upload to App Store Connect
- Configure TestFlight testing groups
- Distribute to beta testers

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Follow Swift coding standards and SwiftUI best practices
4. Add comprehensive SwiftUI previews
5. Test on multiple iOS devices/simulators
6. Commit changes (`git commit -m 'Add amazing feature'`)
7. Push branch (`git push origin feature/amazing-feature`)
8. Open Pull Request

### Code Standards
- **Swift Style Guide**: Follow Apple's Swift API Design Guidelines
- **SwiftUI Best Practices**: Use proper state management patterns
- **Documentation**: Add inline documentation for complex components
- **Testing**: Include unit tests for ViewModels and business logic

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

For support and questions:
- **Email**: support@tiation.ai
- **GitHub Issues**: [Create an issue](https://github.com/tiation/tiation-ai-agents/issues)
- **Documentation**: [Full API docs](https://docs.tiation.ai)

## 🚀 Roadmap

### Phase 1 (Completed ✅)
- [x] Basic SwiftUI app structure
- [x] Dark neon theme implementation
- [x] Dashboard with metrics cards
- [x] Agent status monitoring
- [x] Native iOS navigation

### Phase 2 (Next - Q1 2025)
- [ ] Live data integration
- [ ] Agent control actions (start/stop/restart)
- [ ] WebSocket real-time updates
- [ ] Push notification support
- [ ] Advanced settings screen

### Phase 3 (Future - Q2 2025)
- [ ] iOS Charts integration
- [ ] Advanced analytics dashboard
- [ ] Core Data persistence
- [ ] Offline mode support
- [ ] Apple Watch companion app

---

**Built with ❤️ by Tiation | Enterprise AI Solutions**
