import Fastify, { FastifyInstance } from 'fastify'
import cors from '@fastify/cors'
import {Server} from '@habeetat/jrpc-server';

const server: FastifyInstance = Fastify({})

const jrpcServer = new Server({
    name: 'jrpc-server',
    version: '1.0.0',
    description: 'demo server',
});

jrpcServer.addMethod({
    "name": "hello",
    "description": "A simple hello world method",
    "params": [
        {
            "name": "name",
            "description": "The name of the person to say hello to",
            "schema": {
                "type": [
                    "string",
                    "null"
                ]
            }
        }
    ],
    "result": {
        "name": "result",
        "description": "The result of the hello world method",
        "schema": {
            "type": "string"
        }
    }
}, (name?: string): string => {
    if (!name) {
        return 'Hello World!';
    }
    return `Hello ${name}!`;
});

server.post('/jrpc', async (request, reply) => {
    const {body} = request;
    const result = await jrpcServer.executeRequest(JSON.stringify(body));
    reply.send(result);
})

server.get('/jrpc/schema', async (request, reply) => {
    const schema = jrpcServer.getSchema();
    reply.send(schema);
});

const start = async () => {
  try {
    await server.register(cors, {})
    await server.listen({ port: 3000, host: '0.0.0.0' })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

    console.log(`server listening on port: ${port}`)

  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}
start()