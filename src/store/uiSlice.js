// store/uiSlice.js
"use client";

import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "ui",
  initialState: {
    toast: null,
    modal: null,
    loading: false,
    sidebarOpen: false,
    theme: 'light',
    notifications: [],
    screenSize: 'desktop' // 'mobile', 'tablet', 'desktop'
  },
  reducers: {
    showToast: (state, action) => { 
      state.toast = {
        ...action.payload,
        id: Date.now(),
        timestamp: new Date().toISOString()
      };
    },
    clearToast: (state) => { 
      state.toast = null; 
    },
    
    // Modal actions
    openModal: (state, action) => {
      state.modal = {
        id: action.payload.id,
        props: action.payload.props || {},
        data: action.payload.data || null
      };
    },
    closeModal: (state) => {
      state.modal = null;
    },
    
    // Loading actions
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    openSidebar: (state) => {
      state.sidebarOpen = true;
    },
    closeSidebar: (state) => {
      state.sidebarOpen = false;
    },
    
    // Theme actions
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Save to localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', state.theme);
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        ...action.payload,
        id: Date.now(),
        read: false,
        timestamp: new Date().toISOString()
      };
      state.notifications.unshift(notification);
      // Keep only last 50 notifications
      if (state.notifications.length > 50) {
        state.notifications.pop();
      }
    },
    markNotificationRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    markAllNotificationsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.read = true;
      });
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    
    // Screen size detection
    setScreenSize: (state, action) => {
      state.screenSize = action.payload;
    }
  },
});

// Toast helper functions
export const toast = {
  success: (message, title = "Success") => (dispatch) => {
    dispatch(showToast({ 
      type: "success", 
      title, 
      message,
      duration: 3000 
    }));
  },
  
  error: (message, title = "Error") => (dispatch) => {
    dispatch(showToast({ 
      type: "error", 
      title, 
      message,
      duration: 4000 
    }));
  },
  
  warning: (message, title = "Warning") => (dispatch) => {
    dispatch(showToast({ 
      type: "warning", 
      title, 
      message,
      duration: 3000 
    }));
  },
  
  info: (message, title = "Info") => (dispatch) => {
    dispatch(showToast({ 
      type: "info", 
      title, 
      message,
      duration: 2500 
    }));
  },
  
  custom: (payload) => (dispatch) => {
    dispatch(showToast(payload));
  }
};

// Modal helper functions
export const modal = {
  open: (id, props = {}, data = null) => (dispatch) => {
    dispatch(openModal({ id, props, data }));
  },
  close: () => (dispatch) => {
    dispatch(closeModal());
  }
};

// Selectors
export const selectToast = (state) => state.ui.toast;
export const selectModal = (state) => state.ui.modal;
export const selectLoading = (state) => state.ui.loading;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectTheme = (state) => state.ui.theme;
export const selectNotifications = (state) => state.ui.notifications;
export const selectUnreadNotifications = (state) => 
  state.ui.notifications.filter(n => !n.read);
export const selectScreenSize = (state) => state.ui.screenSize;
export const selectIsMobile = (state) => state.ui.screenSize === 'mobile';
export const selectIsTablet = (state) => state.ui.screenSize === 'tablet';
export const selectIsDesktop = (state) => state.ui.screenSize === 'desktop';

export const { 
  showToast, 
  clearToast,
  openModal,
  closeModal,
  setLoading,
  toggleSidebar,
  openSidebar,
  closeSidebar,
  toggleTheme,
  setTheme,
  addNotification,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  removeNotification,
  setScreenSize
} = slice.actions;

export default slice.reducer;