import React, { Component } from 'react';
// import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { Layout, Menu, Button, Icon, Dropdown } from 'antd';
import "./home.scss"

const { Header, Content } = Layout;
// const background = require('../../asset/images/background.png')
const logoName = require('../../asset/images/logo_name.png')
const logoBig = require('../../asset/images/logo.png')
const imageTulin = require('../../asset/images/tulin.png')

export default class HomeIndex extends Component {

  state = {
    getTipHover: false,
    tulinTipHover:false
  }

  changeGetStatus = show => {
    console.log(show);
    
    this.setState({
      getTipHover: show
    })
  }

  changeTulinStatus = show => {
    this.setState({
      tulinTipHover: show
    })
  }

  logout = () => {
    Util.ajax.post('/common/loginOut').then(res => {
      window.location.href = '/login'
    })
  }

  render() {
    return <div className="home-page">
      <Header className="header">
        <div className="logo" ><img src={logoName} alt="" /></div>
        <Menu theme="light" mode="horizontal" selectedKeys={['home']}>
          <Menu.Item key="home">
            {/* <a href="/">首页</a> */}
            <Link to="/">首页</Link>
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
            <span className="ant-dropdown-link">系統配置</span>
          </Dropdown>
          <Button type="link" className="mr20" size="small" onClick={() => window.open('GET_information_v2.pdf')}>产品说明</Button>
          {localStorage.authUserName && <span>
            <div className="name-button">{localStorage.authUserName}</div>
            <i className="iconfont logout ml15" onClick={this.logout}>&#xe605;</i>
          </span>
          }
          {!localStorage.authUserName && <Button type="danger" size="small" ghost onClick={() => this.props.history.push('/login')}>登录</Button>
          }
        </div>
      </Header>
      <Content>
        <div className="split-text">
          <div className="left">迁 越 创 新 </div>
          <div className="split-line"></div>
          <div className="right">致 敬 经 典</div>
        </div>
        <div className="get">
          <div className="content">
            <div className={'target-get' + (this.state.tulinTipHover ? ' hide' : '')}>
              <div className='logo-big' onMouseEnter={() => this.changeGetStatus(true)} onMouseLeave={() => this.changeGetStatus(false)}>
                <img src={logoBig} alt="get-logo"/>
              </div>
              <div className="title">G.E.T智能建模机器</div>
            </div>
            <div className="tip">
              <p>领先于传统机器学习及评分卡的预测能力，快速完成表现优良的模型</p>
              <p>机器自动生成行业最优的预测解析模型及分析指标</p>
              <p>无需资深金融建模人才，一样获得高水准建模能力</p>
            </div>
          </div>
          
        </div>
        <div className="tulin">
          <div className="content">
            <div className={'target-tulin' + (this.state.getTipHover ? ' hide' : '')}>
              <div className="tulin-comp" onMouseEnter={() => this.changeTulinStatus(true)} onMouseLeave={() => this.changeTulinStatus(false)}>
                <img src={imageTulin} alt="图灵计算机"/>
              </div>
              <div className="title">图灵机</div>
            </div>
            <div className="tip">机器替代人类进行数学运算</div>
          </div>
        </div>
        <div className={'hover-popup get-popup' + (this.state.getTipHover ? ' active' : '')}>
          <div className="tip-box-outer">
            <div className="tip-box-inner">
              <div className="title">极易数科的观点</div>
              <div className="time">· 2019 年 08 月 05 日 ·</div>
              <div className="line"></div>
              <div className="content">
                传统机器学习需要建模人员用丰富的经验来选择模型、筛选特征以及调节参数等，耗费大量时间避免过拟合与欠拟合。然而快速响应、探索、挖掘，才是这个时代最基本的的企业⽣存法则，极易数科倡导“极易”的数据建模方式，使用优良数模平台支撑业务精兵作战。
                <br/><br/>
                G.E.T智能建模机器背后的特殊“机智”，是用没有拟合理念的学习方法，实现持续理性逼近最优的学习效果。能够识别过挤和有空间提升的数据信息内容，在无人力介入的条件下，不间断按照业务需求自动调节执行速度地处理数据。并且，只要有结构相对完整的数据（数据量无需大），即可实现高质量数据和高质量建模组合的效果。
                <br/><br/>
                在一次建模合作中，面向17个事件场景数据（数据有缺失，且时间轴波动很大），使用常规方式仅得到KS=0.35~0.40的预测效果，但G.E.T智能建模机器使用简易特征组合即可达成KS=0.53~0.55的优良预测效果。
              </div>
            </div>
            <div className="circle left-top"></div>
            <div className="circle right-top"></div>
            <div className="circle left-bottom"></div>
            <div className="circle right-bottom"></div>
          </div>
        </div>
        <div className={'hover-popup tulin-popup' + (this.state.tulinTipHover ? ' active' : '')}>
          <div className="tip-box-outer">
            <div className="tip-box-inner">
              <div className="title">图灵发表论文《可计算数字及其在判断性问题中的应用》</div>
              <div className="time">· 1936 年 05 月 28 日 ·</div>
              <div className="line"></div>
              <div className="content">
              数学上“可计算性” 问题是指，是不是只要给数学家足够长的时间，就能够通过“有限次”的简单而机械的演算步骤而得到最终答案？图灵回答了这个既是数学又是哲学的艰深问题，1936年图灵发表论文《可计算数字及其在判断性问题中的应用》，独辟蹊径构造出一台完全属于想象中的“计算机”，数学家们把它称为“图灵机”。
              <br/><br/>
              “图灵机”想象使用一条无限长度的纸带子，带子上的“0”和“1”代表着在解决某个特定数学问题中的运算步骤，“图灵机”能够识别运算过程中每一步，按部就班地执行一系列的运算，直到获得答案。
                <br/><br/>
                几年之后，美国的阿坦纳索夫研究制造了世界上的第一台电子计算机ABC，采用了二进位制，电路的开与合分别代表数字“0”和“1”。二十世纪40年代，冯·诺依曼研制成功更好的电子计算机，为计算机设计了编码程序，还实现了运用纸带存储与输入。到此，天才图灵在1936年发表的科学预见和构思得以完全实现。
                <br/><br/>
                “图灵机”第一次在纯数学的符号逻辑和实体世界之间建立了联系，后来我们所熟知的电脑，以及“人工智能”，都基于这个设想。
              </div>
            </div>
            <div className="circle left-top"></div>
            <div className="circle right-top"></div>
            <div className="circle left-bottom"></div>
            <div className="circle right-bottom"></div>
          </div>
        </div>
        <div className="footer">极易数科 Copyright ©2020 G.E.T All Rights Reserved.  浙ICP备20009053</div>
      </Content>
    </div>
  }
}