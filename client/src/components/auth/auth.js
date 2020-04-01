const auth = {
  isAuthenticated: false,
  authenticate(cb) {
    auth.isAuthenticated = true;
    window.localStorage.setItem('token', true);
    setTimeout(cb, 100); // fake async
  },
  signout(cb) {
    auth.isAuthenticated = false;
    window.localStorage.removeItem('token')
    setTimeout(cb, 100);
  }
};

export default auth
