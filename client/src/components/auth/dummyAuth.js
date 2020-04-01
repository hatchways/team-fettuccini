const user = {
  email: 'pavelmachuca@hotmail.com',
  password: '123123'
}

export default function (payload) {
  let res = {}
  if (payload.hasOwnProperty('name')) {
    // signup
    res.token = "passed"
  } else {
    // login
    if (payload.email !== user.email || payload.password !== user.password) {
      res.error = "wrong name"
    } else {
      res.token = "passed"
    }
  }
  return res
}
