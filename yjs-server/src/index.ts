import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { initShortStoryYJS } from './shortStoryYJS.js'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})


const shortStoryYJSServer = initShortStoryYJS();
shortStoryYJSServer.listen();

process.on('exit', () => {
  shortStoryYJSServer.destroy();
})
process.on('SIGINT', () => {
  shortStoryYJSServer.destroy();
})
process.on('SIGTERM', () => {
  shortStoryYJSServer.destroy();
})