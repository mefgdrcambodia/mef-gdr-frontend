// src/config/colors.js
export const colors = {
  // Primary Colors - Navy Blue Range
  primary: {
    50: '#eef2f9',  // Lightest navy tint
    100: '#d9e1f0', // Very light navy
    200: '#b3c4e1', // Light navy blue
    300: '#8da7d2', // Medium-light navy
    400: '#6789c3', // Medium navy
    500: '#1e3a8a', // Primary navy blue (main brand color)
    600: '#18327a', // Dark navy
    700: '#122a63', // Darker navy
    800: '#0c214b', // Very dark navy
    900: '#061934', // Deepest navy
  },
  
  // Secondary Colors - Light Blue Range
  secondary: {
    50: '#f0f9ff',  // Lightest sky blue
    100: '#e0f2fe', // Very light sky blue
    200: '#bae6fd', // Light sky blue
    300: '#7dd3fc', // Sky blue
    400: '#38bdf8', // Bright sky blue
    500: '#0ea5e9', // Ocean blue
    600: '#0284c7', // Deep sky blue
    700: '#0369a1', // Dark sky blue
    800: '#075985', // Navy sky blue
    900: '#0c4a6e', // Deep navy blue
  },
  
  // Accent Colors - Gold Range
  accent: {
    50: '#fff9e6',  // Lightest gold
    100: '#fef0c0', // Very light gold
    200: '#fde18a', // Light gold
    300: '#fcd34d', // Gold
    400: '#fbbf24', // Bright gold
    500: '#f59e0b', // Amber gold (main gold)
    600: '#d97706', // Dark gold
    700: '#b45309', // Deep gold
    800: '#92400e', // Bronze
    900: '#78350f', // Deep bronze
  },
  
  // Gray Scale (Cool grays to complement navy)
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Status Colors
  status: {
    success: '#10b981',
    successLight: '#d1fae5',
    warning: '#f59e0b',
    warningLight: '#fef3c7',
    error: '#ef4444',
    errorLight: '#fee2e2',
    info: '#3b82f6',
    infoLight: '#dbeafe',
  },
};

// Semantic color mappings for consistent usage
export const semantic = {
  // Brand Colors
  brand: {
    navy: colors.primary[500],      // Main navy #1e3a8a
    navyDark: colors.primary[700],   // Dark navy #122a63
    navyLight: colors.primary[300],  // Light navy #8da7d2
    gold: colors.accent[500],        // Main gold #f59e0b
    goldLight: colors.accent[300],   // Light gold #fcd34d
    goldDark: colors.accent[700],    // Dark gold #b45309
    skyBlue: colors.secondary[400],  // Sky blue #38bdf8
    oceanBlue: colors.secondary[500], // Ocean blue #0ea5e9
  },
  
  // Text Colors
  text: {
    primary: colors.gray[900],    // #0f172a for main text
    secondary: colors.gray[600],  // #475569 for secondary text
    tertiary: colors.gray[400],   // #94a3b8 for hints
    inverse: '#ffffff',           // White on dark
    onNavy: '#ffffff',            // White text on navy
    onGold: colors.gray[900],     // Dark text on gold
    link: colors.primary[600],    // #18327a for links
    linkHover: colors.primary[700], // #122a63 for hover
  },
  
  // Background Colors
  background: {
    primary: '#ffffff',
    secondary: colors.gray[50],    // #f8fafc
    tertiary: colors.gray[100],    // #f1f5f9
    navy: colors.primary[500],      // #1e3a8a
    navyLight: colors.primary[100], // #d9e1f0
    gold: colors.accent[500],       // #f59e0b
    goldLight: colors.accent[50],   // #fff9e6
    sky: colors.secondary[50],      // #f0f9ff
    card: '#ffffff',
    hover: colors.gray[100],        // #f1f5f9
  },
  
  // Border Colors
  border: {
    light: colors.gray[200],    // #e2e8f0
    default: colors.gray[300],  // #cbd5e1
    dark: colors.gray[400],     // #94a3b8
    navy: colors.primary[200],  // #b3c4e1
    gold: colors.accent[300],   // #fcd34d
  },
  
  // Gradients
  gradient: {
    navyToBlue: 'from-primary-600 to-secondary-600',
    navyToGold: 'from-primary-600 to-accent-500',
    goldToNavy: 'from-accent-500 to-primary-600',
    lightNavy: 'from-primary-100 to-primary-200',
    skyToNavy: 'from-secondary-400 to-primary-500',
  },
  
  // Component-specific colors
  components: {
    header: {
      topBar: 'from-primary-700 to-primary-600',
      main: 'bg-white',
      welcome: 'bg-primary-50 border-primary-200',
      activeNav: 'text-primary-700 bg-primary-50',
    },
    button: {
      primary: 'bg-primary-600 hover:bg-primary-700 text-white',
      secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
      gold: 'bg-accent-500 hover:bg-accent-600 text-gray-900',
      outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
    },
    badge: {
      navy: 'bg-primary-100 text-primary-700 border-primary-200',
      gold: 'bg-accent-100 text-accent-700 border-accent-200',
      sky: 'bg-secondary-100 text-secondary-700 border-secondary-200',
    },
    card: {
      border: 'border-gray-200',
      hover: 'hover:border-primary-200',
      shadow: 'shadow-soft hover:shadow-medium',
    },
  },
};

// Tailwind CSS configuration export
export const tailwindColors = {
  primary: colors.primary,
  secondary: colors.secondary,
  accent: colors.accent,
  gray: colors.gray,
  status: colors.status,
};

// Helper function to get gradient classes
export const gradients = {
  navyToBlue: 'bg-gradient-to-r from-primary-600 to-secondary-600',
  navyToGold: 'bg-gradient-to-r from-primary-600 to-accent-500',
  goldToNavy: 'bg-gradient-to-r from-accent-500 to-primary-600',
  lightNavy: 'bg-gradient-to-r from-primary-100 to-primary-200',
  skyToNavy: 'bg-gradient-to-r from-secondary-400 to-primary-500',
  navyGradient: 'bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500',
  goldAccent: 'bg-gradient-to-r from-accent-400 to-accent-500',
};