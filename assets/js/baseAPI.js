// 发送Ajax请求前会 先调用 ajaxPrefilter()函数 同时可以拿到传给Ajax的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url;
})