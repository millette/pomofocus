// npm
import Fastify from 'fastify'
import Database from "better-sqlite3"

const db = new Database("woot.db")
db.pragma('journal_mode = WAL')
const insert = db.prepare('INSERT INTO woot (json) VALUES (?)');

insert.run(JSON.stringify({ a: "b" }))

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.post('/Qut23Dynwdr', function (request, reply) {
  // fastify.log.info(JSON.stringify(request))
  // fastify.log.info(JSON.stringify(request.body))
  const a = insert.run(JSON.stringify({ request }))
  fastify.log.info(JSON.stringify(a))
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