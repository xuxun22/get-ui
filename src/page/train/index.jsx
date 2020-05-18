import React, { Component } from 'react';
import styled from 'styled-components'
import IndexForm from './indexForm.jsx'

export default class TrainIndex extends Component {

  render() {
    return <Root>
      <div className="content">
        <IndexForm></IndexForm>
      </div>
    </Root>
  }
}

const Root = styled.div`
    height: calc(100vh - 86px);
  .content {
    position: absolute;
    top: 20%;
    left: 50%;
    width: 50%;
    transform: translate(-50%, 0);
    .title {
      font-size:24px;
      color: #333;
      padding-bottom: 30px;
      text-align: center;
    }
    .ant-input-number{
      width: 100%;
    }
    .input-tip {
      color: #666;
      width: 30px;
      text-align:center;
      font-size: 13px;
      position:absolute;
      right: -35px;
      top: -11px;
    }
    .ac-container {
      text-align: center;
      position: relative;
      padding-top: 20px;
      .ant-btn-link {
        position: absolute;
        left: 50%;
        top: 24px;
        margin-left: 65px;
      }
    }
    .get-button {
      border: none;
      outline: none;
      width: 120px;
      height: 40px;
      background: #096dd9;
      display: inline-block;
      color: #fff;
      font-size: 18px;
      text-align: center;
      &.disable {
        filter: grayscale(1);
        pointer-events: none;
      }
    }
    .ant-form-item-children{
      display:block;
    }
  }
    .login-page {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        width: 100%;
        top: 0;
        bottom: 0;
        left: 0;
        background-color: #c5dfe6;
    }
  `