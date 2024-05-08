require('dotenv').config()
const amqplib = require('amqplib')
const uuid = require('uuid')
const redis = require('redis')
const Koa = require('koa')
const Router = require('koa-router')
const session = require('koa-session')
const bodyParser = require('koa-bodyparser')
const logger = require('./lib/logger.js')
const sms = require('./lib/sms.js')

const broker = 'rpc'
const app = new Koa()
const router = new Router()

let rabbitStatus = false

app.keys = ['iueaskhetdsfkeuirydsfkhg']

const core = {
  logger,
  sms
}

core.cache = new redis.createClient(
  process.env.REDIS_PORT,
  process.env.REDIS_HOST
)

app.use(session(app))
app.use(async (ctx, next) => {
  ctx.session.id = ctx.session.id || uuid.v4()
  await next()
})
app.use(bodyParser())

amqplib
  .connect(process.env.RABBITMQ_HOST)
  .then(connection =>
    connection.createChannel().then(channel => {
      rabbitStatus = true

      var sendApi = pack => {
        return new Promise(resolve => {
          const correlationId = uuid.v4()
          /* eslint-disable */
          let ok = channel
            /* eslint-enable */
            .assertQueue('', {
              exclusive: true
            })
            .then(result => result.queue)
          ok = ok.then(queue => {
            return channel
              .consume(
                queue,
                message => {
                  if (message.properties.correlationId === correlationId) {
                    resolve(message.content.toString())
                  }
                },
                {
                  noAck: true
                }
              )
              .then(() => queue)
          })
          ok = ok.then(queue => {
            channel.sendToQueue(broker, Buffer.from(JSON.stringify(pack)), {
              correlationId,
              replyTo: queue
            })
          })
        })
      }

      router.post('/api/auth/check', async ctx => {
        let error = 'В доступе отказано'
        let result = {}
        ctx.session.auth = ctx.session.auth || {}
        if (ctx.session.auth.enter && ctx.session.auth.confirm) {
          error = null
          if (ctx.request.body.loadProfile) {
            result = {
              profile: ctx.session.profile
            }
          }
        }
        ctx.body = JSON.stringify({
          error,
          result
        })
      })

      router.post('/api/auth/signout', async ctx => {
        ctx.session = null
        ctx.body = JSON.stringify({
          error: null
        })
      })

      router.post('/api/auth/signin/confirm', async ctx => {
        try {
          await core.sms.check(core, {
            session: ctx.session.id,
            action: 'signin',
            code: ctx.request.body.code
          })
          ctx.session.auth.confirm = true
          ctx.body = JSON.stringify({
            error: null,
            result: {
              profile: ctx.session.profile
            }
          })
        } catch (error) {
          ctx.body = JSON.stringify({
            error
          })
        }
      })

      router.post('/api/auth/signin/enter', async ctx => {
        const pack = {
          method: 'auth.signin',
          param: ctx.request.body
        }
        const result = await sendApi(pack)
        const data = JSON.parse(result)
        if (data.error === null) {
          try {
            const result = await core.sms.send(core, {
              session: ctx.session.id,
              action: 'signin'
            })
            ctx.session.profile = {
              login: data.result.login
            }
            ctx.session.auth = {
              enter: true,
              confirm: false
            }
            ctx.body = JSON.stringify({
              error: null,
              result
            })
          } catch (error) {
            ctx.body = JSON.stringify({
              error
            })
          }
        } else {
          ctx.body = result
        }
      })

      router.post('/api/auth/signup', async ctx => {
        const pack = {
          method: 'auth.signup',
          param: ctx.request.body
        }
        ctx.body = await sendApi(pack)
      })

      router.get('/healthcheck', async ctx => {
        if (rabbitStatus) ctx.status = 200
        else ctx.status = 400
      })

      app.use(router.routes())
      app.listen(3000)
    })
  )
  .catch(error => {
    logger.fatal(error)
  })
