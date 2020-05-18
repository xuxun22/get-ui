import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Login from './page/user/login.jsx'
import Home from './page/home'
import Pages from './page/layout.jsx'
import { Layout } from 'antd';

import 'antd/dist/antd.css'
import '@/asset/css/reset.css'
import '@/asset/font/iconfont.css'

export default class App extends Component {
  render() {
    return (
      <Layout>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/" component={Pages} />
          </Switch>
        </Router>
      </Layout>
    )
  }
}