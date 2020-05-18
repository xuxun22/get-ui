import React, { Component } from 'react';
import { Drawer, Form, Button, Upload, Modal } from 'antd';

const { Dragger } = Upload;
const { confirm } = Modal

class EditForm extends Component {

  state = {
    fileList: [],
    excuting: false,
    uploadedFilePath: null,
    predicted: false
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.id && nextProps.id !== this.props.id) {
        this.setState({
          fileList: [],
          excuting: false,
          predicted: false,
          uploadedFilePath: null
        })
        this.props.form.resetFields()
    }
}

  formItemLayout = {
    labelCol: {
      sm: { span: 3 }
    },
    wrapperCol: {
      sm: { span: 19 }
    }
  };

  uploadConf = {
    name: 'file',
    multiple: false,
    accept: '.csv, .txt',
    showUploadList: {
      showDownloadIcon: false
    },
    action: '/get/upload',
    data: {
      pathType: 'predict_file'
    },
    headers: {
      token: localStorage.authToken
    },
    beforeUpload: function (file) {
      console.log(file.type)
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

  onClose = () => {
    if(this.state.excuting) {
      confirm({
        title: '确认退出？',
        content:' 退出窗口将导致本地预测任务中断',
        okType:'danger',
        okText:'退出',
        cancelText:'取消',
        onOk: () => {
          this.killTask()
          this.props.onClose()
        }
      })
    } else{
      this.props.onClose()
    }
   
  }

  checktrainStatus = id => {
    this.state.excuting && setTimeout(() => {
      Util.ajax.get(`/predict/getLocalPredict/${id}`).then(res => {
        if(res.data.predictStatus === 3) {
          Util.message.success('预测完成');
          this.setState({
            excuting: false,
            predicted: true
          });
          window.onbeforeunload = null
        } else if (res.data.predictStatus === 4) {
          Util.message.error('预测失败');
          this.setState({
            excuting: false
          });
          window.onbeforeunload = null
        } else {
          this.checktrainStatus(id)
        }
      })
    }, 2000);
  }

  killTask = () => {
    Util.ajax.get(`/predict/killLocalPredictTask`, {
      trainId: this.props.id
    }).then(res => {
      Util.message.success('预测已中断');
      window.onbeforeunload = null
        this.setState({
          excuting: false,
          predicted: false
        });
    })
  }


  handleSubmit = e => {
    e.preventDefault();
    this.setState({ excuting: true, predicted: false});
    window.onbeforeunload = function() {
      return "退出或刷新页面将导致本地预测任务中断，是否确认？";
    }
    Util.ajax.post('/predict/publishLocalPredictTask', {
      trainId: this.props.id,
      fileName: this.state.uploadedFilePath
    }).then(() => {
      this.checktrainStatus(this.props.id)
    }).catch(() => {
      this.setState({ excuting: false});
      window.onbeforeunload = null
    })
  }

  downloadPredict = () => {
    window.open(`/get/predict/download/localPredict/${this.props.id}`)
  }

  downloadPredictreport = () => {
    window.open(`/get/predict/download/localReport/${this.props.id}`)
  }

  render() {
    const Action = props => {
      if(this.state.excuting) {
        return <div>
          <Button size="large" icon="loading" type="danger" onClick={this.killTask}> 点击中断 </Button>
          <span style={{color: '#f33', paddingLeft: '20px'}}>执行中，请勿离开</span>
          </div>
      } else {
        return <div>
          <Button size="large" disabled={!this.state.uploadedFilePath} onClick={this.handleSubmit} type="primary"> 执行预测 </Button>
          {
            this.state.predicted && 
            <span>
              <Button size="large" onClick={this.downloadPredict} type="link"> 下载预测结果 </Button>
              <Button size="large" onClick={this.downloadPredictreport} type="link"> 下载分析报告 </Button>
            </span>
          }
        </div>
      }
    };
    return (
      <div>
        <Drawer
          title={
            <div>本地预测
              <div className="sub-title">本地上传.CSV或.TXT文件，对特定ID集合执行预测</div>
            </div>
          }
          width={700}
          maskClosable={true}
          onClose={this.onClose}
          visible={this.props.visible}
        >
          <Form {...this.formItemLayout}>
            <Form.Item label="上传数据" >
              <Dragger {...this.uploadConf} fileList={this.state.fileList}>
                <div className="bui-cols">
                  <div className="ant-upload-drag-icon"><i className="iconfont">&#xe664;</i></div>
                  <div className="bui-col-1 tl">
                    <p className="ant-upload-text">点击或将文件拖拽到这里</p>
                    <p className="ant-upload-hint">支持.CSV或.TXT文件，需要带英文表头 </p>
                  </div>
                </div>
              </Dragger>
            </Form.Item>
            <Form.Item style={{marginLeft: '12.5%'}}>
              <Action></Action>
              {/* <Button type="link">下载预测结果</Button> */}
            </Form.Item>
          </Form>
          <div className="drawer-footer">
            <Button onClick={this.onClose} style={{ marginRight: 8 }}> 关闭 </Button>
          </div>
        </Drawer>
      </div>
    );
  }
}

export default Form.create({ name: 'publish-edit-form' })(EditForm);
