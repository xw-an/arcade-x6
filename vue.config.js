module.exports = {
    publicPath: './',
    devServer: {
        proxy: {  //配置代理代理
            '/': {    // '^/api'别名（你的接口是以什么开头的就更换成什么，例如：^/orrce）
                target: 'http://localhost:8001',
                ws: true, // 是否允许跨域
                changeOrigin: true,
                // pathRewrite: {'^/': ''}
            }
        },
        hot: true, //保存实时刷新
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        'primary-color': '#f60',//修改全局主色，其它属性看官网
                    },
                    javascriptEnabled: true,
                },
            },
        },
        extract: true,
    },
};
