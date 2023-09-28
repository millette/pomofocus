// npm
import Fastify from 'fastify'
import Database from "better-sqlite3"
import dotenv from "dotenv-safest"

dotenv.config()

const db = new Database("woot.db")
db.pragma('journal_mode = WAL')
const insert = db.prepare('INSERT INTO woot (json) VALUES (?)');

const fastify = Fastify({ logger: true })

// TODO: handle route in caddy instead
fastify.post(`/${process.env.ROUTE}`, function (request, reply) {
  const b = insert.run(JSON.stringify({ body: request.body }))
  request.log.info(JSON.stringify(b))
  reply.send({ hello: 'world' })
})

fastify.listen({ port: 3123 }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
