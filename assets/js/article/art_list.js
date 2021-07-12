$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;


    // 根据接口文件设置参数
    var q = {
        pagenum: 1,   // 页码值，默认请求第一页的数据
        pagesize: 2,  // 每页显示的数据条数，默认每页显示两条
        cate_id: '',  // 文章分类的 Id
        state: ''     // 文章的发布状态
    }
    initTable();
    initCate();

    // 定义美化时间格式的过滤器 
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);

        var y = dt.getFullYear();
        var m = padZero(dt.getMonth());
        var d = padZero(dt.getDate());

        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());

        return `${y}-${m}-${d}  ${hh}:${mm}:${ss}`
    }
    // 定义一个补零的函数
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }

    // 获取文章列表数据
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // console.log(res);
                // 通过模板引擎渲染页面
                var html = template('tpl-table', res);
                $('tbody').html(html);
                // 分页功能为列表服务，渲染之后调用分页方法
                renderPage(res.total);
            }
        })
    }

    // 初始化文章分类下拉选择框
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败')
                }
                // 获取数据使用模板引擎渲染到页面
                var html = template('tpl-cate', res);
                $('[name=cate_id]').html(html);
                // 动态添加需要调用才会被 layui 喧嚷
                form.render();
            }
        })
    }

    // 为筛选部分监听 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取分类和状态的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 将获取的值更新到 q 中
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新的 q 渲染列表
        initTable();
    })

    // 定义一个渲染分页的函数
    function renderPage(total) {
        // 调用 laypage.render() 渲染分页结构
        laypage.render({
            elem: 'pageBox',    // 分页容器的id
            count: total,       // 总页数
            limit: q.pagesize,  // 每页显示几条数据
            curr: q.pagenum,    // 设置默认被选中的页码
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],  // 自定义分页排版
            limits: [2, 3, 5, 10],  // 定义layout中limit的值
            // 分页切换时会调用jump函数
            // 触发jump回调函数的两种方式：
            // 1.点击分页切换
            // 2. laypage.render的调用
            jump: function (obj, first) {
                // console.log(obj.curr); //得到当前页
                // console.log(obj.limit); //得到每页显示的条数


                // 将点击的当前页更新 q.pagenum 值
                q.pagenum = obj.curr;
                // 将修改的条目数更新 q.pagesize 值
                q.pagesize = obj.limit;
                // 更新参数后重新渲染列表页面
                // initTable();
                if (!first) {
                    // 根据first 的值判断是哪种方式触发jump函数
                    // true 表示是第二种方式
                    initTable();
                }
            }
        })
    }

})