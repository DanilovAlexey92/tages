const async = require('async')
const crypto = require('crypto')
const validator = require('validator')

module.exports = (core, param, next) => {
  const result = {}
  async.series(
    [
      cb => {
        if (
          validator.isLength(param.login, {
            min: 2,
            max: 15
          }) &&
          /^([A-Za-z0-9])+$/.test(param.login)
        ) {
          cb()
        } else {
          cb('Недопустимое значение поля login')
        }
      },
      cb => {
        if (
          validator.isLength(param.password, {
            min: 2,
            max: 15
          })
        ) {
          cb()
        } else {
          cb('Недопустимое значение поля password')
        }
      },
      cb => {
        result.password = crypto
          .createHash('sha256')
          .update(param.password)
          .digest('base64')
        cb()
      }
    ],
    async error => {
      if (error) {
        next({
          error
        })
      } else {
        let query =
          `SELECT` +
          '\n' +
          `  login,` +
          '\n' +
          `  fullname,` +
          '\n' +
          `  email,` +
          '\n' +
          `  phone,` +
          '\n' +
          `  city,` +
          '\n' +
          `  country,` +
          '\n' +
          `  osphone` +
          '\n' +
          `FROM users` +
          '\n' +
          `WHERE` +
          '\n' +
          `  login = $1` +
          '\n' +
          `  AND password = $2`
        try {
          result.data = await core.pool.query(query, [
            param.login,
            result.password
          ])
          if (result.data.rowCount == 1) {
            next({
              error: null,
              result: {
                login: result.data.rows[0].login
              }
            })
          } else {
            next({
              error: 'Неверно указан логин или пароль'
            })
          }
        } catch (error) {
          core.logger.error(error)
          next({
            error: 'Ошибка с базой'
          })
        }
      }
    }
  )
}
