export default async ({ url, method, body }) => {
  let res

  try {
    res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': "*" },
      body: JSON.stringify(body)
    })

    if (res.status !== 200) {
      res = await res.text()
      console.error('failed request :: ', res)
    }
  } catch (error) {
    console.log(`error @ ${url} raw \n`, error)
  }

  try {
    res = await res.json()

  } catch (error) {
    console.log(`error @ ${url} .json() \n`, error)
  }

  return res
}
