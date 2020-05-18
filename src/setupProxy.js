const proxy = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(proxy('/get', {
        target: 'http://10.108.18.19:9093',
        changeOrigin: true
    }));
    // app.use(proxy('/auth', {
    //     target: 'http://127.0.0.1:4002/',
    //     pathRewrite: {
    //         "^/auth": "/"
    //     }
    // }));
};