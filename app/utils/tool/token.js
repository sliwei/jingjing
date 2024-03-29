import jwt from 'jsonwebtoken'
import conf from '../../config'
import { HttpError } from './error'

/**
 * 创建token
 * @param dat
 * @returns {*}
 */
const createToken = function (dat) {
  return jwt.sign(dat, conf.tokenObs, {
    expiresIn: conf.cookieOptions.maxAge / 1000 + 's'
  })
}

/**
 * 检测token合法性
 * @param ctx
 * @param next
 * @returns {Promise<void>}
 */
const checkToken = async (ctx, next) => {
  // Authorization TODO:如果需要允许所有跨域，那么只有不使用cookie，改为Authorization存token
  const token = ctx.get('Authorization')
  // const token = ctx.cookie.get('token');
  if (!token) {
    throw new HttpError(401)
  }
  try {
    jwt.verify(token, conf.tokenObs, function (err, decoded) {
      if (err) {
        throw new HttpError(401)
      } else {
        ctx.res.USER = decoded
      }
    })
  } catch (err) {
    throw new HttpError(401)
  }
  await next()
}

export { createToken, checkToken }
