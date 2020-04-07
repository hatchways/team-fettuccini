export default ({
  authenticate(user, cb) {
    for (let key in user) {
      // console.log('key', key)
      // console.log('user[key]', user[key])
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
    // let user = {
    //   id: window.localStorage.getItem('_id'),
    //   username: window.localStorage.getItem('username'),
    //   email: window.localStorage.getItem('email')
    // }
    return ({
      id: window.localStorage.getItem('_id'),
      username: window.localStorage.getItem('username'),
      email: window.localStorage.getItem('email')
    })
  }
});
