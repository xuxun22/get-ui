import React, { Component } from 'react';
import styled from 'styled-components'
import { Button,Select, Alert, Card, Divider, Input, Form } from 'antd'

const {Option} = Select
const formItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 20
    }
  };

class DWForm extends Component {

    state = {
        host:'',
        port: '',
        // database: '',
        username: '',
        password: ''
    }

    componentDidMount() {
        Util.ajax.get('/config/getConfig', {
            type: 'hive'
        }).then(res => {
            const {data} = res
            if(!data){
                return false
            }
            const host = data.find(e => e.name === 'host')
            const port = data.find(e => e.name === 'port')
            // const database = data.find(e => e.name === 'database')
            const username = data.find(e => e.name === 'username')
            const password = data.find(e => e.name === 'password')
            this.setState({
                host: host ? host.value : '',
                port: port ? port.value : '',
                // database: database ? database.value : '',
                username: username ? username.value : '',
                password: password ? password.value : '',
            })
        })
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values);
            let pms = { ...values }
            let configs = [
                {
                    name: 'host',
                    value: pms.host
                },
                {
                    name: 'port',
                    value: pms.port
                },
                {
                    name: 'username',
                    value: pms.username
                },
                {
                    name: 'password',
                    value: pms.password
                }
            ]
            Util.ajax.post('/config/submitConfig', {
                type: pms.type,
                configs
            }).then(res => {
                Util.message.success('保存成功')
            })
          }
        });
    }

    handleTest = e => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
              Util.ajax.get('/config/testHiveDataSource', {
                    host: values.host,
                    port: values.port,
                    // database: values.database,
                }).then(res => {
                    Util.message.success('测试连接成功，请保存')
                })
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form layout="horizontal" {...formItemLayout} style={{width: '660px'}} onSubmit={this.handleOk}>
                <Form.Item label="数据库类型">
                {getFieldDecorator('type', {
                    initialValue:'hive'
                })(<Select disabled>
                        <Option value="hive">HIVE</Option>
                    </Select>)}
                </Form.Item>
                <Form.Item label="数据库地址">
                {getFieldDecorator('host', {
                    initialValue:this.state.host,
                    rules: [
                        { required: true, message: '请填写数据库地址', whitespace: true },
                    ]
                })(<Input />)}
                </Form.Item>
                <Form.Item label="端口">
                {getFieldDecorator('port', {
                    initialValue:this.state.port,
                    rules: [
                        { required: true, message: '请填写端口', whitespace: true },
                    ]
                })(<Input />)}
                </Form.Item>
                {/* <Form.Item label="数据库名称">
                {getFieldDecorator('database', {
                    initialValue:this.state.database,
                    rules: [
                        { required: true, message: '请填写名称', whitespace: true },
                    ]
                })(<Input />)}
                </Form.Item> */}
                <Form.Item label="用户名">
                {getFieldDecorator('username', {
                    initialValue:this.state.username,
                    rules: [
                        // { required: true, message: '请填写用户名', whitespace: true },
                    ]
                })(<Input />)}
                </Form.Item>
                <Form.Item label="密码">
                {getFieldDecorator('password', {
                    initialValue:this.state.password,
                    rules: [
                        // { required: true, message: '请填写密码', whitespace: true },
                    ]
                })(<Input type="password" />)}
                </Form.Item>
                <Form.Item label="" wrapperCol={{push: 4}}>
                    <Button className="mr20"  onClick={this.handleTest}>测试连接</Button>
                    <Button type="primary"  onClick={this.handleSubmit}>保存</Button>
                </Form.Item>
            </Form>
        )
    }
}

const ConfigForm =  Form.create({ name: 'dw-config-form' })(DWForm)

export default class DWConfig extends Component {

    render() {
        return (
            <Root>
                <div className="page-content">
                    <Card title={
                        <div style={{fontSize:'22px', fontWeight:'bold'}}>数据源配置</div>
                    } bordered={false} style={{ width: '100%' }}>
                        {/* <div className="title"></div>
                        <Divider></Divider> */}
                        <div className="sub-title">训练</div>
                        <div>数据来源于csv文件、txt文件，无需配置</div>
                        <Divider></Divider>
                        <div className="sub-title">本地预测</div>
                        <div>数据来源于csv文件、txt文件，无需配置</div>
                        <Divider></Divider>
                        <div className="sub-title">离线预测</div>
                        <Alert type="warning" message="当前支持hive文件(关系型数据库拓展中)，数据库连接配置："></Alert>
                        <br/>
                        <ConfigForm></ConfigForm>
                    </Card>
                </div>
            </Root>
            
        )
    }
}

const Root = styled.div`
    .title{
        font-size: 22px;
        font-weight: bold;
    }
    .sub-title{
        font-size:18px;
        font-weight: bold;
        padding: 5px 0 15px;
    }
`