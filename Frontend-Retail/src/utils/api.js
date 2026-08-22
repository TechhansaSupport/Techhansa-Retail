export const fetchWithAuth = async (url, options = {}) => {
  const token = sessionStorage.getItem('token');
  
  // Convert any existing headers to a plain object
  const headers = {};
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const newOptions = {
    ...options,
    headers
  };
  
  const response = await fetch(url, newOptions);
  
  if (response.status === 401 || response.status === 403) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  }
  
  return response;
};
