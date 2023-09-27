// ESM
import Fastify from 'fastify'

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.post('/', function (request, reply) {
  fastify.log.info(request)
  fastify.log.info(request.body)
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
