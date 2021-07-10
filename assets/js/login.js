$(function () {
    // 登录页面与注册页面切换
    $('#toReg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    $('#toLogin').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 自定义验证规则   引入了layui就产生了layui对象  就像引入jQuery产生$
    // 获取表单元素，使用form.verify()方法自定义验证规则
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        // 验证密码
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 验证两次密码是否一样
        repwd: function (value) {
            if ($('#password-verify').val() !== value) {
                return '两次密码不一样';
            }

        }
    })

    // 监听注册事件
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        $.post('/api/reguser', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // 注册成功跳转到登录页面
            layer.msg(res.message);
            $('#toLogin').click();
        })
    });
    // 监听登录事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.post('/api/login', $(this).serialize(), function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
            }
            // 登录成功跳转到首页
            layer.msg('登录成功');
            // 将登录成功的 token 存入本地存储中
            localStorage.setItem('token', res.token);
            location.href = '/index.html';
        })
    });

})