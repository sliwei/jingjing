const db = require('../connect');

/**
 * Created by awei on 2017/3/17.
 */

var router = require('koa-router')();

/**
 * lw 新增一项 页面
 */
router.get('/add', async function (ctx, next) {
    let menu = await db.op('select * from jing_menu order by id desc');
    ctx.state = {
        menu: menu,
        title: '新增一项',
        dat: 'sys'
    };
    await ctx.render('sys/add', {});
});

/**
 * lw 后台 列表
 */
router.get('/', async function (ctx, next) {
    let book = await db.op('select * from jing_book order by createtime desc');
    console.log(book);
    ctx.state = {
        book: book,
        title: 'koa2 sys',
        dat: 'sys'
    };
    await ctx.render('sys/index', {
    });
});

module.exports = router;
