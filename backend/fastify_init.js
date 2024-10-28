const fastify = require('fastify')({
  logger: true
})
// const jwt = require('jsonwebtoken');
const fastifyCors = require('@fastify/cors');
const fastifyStatic = require('@fastify/static');

fastify.register(fastifyStatic, {
  root: '/app/dist/'
})

fastify.addHook('preValidation', async (request, reply) => {

  let urlToParse = request.url;
  if (urlToParse.includes('?'))
      urlToParse = urlToParse.substring(0, urlToParse.indexOf('?'));
  
  if(urlToParse.startsWith('/api/'))
  {
    const endpointsWhitelist = ['/api/loginUser', '/api/status'];
    if (!endpointsWhitelist.includes(urlToParse)) {
        if (!jwt.verify(request.body.jwt, process.env.JWT_SECRET))
            reply
                .code(401)
                .header('Content-Type', 'application/json; charset=utf-8')
                .send({ success: false, msg: "Unauthorized", code: 401 })
    }
  }
})

fastify.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS', 'HEAD']
});

// fastify.setNotFoundHandler((req, res) => {
//   res.sendFile('index.html')
// })

module.exports = fastify