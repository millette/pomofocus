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

const db = new Database("woot.db", { readonly: true, fileMustExist: true })
db.pragma('journal_mode = WAL')

const latest = db.prepare(`
  select id,
    datetime(now / 1000, 'unixepoch') as now,
    source,
    json_extract(body, '$.round') as round,
    json_extract(body, '$.type') as type,
    json_extract(body, '$.project') as project,
    json_extract(body, '$.task') as task,
    datetime(json_extract(body, '$.session_start') / 1000, 'unixepoch') as session_start,
    datetime(json_extract(body, '$.session_end') / 1000, 'unixepoch') as session_end,
    json_extract(body, '$.seconds') as seconds,
    json_extract(headers, '$.user-agent') as user_agent,
    json_extract(headers, '$.x-forwarded-for') as x_forwarded_for,
    createdAt
  from punchevent
  order by id desc
  limit @limit
`)

const fetchLatest = (limit = -1) => latest.all({ limit })

fastify.get('/', (request, reply) => reply.send(fetchLatest(request.query.n)))

fastify.get('/p', (request, reply) => reply.send(JSON.stringify(fetchLatest(request.query.n), null, 2)))

fastify.listen({ port: 1212 }, function (err, more) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }

  fastify.log.info(more)
})
