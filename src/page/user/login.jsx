import React, { Component } from 'react'
// import { withRouter } from 'react-router-dom'
import { Form, Icon, Input, Button, Checkbox } from 'antd'
import styled from 'styled-components'
import md5 from 'blueimp-md5'
import axios from 'axios'
const FormItem = Form.Item

class Login extends Component {
  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        Reflect.deleteProperty(axios.defaults.headers, 'token')
        let pms = { ...values }
        pms.password = localStorage.loginPassword===values.password ?  localStorage.loginPassword : md5(values.password)
        Util.ajax.post('/common/login', pms)
          .then(res => {
            console.log(res)
            if (!res.data.hasLogin) {
              // 保存登录信息
              if(pms.sureLogin) {
                localStorage.setItem('loginUsername', pms.loginName)
                localStorage.setItem('loginPassword', pms.password)
              }
              // this.props.store.setUserInfo(res.data)
              localStorage.setItem('authToken', res.data.token)
              localStorage.setItem('authUserName', res.data.userName)
              localStorage.setItem('authUserId', res.data.userId)
              localStorage.setItem('authLoginName', md5(res.data.loginName))
            }
            // axios.defaults.headers.token = res.data.token
            window.location.href='/train'
          })
          .catch(err => { })
      }
    })
  }

  componentDidMount() {
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUserName')
    localStorage.removeItem('authUserId')
    localStorage.removeItem('authLoginName')
    localStorage.removeItem('dwconfiged')
    if(localStorage.loginUsername && localStorage.loginPassword) {
      this.props.form.setFieldsValue({
        loginName: localStorage.loginUsername,
        password:localStorage.loginPassword
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Root>
        <div className="login-page">
          <div className="login-box">
            <div className="title"><i className="iconfont">&#xe61c;</i>G.E.T Quick Model</div>
            <Form
              onSubmit={this.handleSubmit}
              className="login-form">
              <FormItem>
                {getFieldDecorator('loginName', {
                  rules: [ { required: true, message: '请输入用户名!' } ]
                })(
                  <Input
                    addonBefore={
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.45)' }} />
                    }
                    placeholder="用户名"
                  />
                )}
              </FormItem>
              <FormItem className="mb10">
                {getFieldDecorator('password', {
                  rules: [ { required: true, message: '请输入密码!' } ]
                })(
                  <Input
                    addonBefore={ <Icon type="lock" style={{ color: 'rgba(0,0,0,.45)' }} /> }
                    type="password"
                    placeholder="密码"
                  />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('sureLogin', {
                 valuePropName:'checked',
                 initialValue: true
                })(
                  <Checkbox>记住密码</Checkbox>
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" htmlType="submit" className="login-form-button"> 登 录 </Button>
              </FormItem>
            </Form>
            <div className="copyright">
              Copyright©2020 极易数科
            </div>
          </div>
        </div>
      </Root>
    )
  }
}
const LoginForm = Form.create({ name: 'login' })(Login)
export default LoginForm

const Root = styled.div`
    .login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(238,238,238, 1);
    }
    .login-box {
      padding: 15px 40px;
      border:solid 1px #ccc;
      border-radius:2px;
      box-shadow: 0 0 3px #ccc;
      background: #fff;
        width: 360px;
    }
    .title {
        margin: 0px auto 40px auto;
        padding-top: 25px;
        color: #666;
        text-align: center;
        line-height: 40px;
        font-size: 20px;
        .iconfont{
          margin-right: 10px;
          color:#40a9ff;
          font-size: 30px;
          position: relative;
          bottom: -4px;
        }
    }
    .login-form-button {
        width: 100%;
    }
    .copyright {
      text-align: center;
      font-size: 12px;
      color: #999;
      padding: 20px 0;
    }
`
