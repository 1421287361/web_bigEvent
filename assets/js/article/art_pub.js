$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initCate();
    // 初始化富文本编辑器
    initEditor()
    // 发送请求获取类别
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章类别失败！')
                }
                // 获取文章类别通过模板引擎渲染到页面
                var html = template('tpl-cate', res);
                $('select').html(html);
                // 一定要调用 form.render()
                form.render();
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //  为选择文件的表单添加change事件
    $('#coverFile').on('change', function (e) {
        var files = e.target.files;
        // 判断用户是否选择了文件
        if (files.length === 0) {
            return layer.msg('请选择文件')
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
        // 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var art_state = '已发布';
    $('#btnSave2').on('click', function () {
        art_state = '草稿';
    })

    // 为表单绑定submit事件
    $('#form-pub').on('submit', function (e) {
        // 1.阻止表单默认提交行为
        e.preventDefault();
        // 2.创建 formData 表单  括号内要转成DOM元素
        var fd = new FormData($(this)[0]);
        // 3.将状态参数添加表单
        fd.append('state', art_state)
        // 4.将裁剪后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {// 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将图片文件对象追加到 fd 中
                fd.append('cover_img', blob);
                // 6.发起ajax请求，实现添加文章
                publishArticle(fd);
            })
    })

    // 定义发送ajax请求函数
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是FormData格式的数据
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！');
                }
                layer.msg('发布文章成功！');
                // 发布成功跳转到文章列表页
                location.href = '/article/art_list.html';
            }
        })
    }
})