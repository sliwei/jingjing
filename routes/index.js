var router = require('koa-router')();
var cheerio = require('cheerio');
const db = require('../connect');
const conf = require('../config');
const num = conf.num;
var page = conf.page;

router.get('/', async function (ctx, next) {
	let sql = 'from jing_book where is_del = 0 and menu_id = 1 order by createtime desc';
	let book = await db.findLimit('*', sql, 1, 10);
	ctx.state = {
		book: book.rows,
		title: `公开课-${conf.title}`,
		route: 'index',
		previous: '/#',
		next: '/page/2',
	};
	await ctx.render('index/class', {});
});

router.get('resume', async function (ctx, next) {
	ctx.state = {
		title: `简历-${conf.title}`,
		route: 'resume'
	};

	await ctx.render('index/resume', {});
});

router.get('/home', async function (ctx, next) {
	let sql = 'from jing_book where is_del = 0 and menu_id = 1 order by createtime desc';
	let book = await db.findLimit('*', sql, 1, 10);
	ctx.state = {
		book: book.rows,
		title: `絮叨-${conf.title}`,
		route: 'index',
		previous: '/#',
		next: '/page/2',
	};
	await ctx.render('index/index', {});
});

router.get('page/:page', async function (ctx, next) {
	let page = ctx.params.page || 1;
	if (page) {
		page = parseInt(page);
	}
	let sql = 'from jing_book where is_del = 0 order by createtime desc';
	let book = await db.findLimit('*', sql, page, 10);
	let previous = '/#';
	if (page > 1) {
		previous = `/page/${page - 1}`
	}
	ctx.state = {
		book: book.rows,
		title: `絮叨-${conf.title}`,
		route: 'index',
		previous: previous,
		next: `/page/${page + 1}`,
	};
	await ctx.render('index/index', {});
});

router.get('work', async function (ctx, next) {
	let sql = 'from jing_book where is_del = 0 and menu_id = 2 order by createtime desc';
	let book = await db.findLimit('*', sql, 1, 10);
	ctx.state = {
		book: book.rows,
		title: `絮叨-${conf.title}`,
		route: 'work',
		previous: '/#',
		next: '/page/2',
	};
	await ctx.render('index/work', {});
});

router.get('info/*', async function (ctx, next) {
	let dat = ctx.url;
	console.log(dat);
	let urls = dat.replace('/info', '');
	console.log(urls);

	ctx.state = {
		title: `jingjing-${conf.title}`,
		urls: `https://mp.weixin.qq.com/s${urls}`
	};
	let url = 'index/info';
	await ctx.render(url, {});
	// }
});

router.get('about', async function (ctx, next) {
	let sql = 'from jing_book where is_del = 0 and menu_id = 3 order by createtime desc';
	let book = await db.findLimit('*', sql, 1, 10);
	ctx.state = {
		book: book.rows,
		title: `絮叨-${conf.title}`,
		route: 'about',
		previous: '/#',
		next: '/page/2',
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
