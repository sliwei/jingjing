import koaRouter from 'koa-router'
import swaggerJsdoc from 'swagger-jsdoc'
import { join } from 'path'

const router = new koaRouter()

const options = {
  definition: {
    openapi: '3.0.1',
    info: {
      description: '服务端',
      version: '1.0.0',
      title: '服务端'
    },
    host: '',
    basePath: '/',
    tags: [
      {
        name: 'server',
        description: 'auth'
      }
    ],
    schemes: ['http', 'https'],
    // components: {
    //   schemas: {
    //     Order: {
    //       type: 'object'
    //     }
    //   },
    //   securitySchemes: {
    //     BasicAuth: { type: 'http', scheme: 'basic' }
    //   }
    // }
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [join(__dirname, '../controllers/*.js')]
}
const openapiSpecification = swaggerJsdoc(options)
// 数据校验
import parameter from '../utils/parameter'
// token校验
import { checkToken } from '../utils/tool/token'
// 验证码校验
import { checkCode } from '../utils/tool/verification'

import { get, post } from '../controllers/test'
import { code } from '../controllers/verification'
import { fzf } from '../controllers/fzf'
import * as api from '../controllers/api'
import * as sys from '../controllers/sys'
import * as index from '../controllers/index'
// test
router.get('/test/get', get)
router.post('/test/post', post)
// verification
router.get('/verification/code', parameter, code)
// swagger
router.get('/api/swagger.json', async function (ctx) {
  ctx.set('Content-Type', 'application/json')
  ctx.body = openapiSpecification
})
// api
router.post('/api/upload', api.upload)
router.post('/api/save', api.save)
router.post('/api/del', api.del)
// sys
router.get('/sys/add', sys.add)
router.get('/sys', sys.root)
// index
router.get('/resume', index.resume)
router.get('/home', index.home)
router.get('/page/:page', index.page)
router.get('/work', index.work)
router.get('/info/*', index.info)
router.get('/about', index.about)
router.get('/contact', index.contact)
router.get('/', index.root)
// fzf
router.get('*', fzf)

export default router
