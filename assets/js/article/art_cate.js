$(function () {
    var layer = layui.layer;
    var form = layui.form;

    initArtList();

    // 初始化表格数据
    function initArtList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return '请求数据失败！'
                }
                var html = template('tpl_table', res);
                $('tbody').html(html);
            }
        })
    }

    // 点击添加类别
    var indexAdd = null;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            content: $('#dialog-add').html(),
            area: ['500px', '260px']
        });
    })

    // 通过事件委托为动态生成的表单添加 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $('#form-add').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                layer.msg('新增分类成功！');
                layer.close(indexAdd);
                // 成功之后重新获取表单数据初始化
                initArtList();
            }
        })
    })

    // 通过事件委托为动态生成的表格添加 click 事件
    var indexEdit = null
    $('tbody').on('click', '#btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            content: $('#dialog-edit').html(),
            area: ['500px', '260px']
        });

        // 点击编辑按钮同时获取id，通过自定义属性
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 快速添加表单内容
                form.val('form-edit', res.data);
            }
        })
    })

    // 通过事件委托为动态生成的表单添加 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $('#form-edit').serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layer.msg('更新分类数据成功！')
                layer.close(indexEdit);
                // 成功之后重新获取表单数据初始化
                initArtList();
            }
        })
    })

    // 通过事件委托为动态生成的表单添加事件
    $('tbody').on('click', '#btn-delete', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除数据失败！');
                    }
                    layer.msg('删除数据成功！');
                    layer.close(index);
                    // 删除之后重新渲染表格
                    initArtList();
                }
            })
        });


    })
})