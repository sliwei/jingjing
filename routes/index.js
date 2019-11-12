var router = require('koa-router')();
var cheerio = require('cheerio');
const db = require('../connect');
const conf = require('../config');
const num = conf.num;
var page = conf.page;

router.get('/', async function (ctx, next) {
    ctx.state = {
        title: `絮叨-${conf.title}`,
        route: 'index'
    };
    await ctx.render('index/index', {});
});

router.get('work', async function (ctx, next) {
    // let dat = ctx.query;
    // page = dat.page || 1;
    // let search = dat.search || '0';
    // page = parseInt(page);
    // let field = 'id,title,content,create_time,img,good,bad';
    // let sql = 'from \`blog\` where is_draft = 0 and is_del = 0 order by time desc';
    // if (search != '0') {
    //     sql += ` and (title like '%%${search}%%' or content like '%%${search}%%')`;
    // }
    // let blog = await db.findLimit(field, sql, page, num);
    // blog.rows.map(item => {
    //     var $ = cheerio.load(`<div>${item.content}</div>`);
    //     $('div').find('img').remove();
    //     var t = $('div').find('p');
    //     var t1 = $(t[0]).html();
    //     var t2 = $(t[1]).html();
    //     item.content = t1 ? `<p>${t1}</p><p>${t2}</p>` : '<p>暂无预览 ヽ(￣▽￣)ﾉ</p>';
    // });
    // blog.page = page;
    // blog.num = num;
    // blog.pagel = conf.url + '/blog.html?page=';
    // // console.log(blog);
    ctx.state = {
        title: `与事-${conf.title}`,
        route: 'work',
        blog: {}
    };
    await ctx.render('index/work', {});
});

router.get('info/*', async function (ctx, next) {
    // let dat = ctx.url;
    // let id = dat.substring(6, dat.length - 5);
    // id = parseInt(id);
    // if (id > 0) {
    //     let data = await db.op(`select * from \`blog\` where is_del = 0 and is_draft = 0 and id = ${id}`);
    //     let url = 'index/info';
    //     if (data.length) {
    //         data = data[0];
    //         data.page = '';
    //         if (page > 1) {
    //             data.page = '?page=' + page
    //         }
    //         ctx.state = {
    //             title: data.title + `-${conf.title}`,
    //             data: data
    //         };
    //     } else {
    //         url = 'index/error/error';
    //         ctx.state = {
    //             title: data.title + `-${conf.title}`,
    //         };
    //     }
    ctx.state = {
        title: ''
    };
    let url = 'index/info';
    await ctx.render(url, {});
    // }
});

router.get('about', async function (ctx, next) {
    ctx.state = {
        title: `与我-${conf.title}`,
        route: 'about'
    };

    await ctx.render('index/about', {});
});

router.get('contact', async function (ctx, next) {
    ctx.state = {
        title: `联系-${conf.title}`,
        route: 'contact'
    };

    await ctx.render('index/contact', {});
});

module.exports = router;
