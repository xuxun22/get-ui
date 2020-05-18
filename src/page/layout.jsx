import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import List from './train/list.jsx'
import Train from './train'
import DWConfig from './config/dwConfig.jsx'
import RunningList from './config/running.jsx'
import { Layout, Divider, Menu, Button, Icon, Dropdown } from 'antd';
import styled from 'styled-components'

const { Header, Content } = Layout;

class App extends Component {

  state = {
    current: ''
  }

  logout = () => {
    Util.ajax.post('/common/loginOut').then(res => {
      window.location.href = '/login'
    })
  }

  componentDidMount() {
    let path = this.props.history.location.pathname
    if (path === '/train') {
      this.setState({
        current: 'train'
      });
    } else if (path === '/predict') {
      this.setState({
        current: 'predict'
      });
    } else {
      this.setState({
        current: ''
      });
    }
    if (path !== '/login' && path !== '/') {
      Util.ajax.get('/common/user/' + localStorage.authUserId)
    }
  }

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    return (
      <Root>
        <Router>
          {
            this.props.history.location.pathname !== '/login' && <Header className="header">
              <div className="logo" >
                G.E.T Quick Model
                </div>
              <Menu onClick={this.handleClick} selectedKeys={[this.state.current]} mode="horizontal" theme="dark">
                <Menu.Item key="home">
                  <a href="/">首页</a>
                  {/* <Link to="/">首页</Link> */}
                </Menu.Item>
                <Menu.Item key="train">
                  <Link to="/train">训练</Link>
                </Menu.Item>
                <Menu.Item key="predict">
                  <Link to="/predict">预测</Link>
                </Menu.Item>
              </Menu>

              <div className="login-user_info">
                <Dropdown className="mr30" overlay={
                  <Menu onClick={this.handleClick}>
                    <Menu.Item key="dw">
                      <Link to="/dwConfig">数据资源配置</Link>
                    </Menu.Item>
                    <Menu.Item key="running">
                      <Link to="/running">离线任务管理</Link>
                    </Menu.Item>
                  </Menu>
                }>
                  <span className="ant-dropdown-link">
                    系統配置
                    </span>
                </Dropdown>
                {/* <Divider type="vertical" /> */}
                <Button type="link" className="mr20" size="small" ghost onClick={() => window.open('GET_information_v2.pdf')}>产品说明</Button>
                {/* <Divider type="vertical" /> */}
                <i className="iconfont">&#xe667;</i> {localStorage.authUserName}
                {/* <Divider type="vertical" /> */}
                <i className="iconfont logout ml10" onClick={this.logout}>&#xe605;</i>
              </div>
            </Header>
          }
          <Route path="/predict" component={List} />
          <Route path="/dwConfig" component={DWConfig} />
          <Route path="/running" component={RunningList} />
          <Route path="/train" component={Train} />
        </Router>
        <div className="page-footer">极易数科 Copyright ©2020 G.E.T All Rights Reserved.  浙ICP备20009053</div>
      </Root>
    )
  }
}

export default App

const Root = styled.div`
.header {
  padding: 0;
  height: 45px;
  line-height: 45px;
  background-color: #053488;
  display: flex;
  .ant-menu-dark {
    background-color: #053488;
    .ant-menu-item {
      top: -1px;
    }
  }
    .logo {
        float: left;
        color: #fff;
        font-size: 16px;
        margin-right: 30px;
        width: 200px;
        text-align: left;
        padding-left: 30px;
    }
    .login-user_info{
        flex: 1;
        color: #fff;
        padding-right: 30px;
        text-align: right;
        line-height: 40px;
    }
    .ant-dropdown-link {
      cursor: pointer;
    }
    .logout {
      font-size: 24px;
      position:relative;
      cursor: pointer;
      top: 4px;
      color: #ccc;
    }
}
`
