/**
 * Created by awei on 2017/3/17.
 */

var router = require('koa-router')();

/**
 * lw getTest
 */
router.get('/', async function (ctx, next) {
    ctx.state = {
        title: 'koa2 sys',
        dat: 'sys'
    };

    await ctx.render('sys/index', {
    });
});

module.exports = router;
