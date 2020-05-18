import React, { Component } from 'react';
import { Button, Upload, Icon, Popover, Input, Form } from 'antd'
import { withRouter } from 'react-router';

const { Dragger } = Upload;
// const databaseName = 'auto_ml'
const trainType = 'final_train'

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 19 }
  }
};

class IndexForm extends Component {
  state = {
    fileList: [],
    fileUrl: '',
    training: false
  }

  uploadConf = {
    name: 'file',
    multiple: false,
    accept: '.csv, .txt',
    showUploadList: {
      showDownloadIcon: false
    },
    action: '/get/upload',
    data: {
      pathType: 'train_file'
    },
    headers: {
      token: localStorage.authToken
    },
    beforeUpload: function (file) {
      const isScvOrTxt = /^.*(\.csv|\.txt)$/.test(file.name.toLocaleLowerCase());
      if (!isScvOrTxt) {
        Util.message.error('请上传.CSV或.TXT文件');
      }
      return isScvOrTxt;
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
          this.setState({ fileList: [], trainFilePath: '' });
        } else {
          this.setState({trainFilePath: info.file.response.data})
        }
      }
      if(status === 'error' || status === 'removed') {
        info.file.error && Util.message.error(info.file.error.message);
        this.setState({ fileList: [], trainFilePath: '' });
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



  handleOk = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          training: true
        })
        const { projectName } = values
        Util.ajax.post('/train/submitTrainTask', {
          trainType,
          // trainFilePath: 'test/path/aa.txt',
          trainFilePath: this.state.trainFilePath,
          projectName
        }).then(() => {
          Util.message.success('提交成功')
          this.setState({
            training: false
          })
        })
      }
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <Form {...formItemLayout} onSubmit={this.handleOk}>
        <Form.Item label="模型名称">
          {getFieldDecorator('projectName', {
            rules: [{ required: true, message: '请填写模型名称', whitespace: true }]
          })(<Input placeholder="填写模型名称" />)}
        </Form.Item>
        <Form.Item label="训练集上传" required>
          {getFieldDecorator('upload', {
            valuePropName: 'uploadedFileList',
            getValueFromEvent: this.normFile,
            rules: [{ required: true, message: '请上传文件', type: 'array' }]
          })(
            <Dragger {...this.uploadConf} fileList={this.state.fileList}>
              <div className="bui-cols">
                <div className="ant-upload-drag-icon"><i className="iconfont">&#xe664;</i> </div>
                <div className="bui-col-1 tl">
                  <p className="ant-upload-text">点击或将文件拖拽到这里</p>
                  <p className="ant-upload-hint">支持.CSV或.TXT文件，需要带英文表头 </p>
                </div>
              </div>
            </Dragger>
          )}
          训练集70%用于训练，30%用于测试
          <div className="input-tip">
            <Popover className="" overlayClassName="popover-tooltip" placement="bottom" content="训练集格式规范请见产品说明" title="" trigger="hover">
              <Icon type="info-circle" />
            </Popover>
          </div>
        </Form.Item>
        {/* <Form.Item label="训练集拆分">
          <div style={{ lineHeight: 1 }}>
            <span className="fl">训练 70%</span>
            <span className="fr">测试 30%</span>
          </div>
          <Progress percent={100} successPercent={70} format={percent => `${percent} Days`} showInfo={false} />
          <div className="input-tip" style={{ top: 0 }}>
            <Popover className="" overlayClassName="popover-tooltip" placement="bottom" content="比例暂不支持修改" title="" trigger="hover">
              <Icon type="info-circle" />
            </Popover>
          </div>
        </Form.Item> */}

        <div className="ac-container">
          <Button size="large" loading={this.state.training} type="primary" htmlType="submit"> GET一下 </Button>
          {/* <Button type="link" onClick={() => this.props.history.push('/list')}> 查看训练记录 </Button> */}
        </div>
      </Form>
    )
  }
}

export default Form.create({ name: 'index-form' })(withRouter(IndexForm));
