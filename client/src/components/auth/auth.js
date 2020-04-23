export default ({
  authenticate(user, cb) {
    console.log('user ', user)
    for (let key in user) {
      window.sessionStorage.setItem(key, user[key]);
    }
    window.sessionStorage.setItem('token', true);
    cb()
  },
  signout(cb) {
    window.sessionStorage.clear()
    cb()
  },
  isAuthenticated() {
    return window.sessionStorage.hasOwnProperty('token')
  },
  getUserInfo() {
    return ({
      id: window.sessionStorage.getItem('_id'),
      name: window.sessionStorage.getItem('username'),
      email: window.sessionStorage.getItem('email')
    })
  }
});
