import React, { Component } from 'react'
import { Form, Icon, Input, Button } from 'antd'
import styled from 'styled-components'
import md5 from 'blueimp-md5'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 }
  }
};

class ResetPassword extends Component {

  confirmDirty = false

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let pms = { ...values }
        pms.password = md5(values.password)
        pms.confirmPassword = md5(values.confirmPassword)
        pms.currentPassword = md5(values.currentPassword)
        Util.ajax.put('/login/password', pms)
          .then(res => {
            Util.message.success('修改成功,请重新登录')
            setTimeout(() => {
              window.location.href = '/login'
            }, 2000);
            // this.props.history.push(Util.getQueryString('rederect') || `/${page}`)
          })
          .catch(err => { })
      }
    })
  }

  handleConfirmBlur = e => {
    const { value } = e.target;
    this.confirmDirty = this.confirmDirty || !!value
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次密码不一致');
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && this.confirmDirty) {
      form.validateFields(['confirmPassword'], { force: true });
    }
    callback();
  };

  componentWillMount() {
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Root>
        <div className="login-page">
          <div className="login-box">
            <Form
              {...formItemLayout}
              onSubmit={this.handleSubmit}
              className="login-form">
              <Form.Item label="登录账号">
                {getFieldDecorator('loginName', {
                  rules: [{ required: true, message: '请输入账号' }]
                })(
                  <Input placeholder="登录账号" prefix=
                    {
                      <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                  />)}
              </Form.Item>
              <Form.Item label="原始密码" hasFeedback>
                {getFieldDecorator('currentPassword', {
                  rules: [{ required: true, message: '请输入原始密码' }]
                })(
                  <Input.Password placeholder="原始密码" prefix=
                    {
                      <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                    }
                  />)}
              </Form.Item>
              <Form.Item label="新密码" hasFeedback>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      message: '请输入新密码'
                    },
                    {
                      validator: this.validateToNextPassword
                    }
                  ]
                })(<Input.Password placeholder="新密码" prefix=
                  {
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />)}
              </Form.Item>
              <Form.Item label="确认密码" hasFeedback>
                {getFieldDecorator('confirmPassword', {
                  rules: [
                    {
                      required: true,
                      message: '请输入确认密码'
                    },
                    {
                      validator: this.compareToFirstPassword
                    }
                  ]
                })(<Input.Password placeholder="确认密码" onBlur={this.handleConfirmBlur} prefix=
                  {
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                />)}
              </Form.Item>
              <Form.Item wrapperCol={{
                xs: { span: 24, offset: 0 },
                sm: { span: 18, offset: 6 }
              }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button">
                  提 交
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Root>
    )
  }
}
const ResetPasswordForm = Form.create({ name: 'reset' })(ResetPassword)
export default ResetPasswordForm

const Root = styled.div`
    background-color: #fff;
    .login-box {
        width: 500px;
        margin: 30px auto 0;
        transform: translateX(-50px);
    }
    .title {
        margin: 0px auto 40px auto;
        padding-top: 55px;
        color: #000;
        text-align: center;
        font-size: 23px;
    }
    .login-form-button {
        width: 100%;
    }
`
