const async = require('async')

const TTL_SMS_CODE = 30

module.exports.send = (core, param) =>
  new Promise((resolve, reject) => {
    const result = {}
    async.series(
      [
        cb => {
          const min = 1000000
          const max = 9000000
          result.code = String(
            Math.floor(Math.random() * (max - min + 1)) + min
          ).slice(0, 4)
          result.text = result.code
          if (param.action === 'signin') {
            result.text = `SMS-ключ ${result.code} для входа`
          }
          cb()
        },
        cb => {
          core.cache.set(
            `code:${param.session}:${param.action}`,
            result.code,
            'EX',
            TTL_SMS_CODE,
            error => {
              if (error) {
                core.logger.error(error)
                cb('Ошибка с кэшем')
              } else {
                cb()
              }
            }
          )
        }
      ],
      error => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  })

module.exports.check = (core, param) =>
  new Promise((resolve, reject) => {
    const result = {}
    async.series(
      [
        cb => {
          core.cache.get(
            `code:${param.session}:${param.action}`,
            (error, data) => {
              if (error) {
                core.logger.error(error)
                cb('Ошибка с кэшем')
              } else {
                if (data === param.code) {
                  cb()
                } else {
                  cb('Неверный SMS-ключ')
                }
              }
            }
          )
        }
      ],
      error => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )
  })
