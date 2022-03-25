const db = null

/**
 * lw 新增一项 页面
 */
const add = async (ctx, next) => {
  let menu = await db.op('select * from jing_menu order by id desc')
  ctx.state = {
    menu: menu,
    title: '新增一项',
    dat: 'sys'
  }
  await ctx.render('sys/add', {})
}

/**
 * lw 后台 列表
 */
const root = async (ctx, next) => {
  let book = await db.op('select * from jing_book order by createtime desc')
  console.log(book)
  ctx.state = {
    book: book,
    title: 'koa2 sys',
    dat: 'sys'
  }
  await ctx.render('sys/index', {})
}

export { add, root }
