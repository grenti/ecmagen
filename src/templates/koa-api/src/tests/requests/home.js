const test = require('tape')
const { request, server } = require('../request')

test('/ route is successful', t => {
  return request
    .get('/')
    .expect(200)
    .then(res => {
      t.equals(res.text, 'Welcome to EcmaGen API!')
      t.end()
    })
})

test('cleanup', t => {
  server.close(() => {
    t.end()
  })
})
