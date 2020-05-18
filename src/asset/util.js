import axios from 'axios'
import { message as Message } from 'antd';

const message = Message
message.config({
    duration: 2,
    maxCount: 3,
  })
const isObject = v => {
    return Object.prototype.toString.call(v) === '[object Object]'
}

// axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? 'http://openauthtest.yibangcredit.com/op' : '/op'
axios.defaults.baseURL = '/get'
axios.defaults.headers.token = localStorage.authToken
axios.interceptors.response.use(response => {
    if (response.status !== 200) {
        return Promise.reject(response)
    }
    return response
}, (error) => {
    let status =  error.response ? error.response.status : 500
    switch (status) {
        case 400:
            message.error(error.response.data.message || '对不起，请求的参数错误，请确认后重试')
            break
        case 401:
            message.destroy()
            message.error('登录超时，请重新登录', function(){
                // window.history.pushState({status: 1} ,'' ,'/login?rederect=' + encodeURIComponent(window.location.pathname))
                window.location.href = '/login?rederect=' + encodeURIComponent(window.location.pathname)
            })
            break
        case 412:
                message.destroy()
            message.error('该账号在别处登录，请重新登录', function(){
                // window.history.pushState({status: 1} ,'' ,'/login?rederect=' + encodeURIComponent(window.location.pathname))
                window.location.href = '/login?rederect=' + encodeURIComponent(window.location.pathname)
            })
            break
        case 403:
            message.destroy()
            message.error('对不起，你没有权限进行此项操作')
            break
        case 404:
            message.error('对不起，你请求的服务不存在')
            break
        case 422:
            message.error('您提交的数据格式不正确，请重新检查')
            break
        case 500:
            message.error(error.response.data.message || '服务器内部错误')
            break
        default:
            message.destroy()
            message.error(error.response.data.message || ('服务器内部错误(' + status + ')'))
    }
    return Promise.reject(error)
})

const methods = ['post', 'get', 'delete', 'put', 'patch']
const ajax = {}
methods.forEach((method) => {
    ajax[method] = function(url, pms = {}, ops = {}) {
        ops = isObject(ops) ? ops : {}
        let request = (method === 'get'||method === 'delete') ? axios[method](url, { params: pms, ...ops }) : axios[method](url, pms, ops)
        return request.then(response => {
            let res = response.data
            let success = res.code === '0' || res.code === 'SUCCESS' || !res.message
            if (success) {
                return Promise.resolve(response.data)
            } else {
                message.error(res.message || '系统繁忙，请稍后再试')
                return Promise.reject(res)
            }
        }, error => {
            return Promise.reject(error)
        })
    }
})

const getQueryString = function (name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

const dateFormat = (dt, fmt = 'yyyy-MM-dd hh:mm:ss') => {
    let newDate = dt
    if (!dt) {
        return ''
    }
    // debugger
    if (typeof dt === 'string') {
        // dt = dt.replace(/-/g, '/') // IOS上只支持yyyy/MM/dd这种标准格式
        dt = /^\d+$/.test(dt) ? parseInt(dt) : /.\+./.test(dt) ? new Date(dt) : dt.replace(/-/g, '/') // 传入的日期可能是个纯数字组成的字符串，如"1511107200000"
    }
    if (dt instanceof Date === false) {
        dt = new Date(dt)
    }
    if (!dt.getTime()) {
        return newDate
    }

    let o = {
        'M+': dt.getMonth() + 1, // 月份
        'd+': dt.getDate(), // 日
        'h+': dt.getHours(), // 小时
        'm+': dt.getMinutes(), // 分
        's+': dt.getSeconds(), // 秒
        'q+': Math.floor((dt.getMonth() + 3) / 3), // 季度
        S: dt.getMilliseconds() // 毫秒
    }

    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (dt.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
    }

    for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1
                    ? o[k]
                    : ('00' + o[k]).substr(('' + o[k]).length)
            )
        }
    }

    return fmt
}

// export const ajax = ajax
export {
    isObject,
    ajax,
    getQueryString,
    message,
    dateFormat
}