/**
 * Centralized API client wrapper with fetch, Bearer token injection,
 * response parsing, and standard error handling.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('access_token');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);

    // If unauthorized and we have a refresh token, try refreshing once
    if (response.status === 401 && !options._isRetry) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refreshToken }),
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            localStorage.setItem('access_token', refreshData.access_token);
            // Retry original request
            return apiRequest(endpoint, {
              ...options,
              _isRetry: true,
              headers: {
                ...headers,
                'Authorization': `Bearer ${refreshData.access_token}`,
              },
            });
          }
        } catch {
          // Refresh failed - clear tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
        }
      }
    }

    // Parse JSON body if present
    let data = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    }

    if (!response.ok) {
      const errorMessage = data?.detail || data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      throw new ApiError(errorMessage, response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network or parsing error
    throw new ApiError(
      error.message || 'Network error occurred. Please check backend connection.',
      0,
      null
    );
  }
}

export default apiRequest;
