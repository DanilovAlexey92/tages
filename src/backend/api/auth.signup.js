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
          validator.isLength(param.fullname, {
            min: 2,
            max: 40
          }) &&
          validator.isAlpha(param.fullname.replace(/ /g, ''), ['ru-RU'])
        ) {
          cb()
        } else {
          cb('Недопустимое значение поля fullname')
        }
      },
      cb => {
        if (validator.isEmail(param.email)) {
          cb()
        } else {
          cb('Недопустимое значение поля email')
        }
      },
      cb => {
        if (
          validator.isLength(param.phone, {
            min: 12,
            max: 12
          }) &&
          /^((\+7)+([0-9]){10})$/.test(param.phone)
        ) {
          cb()
        } else {
          cb('Недопустимое значение поля phone')
        }
      },
      cb => {
        if (
          validator.isLength(param.city, {
            min: 2,
            max: 50
          }) &&
          validator.isAlpha(param.city.replace(/ /g, ''), ['ru-RU'])
        ) {
          cb()
        } else {
          cb('Недопустимое значение поля city')
        }
      },
      cb => {
        if (
          validator.isLength(param.country, {
            min: 2,
            max: 50
          }) &&
          validator.isAlpha(param.country.replace(/ /g, ''), ['ru-RU'])
        ) {
          cb()
        } else {
          cb('Недопустимое значение поля country')
        }
      },
      cb => {
        if (validator.isLength(param.osphone, { min: 2, max: 20 })) {
          cb()
        } else {
          cb('Недопустимое значение поля osphone')
        }
      },
      cb => {
        result.password = String(Math.random() * 1000)
          .replace('.', '')
          .slice(0, 4)
        param.password = crypto
          .createHash('sha256')
          .update(result.password)
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
          `INSERT INTO users (` +
          '\n' +
          `  login,` +
          '\n' +
          `  password,` +
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
          `) VALUES (` +
          '\n' +
          `  $1,` +
          '\n' +
          `  $2,` +
          '\n' +
          `  $3,` +
          '\n' +
          `  $4,` +
          '\n' +
          `  $5,` +
          '\n' +
          `  $6,` +
          '\n' +
          `  $7,` +
          '\n' +
          `  $8` +
          '\n' +
          `)`
        try {
          await core.pool.query(query, [
            param.login,
            param.password,
            param.fullname,
            param.email,
            param.phone,
            param.city,
            param.country,
            param.osphone
          ])
          next({
            error: null,
            result
          })
        } catch (error) {
          let text = 'Ошибка с базой'
          if (error.code == 23505) {
            text = 'Такой логин уже существует'
          } else {
            core.logger.error(error)
          }
          next({
            error: text
          })
        }
      }
    }
  )
}
