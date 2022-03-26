import { JingBook } from '../models'
import conf from '../config'

const root = async (ctx, next) => {
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
  const pageIndex = 1,
    pageSize = 10
  const offset = pageIndex * pageSize - pageSize
  const res = await JingBook.findAndCountAll({
    where: {
      is_del: 0,
      menu_id: 1
    },
    order: [['createtime', 'DESC']],
    offset: offset,
    limit: pageSize
  })
  ctx.state = {
    book: res.rows,
    title: `公开课-${conf.title}`,
    route: 'index',
    previous: '/#',
    next: '/page/2'
  }
  await ctx.render('index/index', {})
}

const page = async (ctx, next) => {
  const pageSize = 10
  let pageIndex = ctx.params.page || 1
  if (pageIndex) {
    pageIndex = parseInt(pageIndex)
  }
  const offset = pageIndex * pageSize - pageSize
  const res = await JingBook.findAndCountAll({
    where: {
      is_del: 0,
      menu_id: 1
    },
    order: [['createtime', 'DESC']],
    offset: offset,
    limit: pageSize
  })
  let previous = '/#'
  if (page > 1) {
    previous = `/page/${pageIndex - 1}`
  }
  ctx.state = {
    book: res.rows,
    title: `絮叨-${conf.title}`,
    route: 'index',
    previous: previous,
    next: `/page/${pageIndex + 1}`
  }
  await ctx.render('index/index', {})
}

const work = async (ctx, next) => {
  const pageIndex = 1,
    pageSize = 10
  const offset = pageIndex * pageSize - pageSize
  const res = await JingBook.findAndCountAll({
    where: {
      is_del: 0,
      menu_id: 2
    },
    order: [['createtime', 'DESC']],
    offset: offset,
    limit: pageSize
  })
  ctx.state = {
    book: res.rows,
    title: `絮叨-${conf.title}`,
    route: 'work',
    previous: '/#',
    next: '/page/2'
  }
  await ctx.render('index/work', {})
}

const info = async (ctx, next) => {
  let dat = ctx.url
  let urls = dat.replace('/info', '')

  ctx.state = {
    title: `jingjing-${conf.title}`,
    urls: `https://mp.weixin.qq.com/s${urls}`
  }
  let url = 'index/info'
  await ctx.render(url, {})
}

const about = async (ctx, next) => {
  const pageIndex = 1,
    pageSize = 10
  const offset = pageIndex * pageSize - pageSize
  const res = await JingBook.findAndCountAll({
    where: {
      is_del: 0,
      menu_id: 3
    },
    order: [['createtime', 'DESC']],
    offset: offset,
    limit: pageSize
  })
  ctx.state = {
    book: res.rows,
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
