const Auth = {
    getToken: () => localStorage.getItem('jwt_token'),
    setToken: (token: string) => localStorage.setItem('jwt_token', token),
    removeToken: () => localStorage.removeItem('jwt_token'),
  };
  
  export default Auth;
  