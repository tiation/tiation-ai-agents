export const colors = {
  background: {
    primary: '#0A0A0A',      // Deep black
    secondary: '#1A1A1A',    // Dark gray
    tertiary: '#2A2A2A',     // Medium gray
    card: '#151515',         // Card background
    modal: '#0F0F0F',        // Modal background
  },
  text: {
    primary: '#FFFFFF',      // White
    secondary: '#B0B0B0',    // Light gray
    tertiary: '#808080',     // Medium gray
    disabled: '#505050',     // Dark gray
    placeholder: '#606060',  // Placeholder text
  },
  accent: {
    cyan: '#00D9FF',         // Bright cyan
    magenta: '#FF0080',      // Bright magenta
    yellow: '#FFE500',       // Bright yellow
    green: '#00FF88',        // Bright green
    red: '#FF4444',          // Bright red
    orange: '#FF8800',       // Bright orange
  },
  gradient: {
    primary: ['#00D9FF', '#FF0080'],        // Cyan to magenta
    secondary: ['#00FF88', '#FFE500'],      // Green to yellow
    tertiary: ['#FF0080', '#FF8800'],       // Magenta to orange
    background: ['#0A0A0A', '#1A1A1A'],     // Dark gradient
    card: ['#151515', '#2A2A2A'],           // Card gradient
  },
  border: {
    primary: '#00D9FF',      // Cyan border
    secondary: '#FF0080',    // Magenta border
    tertiary: '#404040',     // Dark gray border
    disabled: '#202020',     // Very dark gray
  },
  shadow: {
    cyan: '#00D9FF33',       // Cyan shadow
    magenta: '#FF008033',    // Magenta shadow
    dark: '#00000080',       // Dark shadow
  },
  status: {
    success: '#00FF88',      // Success green
    warning: '#FFE500',      // Warning yellow
    error: '#FF4444',        // Error red
    info: '#00D9FF',         // Info cyan
  },
  chart: {
    primary: '#00D9FF',      // Main chart color
    secondary: '#FF0080',    // Secondary chart color
    tertiary: '#00FF88',     // Tertiary chart color
    quaternary: '#FFE500',   // Quaternary chart color
    grid: '#404040',         // Chart grid lines
    axis: '#808080',         // Chart axis
  },
  button: {
    primary: {
      background: '#00D9FF',
      text: '#0A0A0A',
      border: '#00D9FF',
    },
    secondary: {
      background: 'transparent',
      text: '#00D9FF',
      border: '#00D9FF',
    },
    danger: {
      background: '#FF4444',
      text: '#FFFFFF',
      border: '#FF4444',
    },
    disabled: {
      background: '#404040',
      text: '#808080',
      border: '#404040',
    },
  },
  input: {
    background: '#1A1A1A',
    border: '#404040',
    borderFocus: '#00D9FF',
    text: '#FFFFFF',
    placeholder: '#808080',
  },
};

export const shadows = {
  neon: {
    shadowColor: colors.accent.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  magenta: {
    shadowColor: colors.accent.magenta,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
};
