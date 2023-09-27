// npm
import Fastify from 'fastify'
import Database from "better-sqlite3"
import dotenv from "dotenv-safest"

dotenv.config()

const db = new Database("woot.db")
db.pragma('journal_mode = WAL')
const insert = db.prepare('INSERT INTO woot (json) VALUES (?)');

insert.run(JSON.stringify({ a: "b" }))

const fastify = Fastify({
  logger: {
    prettyPrint: true
  }
})

// Declare a route
fastify.post(`/${process.env.ROUTE}`, function (request, reply) {
  const b = insert.run(JSON.stringify({ body: request.body }))
  fastify.log.info(JSON.stringify(b))
  reply.send({ hello: 'world' })
})

// Run the server!
fastify.listen({ port: 3123 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})
