export const fetchWithAuth = async (url, options = {}) => {
  const token = sessionStorage.getItem('token') || localStorage.getItem('token');
  
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
  
  console.log(`[fetchWithAuth] URL: ${url}, Token present: ${!!token}`);
  
  return fetch(url, newOptions);
};
