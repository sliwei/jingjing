import fs from 'fs'
import { JingBook } from '../models'
import moment from 'moment'
import fetch from 'node-fetch'
import FormData from 'form-data'
import conf from '../config'

/**
 * @swagger
 * /api/upload:
 *   post:
 *     tags:
 *       - server
 *     summary: 图片
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: 文件
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
const upload = async (ctx, next) => {
  const file = ctx.request.files.file
  let formData = new FormData()
  formData.append('file', fs.createReadStream(file.path), {
    filename: file.name //上传的文件名
    // contentType: 'image/png',//文件类型标识
  })
  const response = await fetch(`${conf.api_url.API_CORE}/core/oss/upload`, {
    body: formData,
    method: 'POST', //请求方式
    headers: formData.getHeaders()
  })
  const res = await response.json()
  ctx.DATA.data = res.data
  ctx.body = ctx.DATA
}

/**
 * @swagger
 * /api/save:
 *   post:
 *     tags:
 *       - server
 *     summary: 新增一项
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: 标题
 *               note:
 *                 type: string
 *                 description: 备注
 *               url:
 *                 type: string
 *                 description: 地址
 *               headimg:
 *                 type: string
 *                 description: 头图
 *               createtime:
 *                 type: string
 *                 description: 创建时间
 *               user_id:
 *                 type: number
 *                 description: 用户ID
 *               menu_id:
 *                 type: number
 *                 description: 菜单ID
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
const save = async (ctx, next) => {
  const dat = ctx.request.body
  const result = await JingBook.create({
    title: dat.title,
    note: dat.note,
    url: dat.url,
    headimg: dat.headimg,
    createtime: dat.createtime || moment().format(),
    user_id: 1,
    menu_id: dat.menu_id
  })
  ctx.body = {
    ...ctx.DATA,
    data: { insertId: result.id }
  }
}

/**
 * @swagger
 * /api/del:
 *   post:
 *     tags:
 *       - server
 *     summary: 删除一项
 *     description: 说明
 *     requestBody:
 *       description: Pet object that needs to be added to the store
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sta:
 *                 type: number
 *                 description: 状态
 *               id:
 *                 type: number
 *                 description: 文章ID
 *     responses:
 *       '200':
 *         description: 成功说明
 *       '400':
 *         description: 失败说明
 */
const del = async (ctx, next) => {
  let dat = ctx.request.body
  await JingBook.update({ is_del: dat.sta }, { where: { id: dat.id } })
  ctx.body = {
    ...ctx.DATA
  }
}

export { upload, save, del }
