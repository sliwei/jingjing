const fs = require('fs')

/**
 * Created by awei on 2017/3/17.
 */

const db = null

/**
 * 单张图片上传
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file
  ctx.DATA = await request({
    url: `${conf.api_url.API_CORE}/core/oss/upload`,
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
        }
      ]
    }
  })
  ctx.body = ctx.DATA
}

/**
 * lw 新增一项
 */
const save = async (ctx, next) => {
  let dat = ctx.request.body
  let result,
    message,
    code = 200
  try {
    let sql = `insert into \`jing_book\`(title,note,url,headimg,createtime,user_id,menu_id) values('${dat.title}', '${dat.note}', '${dat.url}', '${dat.headimg}', '${dat.createtime}',1,'${dat.menu_id}')`
    result = await db.op(sql)
    'insertId' in result ? null : (code = 0)
  } catch (e) {
    message = e.name + ':' + e.message
    code = 200
  }
  ctx.body = {
    data: {},
    message: message,
    code: code
  }
}

/**
 * lw 新增一项
 */
const del = async (ctx, next) => {
  let dat = ctx.request.body
  let result,
    message,
    code = 200
  try {
    let sql = `UPDATE jing_book SET is_del=${dat.sta} WHERE id=${dat.id}`
    result = await db.op(sql)
    console.log(result)
  } catch (e) {
    message = e.name + ':' + e.message
    code = 200
  }
  ctx.body = {
    data: {},
    message: message,
    code: code
  }
}

export default {
  upload,
  save,
  del
}
