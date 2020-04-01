export default ({
  authenticate(cb) {
    window.localStorage.setItem('token', true);
    cb()
  },
  signout(cb) {
    window.localStorage.removeItem('token')
    cb()
  },
  isAuthenticated() {
    return window.localStorage.hasOwnProperty('token')
  }
});
