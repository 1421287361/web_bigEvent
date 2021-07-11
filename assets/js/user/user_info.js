$(function () {
    var layer = layui.layer;
    // 定义验证规则
    var form = layui.form;
    form.verify({
        nickname: function (value) {
            if (value.trim().length > 6) {
                return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })

    initUserinfo();
    // 初始化用户信息
    function initUserinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                // console.log(res);
                // 使用 form.val() 快速为表单赋值
                form.val('formUserInfo', res.data);
            }
        })
    }

    // 实现重置功能
    $('#btnReset').on('click', function (e) {
        // 阻止默认的重置行为
        e.preventDefault();
        initUserinfo();
    })

    // 监听表单的提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        // 发送ajax请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')
                // 信息更新之后如何更新页面中的信息：
                // 1.将iframe页面看成是index页面的子页面
                // 2.子页面调用父页面中更新信息的方法
                // 这是在子页面中，所以window指的就是子页面
                window.parent.getUserInfo();
            }
        })
    })
})