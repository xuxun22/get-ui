import React, { Component } from 'react';
import { Drawer, Form, Button, Row, Input, Radio, Upload } from 'antd';

const { Dragger } = Upload;

class EditForm extends Component {

  state = {
    info: {},
    fileList: [],
    uploadedFilePath:'',
    deploying:false
  }

  formItemLayout = {
    labelCol: {
      sm: { span: 3 }
    },
    wrapperCol: {
      sm: { span: 21 }
    }
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.form.resetFields()
      this.setState({
        fileList: [], 
        uploadedFilePath: ''
      })
    }
    if (prevProps.id !== this.props.id && this.props.predictStatus!==0) {
      Util.ajax.get(`/predict/getOfflinePredict/${ this.props.id}`).then(res => {
        this.setState({
          info: res.data,
          fileList: [{
            uid: res.data.id,
            status: 'done',
            name: res.data.predictSqlPath
          }], 
          uploadedFilePath: res.data.predictSqlPath
        })
        this.props.form.setFieldsValue({
          predictOutPath: res.data.predictOutPath,
          frequentType: res.data.frequentType,
          upload: [{
            status: 'done',
            name: res.data.predictSqlPath,
            uid: res.data.id
          }]
        })
      })
    }
  }

  onClose = () => {
    this.props.onClose()
  }

  uploadConf = {
    name: 'file',
    multiple: false,
    accept: '.sql',
    showUploadList: {
      showDownloadIcon: false
    },
    action: '/get/upload',
    data: {
      pathType: 'predict_sql'
    },
    headers: {
      token: localStorage.authToken
    },
    beforeUpload: function (file) {
      console.log('fileType', file.type)
      const isSql = /^.*\.sql$/.test(file.name)
      if (!isSql) {
        Util.message.error('请上传.SQL文件');
      }
      return isSql;
    },
    onChange: info => {
      const { status } = info.file;
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      this.setState({ fileList });
      // console.log('status change：', status)
      if (status === 'done') {
        if(info.file.response.message) {
          Util.message.error(info.file.response.message);
          this.setState({ fileList: [], uploadedFilePath: '' });
        } else {
          this.setState({uploadedFilePath: info.file.response.data})
        }
      }
      if(status === 'error' || status === 'removed') {
        info.file.error && Util.message.error(info.file.error.message);
        this.setState({ fileList: [], uploadedFilePath: '' });
      }
    }
  }

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e.filter(f => f.status==='done' || f.status==='uploading');
    }
    return e && e.fileList.filter(f => f.status==='done' || f.status==='uploading');
  };


  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          deploying: true
        })
        console.log('Received values of form: ', values);
        let pms = { ...values }
        Reflect.deleteProperty(pms, 'upload')
        pms.trainId = this.props.id
        pms.fileName = this.state.uploadedFilePath
        let saveUrl = this.props.predictStatus === 3 ? '/predict/offlinePredictTask' : this.props.predictStatus === 4 ? '/predict/rePublishPredictTask' : '/predict/publishPredictTask'
        Util.ajax.post(saveUrl, pms).then(res => {
          Util.message.success('保存成功')
          this.setState({
            deploying: false
          })
          this.props.onReload()
          this.onClose()
        })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Drawer
          title={
            <div>离线预测部署
              <div className="sub-title">连接数据仓库执行批量预测，支持定时自动执行</div>
            </div>
          }
          width={700}
          maskClosable={true}
          onClose={this.onClose}
          visible={this.props.visible}
        >
          <Form {...this.formItemLayout}>
            <Row>
              <Form.Item label="输入数据" >
                {getFieldDecorator('upload', {
                  valuePropName: 'uploadedFileList',
                  getValueFromEvent: this.normFile,
                  rules: [{ required: true, message: '请上传文件', type: 'array' }]
                })(
                  <Dragger {...this.uploadConf} fileList={this.state.fileList} disabled={this.props.predictStatus === 3}>
                    <div className="bui-cols">
                      <div className="ant-upload-drag-icon"><i className="iconfont">&#xe614;</i> </div>
                      <div className="bui-col-1 tl">
                        <p className="ant-upload-text">点击或将文件拖拽到这里</p>
                        <p className="ant-upload-hint">上传数据仓库SQL查询脚本，支持.sql文件</p>
                      </div>
                    </div>
                  </Dragger>
                )}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="输出路径" required extra="路径为「库名称」.「表名称」，示例：auto_ml.zjl_risk_control_model">
                {getFieldDecorator('predictOutPath', {
                  rules: [
                    { required: true, message: '请填写输出路径', whitespace: true },
                    // {pattern: /^\w+\.\w+$/, message: '路径为「库名称」.「表名称」'}
                  ]
                })(<Input disabled={this.props.predictStatus === 3} placeholder="请输入" />)}
              </Form.Item>
            </Row>
            <Row>
              <Form.Item label="更新频率" extra="保存历史数据（即：保存每次预测结果）">
                {getFieldDecorator('frequentType', {
                  initialValue: 0
                })(
                  <Radio.Group disabled={this.props.predictStatus === 3}>
                    <Radio.Button value={0}>从不</Radio.Button>
                    <Radio.Button value={1}>每天</Radio.Button>
                    <Radio.Button value={2}>每3天</Radio.Button>
                    <Radio.Button value={3}>每7天</Radio.Button>
                    <Radio.Button value={4}>每30天</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
            </Row>
          </Form>
          <div className="drawer-footer">
            <Button onClick={this.onClose} style={{ marginRight: 8 }}> 取消 </Button>
            {
              this.props.predictStatus === 0 && <Button loading={this.state.deploying} onClick={this.handleSubmit} type="primary"> 确认部署 </Button>
            }
            {
              this.props.predictStatus === 3 && <Button loading={this.state.deploying} onClick={this.handleSubmit} type="danger"> 确认下线 </Button>
            }
            {
              this.props.predictStatus > 3 && <Button loading={this.state.deploying} onClick={this.handleSubmit} type="primary"> 确认部署 </Button>
            }
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create({ name: 'publish-edit-form' })(EditForm);
