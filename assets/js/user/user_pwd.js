$(function () {
    // 设置密码验证规则
    var form = layui.form;
    form.verify({
        // 密码位数规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 新旧密码不能一样
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样！'
            }
        },
        // 两次密码需要一致
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 监听提交密码修改表单
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        // 发送ajax请求修改密码
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改密码失败')
                }
                layui.layer.msg('修改密码成功')
                // 重置密码表单 DOM元素中的 reset() 方法
                $('.layui-form')[0].reset();
            }
        })
    })
})