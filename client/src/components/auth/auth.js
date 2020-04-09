export default ({
  authenticate(user, cb) {
    for (let key in user) {
      window.localStorage.setItem(key, user[key]);
    }
    window.localStorage.setItem('token', true);
    cb()
  },
  signout(cb) {
    window.localStorage.clear()
    cb()
  },
  isAuthenticated() {
    return window.localStorage.hasOwnProperty('token')
  },
  getUserInfo() {
    return ({
      id: window.localStorage.getItem('_id'),
      username: window.localStorage.getItem('username'),
      email: window.localStorage.getItem('email')
    })
  }
});
