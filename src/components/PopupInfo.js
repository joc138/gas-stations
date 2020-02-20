import React, {  Component, useState, useEffect } from 'react'
import '../App.css'
import firebase from 'firebase'
import styled from 'styled-components'


export default class PopupInfo extends Component {
  render() {
    const id = this.props.station.id;
    let bColor = 'green';
    if(this.props.object[id].grade==1){
      bColor = 'yellow';
    }else if(this.props.object[id].grade>1){
      bColor = 'red'
    }
    const Header = styled.header
    `
      background-color: green;
      height: 1rem;
      width: 100%;
    `;
    return(
      <div>
        <Header grade={this.props.object[id].grade}/>
        <div className='gas-type'>
          unleaded
          <div className='price'>{this.props.object[id].price}</div>
        </div>
        <div className='gas-type'>
          regular
          <div className='price'>{this.props.object[id].price}</div>
        </div>
        <div className='gas-type'>
          Premium
          <div className='price'>{this.props.object[id].price}</div>
        </div>
        <div>
        <button className='edit'>Edit</button>
        <p className='updated'>last updated never</p>
        </div>
      </div>
    );
  }
}
