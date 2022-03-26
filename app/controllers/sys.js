import { JingMenu } from '../models'

/**
 * lw 新增一项 页面
 */
const add = async (ctx, next) => {
  const res = await JingMenu.findAll({
    order: [['id', 'DESC']]
  })
  ctx.state = {
    menu: res,
    title: '新增一项',
    dat: 'sys'
  }
  await ctx.render('sys/add', {})
}

/**
 * lw 后台 列表
 */
const root = async (ctx, next) => {
  const res = await JingBook.findAll({
    order: [['createtime', 'DESC']]
  })
  ctx.state = {
    book: res,
    title: 'koa2 sys',
    dat: 'sys'
  }
  await ctx.render('sys/index', {})
}

export { add, root }
