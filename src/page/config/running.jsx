import React, { Component } from 'react';
import { Card, Table, Form, Badge, Input, Button, Progress, Modal } from 'antd';
const {confirm} = Modal

const statusSet = [null, <Badge color="geekblue" text="已提交" />, <Badge status="processing" text="运行中" />, <Badge status="success" text="成功" />, <Badge status="error" text="失败" />, <Badge color="oringe" text="中断" />]

class Search extends Component {
    state = {
        name: ''
    }
    keyChange = e => {
        this.setState({
            name: e.target.value
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.onSearch({
            projectName: this.state.name
        })
    }
    render() {
        return (
            <Form layout="inline" className="pt10 pb10">
                <Form.Item label="模型名称">
                    <Input style={{ width: '300px' }} onChange={this.keyChange} value={this.state.name} placeholder="名称模糊搜索" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={this.handleSubmit}>搜索</Button>
                </Form.Item>
            </Form>
        )
    }
}
const SearchForm = Form.create({ name: 'tenantOrder' })(Search)

class RunningList extends Component {
    state = {
        tableLoading: false,
        searchParams: {},
        sorter: {},
        pagination: {
            current: 1,
            pageSize: 20,
            showTotal: total => `共${total}条 `,
            total: 0
        },
        data: []
    }

    reLoad = () => {
        let pager = { ...this.state.pagination }
        pager.current = 1
        this.setState({
            pagination: pager
        }, () => {
            this.fetch();
        })
    }

    onSearch = pms => {
        this.setState({
            searchParams: pms
        })
        this.reLoad()
    }

    fetch() {
        const { pagination, searchParams, sorter } = this.state
        this.setState({
            tableLoading: true
        })
        Util.ajax.post('/predict/offline/task/list', {
            ...searchParams,
            ...sorter,
            pageNum: pagination.current,
            pageSize: pagination.pageSize
        }).then(res => {
            pagination.total = res.data.total
            this.setState({
                data: res.data.list,
                pagination,
                tableLoading: false
            })
        })
    }

    componentDidMount() {
        this.fetch()
    }

    handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, sorter);
        
        const pager = { ...this.state.pagination }
        pager.current = pagination.current
        this.setState({
            pagination: pager,
            sorter: {
                orderBy: sorter.field,
                sort:sorter.order === 'ascend' ? 'asc' : 'desc'
            }
        }, () => {
            this.fetch();
        })
    }

    interrupt = row => {
        confirm({
            title: '警告',
            content: '确认中断任务？',
            okText: '确认',
            okType : 'danger',
            cancelText: '取消',
            onOk: () => {
                Util.ajax.get('/predict/offline/task/interrupt', {
                    id: row.id
                }).then(res => {
                    this.fetch()
                })
            }
        })
    }

    resubmit = row => {
        confirm({
            title: '提示',
            content: '确认重新提交任务？',
            okText: '确认',
            cancelText: '取消',
            onOk: () => {
                Util.ajax.get('/predict/offline/task/submit', {
                    id: row.id
                }).then(res => {
                    this.fetch()
                })
            }
        })
    }

    render() {
        const columns = [
            {
                title: '任务ID',
                dataIndex: 'id',
                sorter:true,
                defaultSortOrder: 'descend'
            },
            {
                title: '模型名称',
                dataIndex: 'projectName',
                sorter:true
            },
            {
                title: '任务状态',
                dataIndex: 'status',
                render: status => status ? statusSet[status] : '',
                sorter:true
            },
            {
                title: '计算进度',
                dataIndex: 'progress',
                render: (progress, row) => {
                    return (
                        <div>
                            {row.status === 2 && <Progress strokeWidth={16} status="active" percent={progress * 100}></Progress>}
                            {row.status === 3 && <Progress strokeWidth={16} percent={progress * 100}></Progress>}
                            {(row.status === 4 || row.status === 5) && <Progress strokeWidth={16} status="exception" percent={100}></Progress>}
                        </div>
                    )
                }
            },
            {
                title: '计算时长',
                dataIndex: 'timeCost'
            },
            {
                title: '提交时间',
                dataIndex: 'createTime',
                render: time => Util.dateFormat(time),
                sorter:true
            },
            {
                title: '操作',
                dataIndex: 'status',
                key: 'active',
                align: 'center',
                render: (status, row) => {
                    return status === 2 ? <Button type="danger" onClick={() => this.interrupt(row)}>中断</Button> : (status === 4 || status === 5) ? <Button type="link" onClick={() => this.resubmit(row)}>重新提交</Button> : ''

                }
            }
        ]

        return (
            <div className="page-content">
                <Card title="离线预测_任务运行管理" bordered={false} style={{ width: '100%' }}>
                    <SearchForm onSearch={pms => this.onSearch(pms)}></SearchForm>
                    <Table
                        rowKey={record => record.id}
                        columns={columns}
                        loading={this.state.tableLoading}
                        dataSource={this.state.data}
                        pagination={this.state.pagination}
                        onChange={this.handleTableChange}
                    />
                </Card>
            </div>
        );
    }
}

export default RunningList;