export const environment = {
  production: false,
  apiUrl: 'https://localhost:7281/api',
  endpoints: {
    auth: '/auth',
    booking: '/booking',
    services: '/services'
  }
};

// For production, replace with actual API URL
export const environmentProd = {
  production: true,
  apiUrl: 'https://api.yoursaloonapp.com/api',
  endpoints: {
    auth: '/auth',
    booking: '/booking',
    services: '/services'
  }
};
