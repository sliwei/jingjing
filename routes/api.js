/**
 * Created by awei on 2017/3/17.
 */

var router = require('koa-router')();
const db = require('../connect');
/**
 * lw getTest
 */
router.get('/get-test', async function (ctx, next) {
    let dat = ctx.query;
    let message, result, state = true;
    try {
        console.log(dat)
    } catch (e) {
        message = `${e.name}:${e.message}`;
        state = false;
    }
    ctx.body = {result: result, state: state, message: message};
});

/**
 * lw postTest
 */
router.post('/post-test', async function (ctx, next) {
    let dat = ctx.request.body;
    let message, result, state = true;
    try {
        console.log(dat)
    } catch (e) {
        message = `${e.name}:${e.message}`;
        state = false;
    }
    ctx.body = {result: result, state: state, message: message};
});

/**
 * lw login
 */
router.post('/login', async function (ctx, next) {
    let dat = ctx.request.body;
    let message, result, state = true;
    try {
        let user, password;
        user = dat.us;
        password = dat.pw;

        let dan = new RegExp(`\\'`, `g`);
        let sua = new RegExp(`\\"`, `g`);

        user = user.replace(dan, `\\'`);
        user = user.replace(sua, `\\"`);

        result = await db.op(`select * from \`user\` where user='${user}' and password='${password}' limit 1`);
        state = false;
        if(result.length > 0) {
            result = result[0];
            state = true;
        }
    } catch (e) {
        message = `${e.name}:${e.message}`;
        state = false;
    }
    ctx.body = {result: result, state: state, message: message};
});

/**
 * lw 新的BLOG
 */
router.post('/save', async(ctx, next) => {
    let dat = ctx.request.body;
    let err, result, state = true;
    try {
        let users = await db.op(`select * from user where id = ${dat.user_id} and password = '${dat.user_password}'`);
        if(users.length > 0) {
            let time = new Date();
            let create_time, year, month, day, hour, minutes;
            year = time.getFullYear();
            month = time.getMonth() + 1;
            day = time.getDate();
            hour = time.getHours();
            minutes = time.getMinutes();

            year = year.toString();
            year = year.slice(2, 4);
            month < 10 ? month = `0${month}` : null;
            day < 10 ? day = `0${day}` : null;
            hour < 10 ? hour = `0${hour}` : null;
            minutes < 10 ? minutes = `0${minutes}` : null;

            create_time = `${year}年${month}月${day}日${hour}时${minutes}分`;

            let title, content;
            title = dat.title;
            content = dat.content;

            let dan = new RegExp(`\\'`, `g`);
            let sua = new RegExp(`\\"`, `g`);

            title = title.replace(dan, `\\'`);
            title = title.replace(sua, `\\"`);
            content = content.replace(dan, `\\'`);
            content = content.replace(sua, `\\"`);

            let sql = `insert into \`blog\`(user_id,category_id,title,content,is_draft,create_time) values('${dat.user_id}', '${dat.category_id}', '${title}', '${content}', '${dat.is_draft}', '${create_time}')`;
            result = await db.op(sql);
            'insertId' in result ? null : state = false;
        }else{
            err = '登陆信息失效，请重新登陆！';
            state = false;
        }
    } catch (e) {
        err = e.name + ':' + e.message;
        state = false;
    }
    ctx.body = {result: result, state: state, err: err};
});

module.exports = router;
