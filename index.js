// npm
import Fastify from 'fastify'
import Database from "better-sqlite3"
// import dotenv from "dotenv-safest"

// dotenv.config()

const fastify = Fastify({
  logger: true,
  trustProxy: process.env.TRUSTIP || false,
  bodyLimit: 10 * 1024,
})

const db = new Database("woot.db")
db.pragma('journal_mode = WAL')

db.exec(`
  create table if not exists punchevent (
    id integer primary key,
    now integer not null,
    source text default "pomofocus",
    body json not null,
    headers json not null,
    createdAt timestamp default current_timestamp,
    check (json_valid(body) == 1),
    check (json_valid(headers) == 1)
  )
`)

const insert = db.prepare(`
  INSERT INTO punchevent (
    body,
    headers,
    now
  )
  VALUES (
    json(?),
    json(?),
    ?
  )
`)

fastify.post('/', function (request, reply) {
  const body = JSON.stringify(request.body)
  const headers = JSON.stringify(request.headers)
  const now = Date.now()
  const b = insert.run(body, headers, now)  
  request.log.error(JSON.stringify(b))
  reply.send({ ok: true, now })
})

fastify.listen({ port: process.env.PORT }, function (err) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
})
