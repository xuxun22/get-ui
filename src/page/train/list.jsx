import React, { Component } from 'react';
import { Card, Table, Modal, Badge, Divider, Button } from 'antd';
import md5 from 'blueimp-md5'
import ForecastOffline from './forecastOffline.jsx'
import ForecastLocal from './forecastLocal.jsx'

const downloadLogAuths = [md5('guoguang'), md5('tangjinliang'), md5('admin')]

const preview = id => {
  const modal = Modal.info({
    content: '查询中，请稍后...',
    width: '50%'
  })
  Util.ajax.get(`/train/preview/${id}`).then(res => {
    console.log(res.data);
    modal.update({
      content: res.data.map(e => e + '\n')
    })
  })
}
const statusSet = [null, <Badge color="geekblue" text="已提交" />, <Badge status="processing" text="运行中" />, <Badge status="success" text="成功" />, <Badge status="error" text="失败" />]


class GetList extends Component {
  state = {
    tableLoading: false,
    forecastOfflineVisible: false,
    forecastLocalVisible: false,
    offlineForecastId: '',
    localForecastId: '',
    predictStatus: 0,
    pagination: {
      current: 1,
      pageSize: 20,
      showTotal: total => `共${total}条 `,
      total: 0
    },
    configDialogVisible: false,
    data: []
  }

  getRecordList() {
    const { pagination } = this.state
    this.setState({
      tableLoading: true
    })
    Util.ajax.post('/train/getTrainRecord', {
      database: 'auto_ml',
      type: 'final_train',
      pageNum: pagination.current,
      pageSize: pagination.pageSize
    }).then(res => {
      pagination.total = res.data.total
      this.setState({
        data: res.data.list,
        pagination,
        tableLoading:false
      })
    })
  }

  componentDidMount() {
    this.getRecordList()
  }

  handleTableChange = pagination => {
    console.log(pagination);

    const pager = { ...this.state.pagination }
    pager.current = pagination.current
    this.setState({
      pagination: pager
    }, () => {
      this.getRecordList();
    })
  };

  forecastOfflineShow = row => {
    this.setState({
      offlineForecastId: row.id,
      predictStatus: row.offlinePredictStatus,
      forecastOfflineVisible: true
    })
  }

  forecastOffline = row => {
    if(window.localStorage.getItem('dwconfiged')==='true') {
      this.forecastOfflineShow(row)
    } else {
      Util.ajax.get('/config/getConfig', {
          type: 'hive'
      }).then(res => {
        if(res.data && res.data.find(e => e.name === 'host').value){
          window.localStorage.setItem('dwconfiged', 'true')
          this.forecastOfflineShow(row)
        } else {
          this.setState({
            configDialogVisible:true
          })
        }
      })
    }
    
  }
  forecastLocal = row => {
    this.setState({
      localForecastId: row.id,
      forecastLocalVisible: true
    })
  }
  reLoad = () => {
    this.getRecordList()
  }
  editClose = () => {
    this.setState({
      forecastOfflineVisible: false,
      forecastLocalVisible: false
    })
  }

  render() {
    const columns = [
      {
        title: '项目ID',
        dataIndex: 'id'
      },
      {
        title: '项目名称',
        dataIndex: 'projectName'
      },
      {
        title: '创建人',
        dataIndex: 'userName',
        render: name => name ? decodeURIComponent(name) : ''
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        render: time => Util.dateFormat(time)
      },
      {
        title: '训练成果',
        dataIndex: 'status',
        render: (status, row) => {
          return (
            status === 3 ? <div>
              {row.coreData}
              <Button type="link" size="small" disabled={row.status !== 3} onClick={() => window.open(`/get/train/download/${row.id}`)}> 下载报告 </Button>
            </div> : statusSet[status]
          )
        }
      },
      {
        title: '预测管理',
        align: 'center',
        dataIndex: 'offlinePredictStatus',
        render: (status, record) => {
          return record.status === 3 ? <div>
            <Button type="link" size="small" onClick={() => this.forecastLocal(record)}> 本地预测 </Button>
            {
              status !== 1 && status !== 2 && <Divider type="vertical" />
            }
            {
              status===0 && <Button type="link" size="small" onClick={() => this.forecastOffline(record)} >离线预测</Button>
            }
            {
              status===3 && <Button type="link" size="small" className="line2" onClick={() => this.forecastOffline(record)} >离线预测部署成功<br /><span className="button-tip">(点击下线)</span></Button>
            }
            {
              status===4 && <Button type="link" size="small" className="line2" onClick={() => this.forecastOffline(record)} >离线预测部署失败<br /><span className="button-tip">(点击重试)</span></Button>
            }
            {
              status===5 && <Button type="link" size="small" className="line2" onClick={() => this.forecastOffline(record)} >离线预测已下线<br /><span className="button-tip">(点击部署)</span></Button>
            }
          </div> : '-'
          // const ar = path.split('.')
          // return <div>
          //   {ar[ar.length-1]==='csv' ? 
          //     <Button type="link" onClick={() => preview(record.id)}>预览</Button> : ''}
          //   <a target="_blank" href={`/get/train/download/${record.id}`}>下载</a>
          // </div>
        }
      }
    ]
    
    
    if (downloadLogAuths.includes(localStorage.authLoginName)) {
      columns.push({
        title: '训练日志',
        key: 'outputLogPath',
        render: (path, record) => {
          return <a target="_blank" href={`/get/train/download/log/${record.id}`}>下载</a>
        }
      })
    }

    return (
      <div className="page-content">
        <Card title="G.E.T训练记录" bordered={false} style={{ width: '100%' }}>
          <Table
            rowKey={record => record.id}
            columns={columns}
            loading={this.state.tableLoading}
            dataSource={this.state.data}
            pagination={this.state.pagination}
            onChange={this.handleTableChange}
          />
        </Card>
        <Modal
          title="无法离线预测"
          visible={this.state.configDialogVisible}
          okText="去配置"
          cancelText="取消"
          onOk={() => this.props.history.push('/dwConfig')}
          onCancel={() => this.setState({configDialogVisible:false})}
        >
          未配置数据源，不支持该操作
        </Modal>
        <ForecastOffline visible={this.state.forecastOfflineVisible} id={this.state.offlineForecastId} predictStatus={this.state.predictStatus} onClose={this.editClose} onReload={this.reLoad}></ForecastOffline>
        <ForecastLocal visible={this.state.forecastLocalVisible} id={this.state.localForecastId} onClose={this.editClose} onReload={this.reLoad}></ForecastLocal>
      </div>
    );
  }
}

export default GetList;