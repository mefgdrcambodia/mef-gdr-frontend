import { colors } from '../config/colors';

export const theme = {
  // Typography classes
  typography: {
    h1: 'text-4xl md:text-5xl font-light text-gray-900 mb-4',
    h2: 'text-3xl md:text-4xl font-light text-gray-900 mb-3',
    h3: 'text-2xl font-medium text-gray-900 mb-2',
    h4: 'text-xl font-medium text-gray-900 mb-2',
    body: 'text-base text-gray-600 leading-relaxed',
    bodySmall: 'text-sm text-gray-500',
    caption: 'text-xs text-gray-400',
    link: 'text-primary-600 hover:text-primary-700 transition-colors',
  },
  
  // Component classes
  components: {
    // Cards
    card: 'bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-all duration-300',
    cardHeader: 'border-b border-gray-200 px-6 py-4 bg-gray-50',
    cardBody: 'p-6',
    cardFooter: 'border-t border-gray-200 px-6 py-4 bg-gray-50',
    
    // Buttons
    button: {
      primary: 'bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#2E7D32] transition-colors',
      secondary: 'bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors',
      outline: 'border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors',
      ghost: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg transition-colors',
    },
    
    // Inputs
    input: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50] transition-colors',
    select: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50] bg-white',
    textarea: 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#4CAF50] resize-none',
    label: 'block text-sm font-medium text-gray-700 mb-1',
    
    // Badges
    badge: {
      default: 'px-2.5 py-1 text-xs font-medium rounded-full',
      primary: 'bg-[#4CAF50] bg-opacity-10 text-[#2E7D32] border border-[#4CAF50] border-opacity-20',
      gray: 'bg-gray-100 text-gray-700 border border-gray-200',
      success: 'bg-green-100 text-green-700 border border-green-200',
      warning: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    },
    
    // Navigation
    navItem: 'flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all',
    navItemActive: 'text-[#2E7D32] bg-[#4CAF50] bg-opacity-10',
    navItemInactive: 'text-gray-600 hover:text-[#2E7D32] hover:bg-[#4CAF50] hover:bg-opacity-10',
    
    // Dividers
    divider: 'border-t border-gray-200',
    dividerLight: 'border-t border-gray-100',
    
    // Alerts
    alert: {
      success: 'bg-[#4CAF50] bg-opacity-10 border border-[#4CAF50] border-opacity-20 text-[#2E7D32]',
      error: 'bg-red-50 border border-red-200 text-red-700',
      warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
      info: 'bg-blue-50 border border-blue-200 text-blue-700',
    },
    
    // Tables
    table: {
      wrapper: 'overflow-x-auto border border-gray-200 rounded-lg',
      header: 'bg-gray-50 border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-700',
      cell: 'px-4 py-3 text-sm text-gray-600 border-b border-gray-200',
      row: 'hover:bg-[#4CAF50] hover:bg-opacity-5 transition-colors',
    },
  },
  
  // Layout classes
  layout: {
    container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    section: 'py-12',
    sectionSm: 'py-8',
    sectionLg: 'py-16',
    grid: 'grid gap-6',
    flexCenter: 'flex items-center justify-center',
    flexBetween: 'flex items-center justify-between',
  },
  
  // Animation classes
  animations: {
    fadeIn: 'animate-fadeIn',
    slideIn: 'animate-slideIn',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
  },
  
  // Spacing
  spacing: {
    page: 'py-12',
    section: 'mb-12',
    element: 'mb-6',
    component: 'mb-4',
  },
};

// Helper function to get combined classes
export const getClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};