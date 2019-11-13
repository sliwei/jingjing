const rp = require('request-promise');
const fs = require('fs');

/**
 * Created by awei on 2017/3/17.
 */

var router = require('koa-router')();
const db = require('../connect');

/**
 * 单张图片上传
 */
router.post('/upload', async (ctx, next) => {
	console.log(JSON.stringify(ctx.request.files));
	const file = ctx.request.files.file;
	let options = {
		url: 'http://0.0.0.0:3005/core/oss/upload',
		method: 'POST',
		formData: {
			file: [
				{
					value: fs.createReadStream(file.path),
					options: {
						filename: file.name,
						contentType: file.mimeType
					}
				},
				{
					value: fs.createReadStream(file.path),
					options: {
						filename: file.name,
						contentType: file.mimeType
					}
				},
			]
		}
	};
	let dat = await rp(options);
	let res = JSON.parse(dat);
	delete res.data.res;
	ctx.body = res;
});

/**
 * lw 新增一项
 */
router.post('/save', async (ctx, next) => {
	let dat = ctx.request.body;
	let result, message, code = 200;
	try {
		let sql = `insert into \`jing_book\`(title,note,url,headimg,createtime,user_id) values('${dat.title}', '${dat.note}', '${dat.url}', '${dat.headimg}', '${dat.createtime}',1)`;
		result = await db.op(sql);
		'insertId' in result ? null : code = 0;
	} catch (e) {
		message = e.name + ':' + e.message;
		code = 200;
	}
	ctx.body = {
		data: {},
		message: message,
		code: code,
	};
});

module.exports = router;
