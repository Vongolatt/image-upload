const Koa = require('koa')
const fs = require('fs')
const app = new Koa()
const koaBody = require('koa-body') //解析上传文件的插件
const { MAX_SIZE, FILE_TYPE } = require('./config')
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: MAX_SIZE * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}))
// 响应处理
app.use(async ctx => {
  let { files, method } = ctx.request; // 获取上传文件
  if (method !== 'POST') return ctx.throw(404, 'Not found')
  // 验证图片类型
  if (!FILE_TYPE.split(',').includes(files['image'].type)) return ctx.throw(400, '图片类型错误')
  // 创建可读流
  const reader = fs.createReadStream(files['image']['path']);
  let filePath = `/Users/vongola/Documents/vongola/${files['image']['name']}`;
  let remotefilePath = `http://www.xxxx.com:8887/img/my_blog_img` + `/${files['image']['name']}`;
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  return ctx.body = {
    url: remotefilePath,
    message: "文件上传成功",
    cc: 0
  }
})
app.listen(3000)
