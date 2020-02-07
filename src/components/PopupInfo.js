import React from 'react'
import '../App.css'
export default function PopupInfo(){
  return(
    <div>
      <header />
      <div className='gas-type'>
        unleaded
        <div className='price'>$3.50</div>
      </div>
      <div className='gas-type'>
        regular
        <div className='price'>$3.50</div>
      </div>
      <div className='gas-type'>
        Premium
        <div className='price'>$3.50</div>
      </div>
      <div>
      <button className='edit'>Edit</button>
      <p className='updated'>last updated never</p>
      </div>
    </div>
  );
}
