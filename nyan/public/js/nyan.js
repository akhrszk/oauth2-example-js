const nyan = async (message) => {
  await fetch('/api/nyan', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `message=${encodeURIComponent(message)}`
  })
}
