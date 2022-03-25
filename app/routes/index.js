const router = require('koa-router')()
const swaggerJsdoc = require('swagger-jsdoc')
const { join } = require('path')

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
const parameter = require('../utils/parameter')
// token校验
const { checkToken } = require('../utils/tool/token')
// 验证码校验
const { checkCode } = require('../utils/tool/verification')

const { get, post } = require('../controllers/test')
const { code } = require('../controllers/verification')
const { fzf } = require('../controllers/fzf')
const api = require('../controllers/api')
const sys = require('../controllers/sys')
const index = require('../controllers/index')
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

module.exports = router
