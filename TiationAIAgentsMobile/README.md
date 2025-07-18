# Tiation AI Agents Mobile App

Enterprise AI Automation Platform - Mobile companion app for managing and monitoring AI agents on iOS and Android.

## 🚀 Project Overview

This React Native mobile application provides a comprehensive dashboard for managing AI agents, monitoring system performance, and controlling automation workflows. Built with a modern dark neon theme and enterprise-grade features.

## 📱 Features

### Current Features
- **Dashboard**: Real-time metrics and performance charts
- **Agent Management**: View and monitor AI agent status
- **Dark Neon Theme**: Modern, professional UI with cyan/magenta accents
- **Redux State Management**: Centralized state with async actions
- **Responsive Design**: Optimized for both iOS and Android

### Coming Soon
- **Agent Control**: Start/stop/restart AI agents
- **Live Monitoring**: Real-time system metrics
- **Push Notifications**: Alert system for critical events
- **Settings & Configuration**: User preferences and system settings

## 🛠️ Tech Stack

- **React Native 0.80.1** - Cross-platform mobile development
- **TypeScript** - Type safety and developer experience
- **Redux Toolkit** - State management with async actions
- **React Navigation** - Navigation and routing
- **React Native Chart Kit** - Performance charts and analytics
- **Linear Gradient** - Beautiful gradient backgrounds
- **Vector Icons** - Material Design icons
- **Styled Components** - Component-based styling

## 🏗️ Project Structure

```
TiationAIAgentsMobile/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── MetricCard.tsx   # Dashboard metric cards
│   │   └── AgentStatusCard.tsx # Agent status display
│   ├── screens/             # Screen components
│   │   └── DashboardScreen.tsx # Main dashboard
│   ├── store/               # Redux store configuration
│   │   ├── index.ts         # Store setup
│   │   └── slices/          # Redux slices
│   │       └── dashboardSlice.ts
│   ├── theme/               # Theme configuration
│   │   └── colors.ts        # Color palette
│   └── hooks/               # Custom hooks
│       └── redux.ts         # Typed Redux hooks
├── app-store/               # App store metadata
├── android/                 # Android-specific files
├── ios/                     # iOS-specific files
├── App.tsx                  # Main app component
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/tiation-ai-agents.git
   cd tiation-ai-agents/TiationAIAgentsMobile
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

## 🎨 Theme System

The app uses a comprehensive dark neon theme with the following color palette:

- **Primary**: Deep black (#0A0A0A)
- **Secondary**: Dark gray (#1A1A1A)
- **Accent**: Bright cyan (#00D9FF)
- **Secondary Accent**: Bright magenta (#FF0080)
- **Text**: White (#FFFFFF) with gray variations

## 📊 Dashboard Features

### Metrics Cards
- **Active Agents**: Number of running AI agents
- **Tasks Completed**: Total tasks processed
- **System Load**: Current CPU/memory usage
- **Errors**: Active error count

### Performance Charts
- Line charts showing weekly performance trends
- Interactive data visualization
- Responsive chart sizing

### Agent Status Cards
- Individual agent monitoring
- CPU and memory usage progress bars
- Status indicators (running, warning, error, stopped)
- Last activity timestamps

## 🔧 Available Scripts

```bash
# Development
npm start              # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS

# Building
npm run build:android  # Build Android APK
npm run build:ios     # Build iOS archive
npm run bundle:android # Bundle for Android
npm run bundle:ios    # Bundle for iOS

# Testing & Quality
npm test              # Run tests
npm run lint          # Run ESLint
```

## 📱 App Store Deployment

The project includes comprehensive app store metadata and deployment guides:

- **App Store Metadata**: `/app-store/metadata.json`
- **Deployment Guide**: `/DEPLOYMENT.md`
- **Business Plan**: `/BUSINESS_PLAN.md`
- **Marketing Strategy**: `/MARKETING_STRATEGY.md`

### Revenue Model

- **Starter**: $99/month - Up to 5 agents
- **Professional**: $299/month - Up to 25 agents  
- **Enterprise**: $999/month - Unlimited agents

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@tiation.ai
- GitHub Issues: [Create an issue](https://github.com/your-username/tiation-ai-agents/issues)

## 🚀 Roadmap

### Phase 1 (Current)
- [x] Basic app structure
- [x] Dashboard with metrics
- [x] Agent status monitoring
- [x] Dark neon theme

### Phase 2 (Q1 2025)
- [ ] Agent control actions
- [ ] Real-time updates
- [ ] Push notifications
- [ ] Settings screen

### Phase 3 (Q2 2025)
- [ ] Advanced analytics
- [ ] Custom dashboards
- [ ] Integration APIs
- [ ] Multi-tenant support

---

**Built with ❤️ by the Tiation AI Team**
