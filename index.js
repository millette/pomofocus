// npm
import Fastify from 'fastify'
import Database from "better-sqlite3"
import dotenv from "dotenv-safest"

dotenv.config()

const db = new Database("woot.db")
db.pragma('journal_mode = WAL')

// TODO: actual column values instead of JSON
const insert = db.prepare('INSERT INTO woot (json) VALUES (?)');

const fastify = Fastify({ logger: true, trustProxy: process.env.TRUSTIP && [process.env.TRUSTIP] })

// TODO: handle route in caddy instead
fastify.post(`/${process.env.ROUTE}`, function (request, reply) {
  const b = insert.run(JSON.stringify({ body: request.body, headers: request.headers, now: Date.now() }))
  request.log.info(JSON.stringify(b))
  reply.send({ hello: 'world' })
})

fastify.listen({ port: process.env.PORT || 3123 }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
