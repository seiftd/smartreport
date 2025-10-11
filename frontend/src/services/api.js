const API_BASE_URL = 'https://smartreport-pro-backendone.vercel.app/api';

export const fetchUserStats = async (token) => {
  const response = await fetch(`${API_BASE_URL}/user/stats`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const fetchReports = async (token) => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const fetchTemplates = async (token) => {
  const response = await fetch(`${API_BASE_URL}/templates`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const createReport = async (token, reportData) => {
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportData)
  });
  return response.json();
};

export const updateReport = async (token, reportId, reportData) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportData)
  });
  return response.json();
};

export const deleteReport = async (token, reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const downloadReport = async (token, reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.blob();
};

// Subscription API
export const getSubscription = async (token) => {
  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const upgradeSubscription = async (token, planId) => {
  const response = await fetch(`${API_BASE_URL}/subscription/upgrade`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ planId })
  });
  return response.json();
};

export const cancelSubscription = async (token) => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/cancel`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const getBillingHistory = async (token) => {
  const response = await fetch(`${API_BASE_URL}/subscription/billing`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Notifications API
export const getNotifications = async (token) => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const markNotificationAsRead = async (token, notificationId) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const deleteNotification = async (token, notificationId) => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

// Additional Subscription API functions

export const updateSubscriptionPlan = async (token, planData) => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/plan`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(planData)
  });
  return response.json();
};

// Additional subscription functions
export const getSubscriptionUsage = async (token) => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/usage`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const updateSubscriptionUsage = async (token, usageData) => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/usage`, {
    method: 'PUT',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(usageData)
  });
  return response.json();
};

export const checkFeatureAccess = async (token, feature, currentUsage = 0) => {
  const response = await fetch(`${API_BASE_URL}/subscriptions/check-feature`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ feature, currentUsage })
  });
  return response.json();
};

// Enhanced Templates API
export const getTemplateById = async (token, templateId) => {
  const response = await fetch(`${API_BASE_URL}/templates/${templateId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};

export const createCustomTemplate = async (token, templateData) => {
  const response = await fetch(`${API_BASE_URL}/templates`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(templateData)
  });
  return response.json();
};

// Report Generation API
export const generateReport = async (token, reportData) => {
  const response = await fetch(`${API_BASE_URL}/reports/generate`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reportData)
  });
  return response.json();
};

export const getReportById = async (token, reportId) => {
  const response = await fetch(`${API_BASE_URL}/reports/${reportId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
};
