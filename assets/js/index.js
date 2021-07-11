$(function () {
    getUserInfo();

    // 实现退出功能
    $('#btnLogout').on('click', function () {
        // 弹出提示文本
        layui.layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            // 1.删除本地存储中的token
            localStorage.removeItem('token');
            // 2.跳转到登录页面
            location.href = '/login.html'

            // 关闭 confirm 询问框
            layer.close(index);
        });
    })
})

// 通过接口获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 请求头配置对象
        /* headers: {
            Authorization: localStorage.getItem('token') || ''
        }, */
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            // 获取成功调用函数渲染头像
            renderAvatar(res.data);
        },
        // 不管请求成功还是失败都会执行 complete 函数
        /* complete: function (res) {
            console.log(res);
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                // 强制跳回登录页面，清空token
                localStorage.removeItem('token');
                location.href = '/login.html';
            }
        } */
    })
}

// 渲染头像函数
function renderAvatar(user) {
    // 渲染用户名称
    var name = user.nickname || user.username;
    $('.welcome').html('欢迎&nbsp;&nbsp;' + name);
    if (user.user_pic) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user_pic).show();
        $('.text-avatar').hide();
    } else {
        // 渲染文字头像
        var first = name[0].toUpperCase();
        $('.layui-nav-img').hide();
        $('.text-avatar').html(first).show();
    }
}