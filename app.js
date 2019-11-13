const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const co = require('co');
const convert = require('koa-convert');
const koaBody = require('koa-body');
const favicon = require('koa-favicon');
const json = require('koa-json');
const onerror = require('koa-onerror');
// const bodyparser = require('koa-bodyparser')();
const logger = require('koa-logger');
const conf = require('./config');

const index = require('./routes/index');
const sys = require('./routes/sys');
const api = require('./routes/api');

// 允许上传文件
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 1000 * 1024 * 1024, // 设置上传文件大小最大限制
  }
}));

// middlewares
app.use(favicon(__dirname + '/public/p/favicon.ico'));
// app.use(convert(bodyparser));
app.use(convert(json()));
app.use(convert(logger()));
app.use(convert(require('koa-static')(__dirname + '/public')));

app.use(views(__dirname + '/views', {
  extension: 'jade'
}));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

router.use('/api', api.routes(), api.allowedMethods());
router.use('/sys', sys.routes(), sys.allowedMethods());
router.use('/', index.routes(), index.allowedMethods());

app.use(router.routes(), router.allowedMethods());
// response

app.on('error', async function(err, ctx){
  console.log(49,err);
  // await ctx.render('/');
  // logger.error('server error', err, ctx);
});

module.exports = app;
