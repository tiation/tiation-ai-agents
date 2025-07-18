/**
 * Tiation AI Agents - Dark Neon Theme
 * Enterprise-grade design system with cyan/magenta gradient accents
 */

import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const TiationTheme = {
  colors: {
    // Primary brand colors
    primary: '#00D9FF',        // Cyan
    secondary: '#FF0080',      // Magenta
    accent: '#00FF88',         // Neon green
    warning: '#FFE500',        // Neon yellow
    error: '#FF4444',          // Neon red
    
    // Background colors
    background: '#0A0A0A',     // Deep black
    surface: '#1A1A1A',       // Dark gray
    card: '#2A2A2A',          // Medium gray
    overlay: 'rgba(0, 0, 0, 0.8)',
    
    // Text colors
    textPrimary: '#FFFFFF',    // White
    textSecondary: '#CCCCCC',  // Light gray
    textMuted: '#888888',      // Medium gray
    textDisabled: '#666666',   // Dark gray
    
    // Gradient colors
    gradientStart: '#00D9FF',  // Cyan
    gradientMiddle: '#8A2BE2', // Blue violet
    gradientEnd: '#FF0080',    // Magenta
    
    // Status colors
    success: '#00FF88',        // Neon green
    info: '#00D9FF',          // Cyan
    
    // Interactive colors
    buttonPrimary: '#00D9FF',
    buttonSecondary: '#FF0080',
    buttonDisabled: '#666666',
    
    // Border colors
    border: '#333333',
    borderLight: '#555555',
    borderAccent: '#00D9FF',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  typography: {
    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    
    // Font weights
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line heights
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    md: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    neon: {
      shadowColor: '#00D9FF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 10,
      elevation: 10,
    },
  },
  
  dimensions: {
    screenWidth: width,
    screenHeight: height,
    headerHeight: 60,
    tabBarHeight: 60,
    buttonHeight: 48,
    inputHeight: 48,
  },
  
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      ease: 'ease',
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  gradients: {
    primary: ['#00D9FF', '#8A2BE2', '#FF0080'],
    secondary: ['#00FF88', '#00D9FF', '#FF0080'],
    accent: ['#FFE500', '#00D9FF', '#FF0080'],
    dark: ['#0A0A0A', '#1A1A1A', '#2A2A2A'],
  },
  
  // Component-specific styles
  components: {
    card: {
      backgroundColor: '#1A1A1A',
      borderRadius: 12,
      padding: 16,
      borderWidth: 1,
      borderColor: '#333333',
    },
    
    button: {
      primary: {
        backgroundColor: '#00D9FF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#00D9FF',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
      },
    },
    
    input: {
      backgroundColor: '#2A2A2A',
      borderColor: '#333333',
      borderWidth: 1,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      color: '#FFFFFF',
    },
    
    chip: {
      backgroundColor: '#2A2A2A',
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderWidth: 1,
      borderColor: '#00D9FF',
    },
  },
};

export const createGradient = (colors: string[], direction: 'horizontal' | 'vertical' = 'horizontal') => {
  return {
    colors,
    start: direction === 'horizontal' ? { x: 0, y: 0 } : { x: 0, y: 0 },
    end: direction === 'horizontal' ? { x: 1, y: 0 } : { x: 0, y: 1 },
  };
};

export const createNeonGlow = (color: string, intensity: number = 0.8) => {
  return {
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: intensity,
    shadowRadius: 10,
    elevation: 10,
  };
};

export default TiationTheme;
