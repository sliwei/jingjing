import Koa from 'koa'
import views from 'koa-views'
import json from 'koa-json'
import favicon from 'koa-favicon'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import logger from 'koa-logger'
import colors from 'colors'
import { resolve } from 'path'
import { koaSwagger } from 'koa2-swagger-ui'
import mysql from 'mysql2'
import moment from 'moment'
import NP from 'number-precision'
import helmet from 'koa-helmet'

import conf from './config'
import index from './routes'

const app = new Koa()

// 安全插件
app.use(
  helmet({
    contentSecurityPolicy: false
  })
)

// 关闭边界检查
NP.enableBoundaryChecking(false)

// 允许上传文件
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 1000 * 1024 * 1024 // 设置上传文件大小最大限制
    }
  })
)

// 网站图标
app.use(favicon(resolve(__dirname, './public/img', 'favicon.ico')))

// 返回美化json
app.use(json())

// koa-logger
app.use(logger())

// 资源文件
app.use(koaStatic(resolve(__dirname, './public')))

// 模板引擎
app.use(views(resolve(__dirname, './views'), { extension: 'jade' }))

// sql特殊字符处理
const toEscapeString = (val) => {
  return mysql.escape(val)
}
const toEscapeObject = (dat) => {
  for (let key in dat) {
    typeof dat[key] === 'string' && (dat[key] = toEscapeString(dat[key]))
    typeof dat[key] === 'object' && toEscapeObject(dat[key])
  }
  return dat
}

// 加入cookie.get、set及自定义返回格式
app.use(async (ctx, next) => {
  ctx.cookie = {
    set: (k, v, opt) => {
      opt = Object.assign({}, conf.cookieOptions, opt)
      return ctx.cookies.set(k, v, opt)
    },
    get: (k, opt) => {
      opt = Object.assign({}, conf.cookieOptions, opt)
      return ctx.cookies.get(k, opt)
    }
  }

  let msg = {
    0: '失败',
    1: '验证码错误',
    200: '成功',
    400: '请求出错',
    401: '未授权的请求',
    403: '禁止：禁止执行访问',
    404: '找不到：请检查URL以确保路径正确',
    500: '服务器的内部错误',
    503: '服务不可用'
  }
  ctx.json = (dat) => {
    !dat.message && (dat.message = msg[dat.code])
    return dat
  }

  // if (JSON.stringify(ctx.request.body) !== "{}") {
  //   ctx.request.body = toEscape(ctx.request.body);
  // }
  ctx.toEscapeObject = toEscapeObject
  ctx.toEscapeString = toEscapeString

  // 自定义返回格式
  ctx.DATA = {
    data: {},
    message: '',
    code: 200
  }

  // 状态统一判断
  ctx.state = (res) => {
    // 1. (res && ((res && !res.length) || (res.length && res[0]) || res.id))
    // 2. ((res && res.length) ? !!res[0] : !!res)

    // [0]            false
    // [1]            true
    // {}             true
    // {id: 1}        true
    // null           false
    // ''             false
    // 'a'            true
    // ""             false
    // "a"            true
    // undefined      false
    // 1              true
    // 0              false
    // NaN            false

    // 反转
    // return !(res && ((res && !res.length) || (res.length && res[0]) || res.id));
    return !(res && res.length ? res[0] : res)
  }
  await next()
})

// swagger
app.use(
  koaSwagger({
    routePrefix: '/swagger', // host at /swagger instead of default /docs
    swaggerOptions: {
      url: '/api/swagger.json' // example path to json 其实就是之后swagger-jsdoc生成的文档地址
    }
  })
)

// 打印错误到日志
const printErrorPrint = (ctx, err, type = 0) => {
  const title = type ? '业务逻辑错误:' : '服务端错误:'
  if (err.code === 403) {
    return
  }
  // console.log('\x1b[1;31m' + title + '\x1b[m', err)
  let parm
  if (ctx.request.method === 'POST') {
    // console.log('POST入参:', JSON.stringify(ctx.request.body))
    parm = ctx.request.body
  } else {
    // console.log('GET入参:', JSON.stringify(ctx.query))
    parm = ctx.query
  }
  let errType = 'Error'
  if (
    Object.prototype.toString.call(err) === '[object Object]' ||
    Object.prototype.toString.call(err) === '[object Array]'
  ) {
    errType = 'Object'
  }
  // console.log('请求头:', ctx)
  console.log(`### [服务报错 - ${process.env.ENV}]\n
  时间：${moment().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}\n
  ${title}\n
  ${errType === 'Object' ? JSON.stringify(err) : err.toString()}\n
  URL：${ctx.request.url} - ${ctx.request.method}\n
  入参：${JSON.stringify(parm)}`)

  //   msg(JSON.stringify({
  //     'msgtype': 'markdown',
  //     'markdown': {
  //       'title': '[服务报错]',
  //       'text': `### [服务报错 - ${process.env.ENV}]\n
  // 时间：${dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}\n
  // ${title}\n
  // ${JSON.stringify(err)}\n
  // URL：${ctx.request.url} - ${ctx.request.method}\n
  // 入参：${JSON.stringify(parm)}`
  //     },
  //     'at': {
  //       // 'atMobiles': [
  //       //   '150XXXXXXXX'
  //       // ],
  //       'isAtAll': false
  //     }
  //   }));
}

// error 业务逻辑错误
app.use((ctx, next) => {
  return next().catch((err) => {
    printErrorPrint(ctx, err, 0)
    let code = err ? (err.code >= 0 ? err.code : 500) : 500
    ctx.DATA.code = 1
    ctx.DATA.status = err ? err.msg || err.toString() : 'unknown error'
    ctx.body = ctx.DATA
    ctx.status =
      [200, 400, 401, 403, 404, 500, 503].indexOf(code) >= 0 ? code : 200
  })
})

// koa error-handling 服务端、http错误
app.on('error', (err, ctx) => {
  printErrorPrint(ctx, err, 1)
})

// routes
app.use(index.routes(), index.allowedMethods())

// 监听未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('uncaughtException', error)
  // process.exit(1000);
})

// 监听Promise没有被捕获的失败函数
process.on('unhandledRejection', (error) => {
  console.error('unhandledRejection', error)
  // process.exit(1001);
})

process.on('exit', function (code) {
  console.log(`### [服务停止 - ${process.env.ENV}]\n
时间：${dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}\n
CODE：${code}`)

  //   msg(
  //     JSON.stringify({
  //       msgtype: 'markdown',
  //       markdown: {
  //         title: '[服务停止]',
  //         text: `### [服务停止 - ${process.env.ENV}]\n
  // 时间：${dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')}\n
  // CODE：${code}`
  //       },
  //       at: {
  //         // 'atMobiles': [
  //         //   '150XXXXXXXX'
  //         // ],
  //         isAtAll: false
  //       }
  //     })
  //   )
})

export { app }
