const db = null
const conf = require('../config')

const root = async (ctx, next) => {
  let sql =
    'from jing_book where is_del = 0 and menu_id = 1 order by createtime desc'
  let book = await db.findLimit('*', sql, 1, 10)
  ctx.state = {
    book: book.rows,
    title: `公开课-${conf.title}`,
    route: 'index',
    previous: '/#',
    next: '/page/2'
  }
  await ctx.render('index/class', {})
}

const resume = async (ctx, next) => {
  ctx.state = {
    title: `简历-${conf.title}`,
    route: 'resume'
  }

  await ctx.render('index/resume', {})
}

const home = async (ctx, next) => {
  let sql =
    'from jing_book where is_del = 0 and menu_id = 1 order by createtime desc'
  let book = await db.findLimit('*', sql, 1, 10)
  ctx.state = {
    book: book.rows,
    title: `絮叨-${conf.title}`,
    route: 'index',
    previous: '/#',
    next: '/page/2'
  }
  await ctx.render('index/index', {})
}

const page = async (ctx, next) => {
  let page = ctx.params.page || 1
  if (page) {
    page = parseInt(page)
  }
  let sql = 'from jing_book where is_del = 0 order by createtime desc'
  let book = await db.findLimit('*', sql, page, 10)
  let previous = '/#'
  if (page > 1) {
    previous = `/page/${page - 1}`
  }
  ctx.state = {
    book: book.rows,
    title: `絮叨-${conf.title}`,
    route: 'index',
    previous: previous,
    next: `/page/${page + 1}`
  }
  await ctx.render('index/index', {})
}

const work = async (ctx, next) => {
  let sql =
    'from jing_book where is_del = 0 and menu_id = 2 order by createtime desc'
  let book = await db.findLimit('*', sql, 1, 10)
  ctx.state = {
    book: book.rows,
    title: `絮叨-${conf.title}`,
    route: 'work',
    previous: '/#',
    next: '/page/2'
  }
  await ctx.render('index/work', {})
}

const info = async (ctx, next) => {
  let dat = ctx.url
  console.log(dat)
  let urls = dat.replace('/info', '')
  console.log(urls)

  ctx.state = {
    title: `jingjing-${conf.title}`,
    urls: `https://mp.weixin.qq.com/s${urls}`
  }
  let url = 'index/info'
  await ctx.render(url, {})
  // }
}

const about = async (ctx, next) => {
  let sql =
    'from jing_book where is_del = 0 and menu_id = 3 order by createtime desc'
  let book = await db.findLimit('*', sql, 1, 10)
  ctx.state = {
    book: book.rows,
    title: `絮叨-${conf.title}`,
    route: 'about',
    previous: '/#',
    next: '/page/2'
  }
  await ctx.render('index/about', {})
}

const contact = async (ctx, next) => {
  ctx.state = {
    title: `联系-${conf.title}`,
    route: 'contact'
  }

  await ctx.render('index/contact', {})
}

export { root, resume, home, page, work, info, about, contact }
