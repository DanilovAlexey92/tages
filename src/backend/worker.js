require('dotenv').config()
const amqplib = require('amqplib')
const util = require('util')
const pg = require('pg')
const logger = require('./lib/logger.js')

const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

let rabbitStatus = false

const broker = 'rpc'
const schema = {
  user: `CREATE TABLE IF NOT EXISTS users (
  ID SERIAL PRIMARY KEY,
  login VARCHAR(15),
  password VARCHAR(500),
  fullname VARCHAR(40),
  email VARCHAR(30),
  phone VARCHAR(12),
  city VARCHAR(50),
  country VARCHAR(50),
  osphone VARCHAR(20)
);`,
  index: `CREATE UNIQUE INDEX IF NOT EXISTS ix_login ON users (login);`
}

const pool = new pg.Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DB,
  password: process.env.PG_PASS,
  port: process.env.PG_PORT
})

pool.query = util.promisify(pool.query)

const core = {
  logger,
  pool
}

const method = {
  'auth.signin': require('./api/auth.signin.js'),
  'auth.signup': require('./api/auth.signup.js')
}

;(async () => {
  try {
    await pool.query(schema.user)
    await pool.query(schema.index)
  } catch (error) {
    pool.end()
    logger.fatal(error)
    return
  }
})()

amqplib
  .connect(process.env.RABBITMQ_HOST)
  .then(connection => {
    connection
      .createChannel()
      .then(channel => {
        rabbitStatus = true

        router.get('/healthcheck', async ctx => {
          if (rabbitStatus) ctx.status = 200
          else ctx.status = 400
        })

        app.use(router.routes())
        app.listen(5000, () => {
          console.log('Server start')
        })

        return channel
          .assertQueue(broker, {
            durable: false
          })
          .then(() => {
            channel.prefetch(1)
            return channel.consume(broker, message => {
              const pack = JSON.parse(message.content.toString())
              method[pack.method](core, pack.param, data => {
                channel.sendToQueue(
                  message.properties.replyTo,
                  Buffer.from(JSON.stringify(data)),
                  { correlationId: message.properties.correlationId }
                )
                channel.ack(message)
              })
            })
          })
      })
      .catch(logger.error)
  })
  .catch(error => {
    pool.end()
    logger.fatal(error)
  })
