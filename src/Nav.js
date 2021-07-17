import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Basket from './Basket';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import Setting from './Setting';
import logo from './logo.png';


const Nav　= (props) =>{
  const [show,setShow] = useState(false);
  const [popup,setPopup] =useState(false);
  const [login,setLogin] = useState(false);
  const [user,setUser] = useState(false);
  const [setting,setSetting] = useState(false);
  const [timer,setTimer] = useState();
  const dispatch = useDispatch();
  const shopID = props.shopID;
  const account = useSelector((state) => state.AccountReducer.isSignedIn);
  

  const propTypes = {
      dataFood: PropTypes.func,
      dataDrink: PropTypes.func,
      dataEdit: PropTypes.func,
      dataOrders: PropTypes.func,
  };


  function togglePopup() {
      setPopup(!popup);
  }




  function clickFood(){
    setShow(false);
        return props.dataFood();
  }

  function clickDrink(){
    setShow(false);
        return props.dataDrink();
  }

  function clickEdit(){
    setShow(false);
    return props.dataEdit();
  }

  function clickOrders(){
    setShow(false);
    return props.dataOrders();
  }

  function componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (!user){
        dispatch({
          type:'LOGIN',
          payload:{isSignedIn:false}
        });
      }else {
        setUser(true);
        dispatch({
          type:'LOGIN',
          payload:{isSignedIn:true}
        });
      }
    });
  }

  useEffect(()=>{
    let mounted=true;
     if (mounted){setTimer(Date.now()+ ( 30 * 60 * 1000));}

    return()=>{mounted=false};
  },[])

  

  
  componentDidMount()

  return (

      <div className="nav" >
        
        <div onClick={()=>{setShow(!show)}} className="menu_icon">
          <i className="fas fa-bars" ></i>
        </div>
        <img src={logo} id="logo" />
    

        {user ?
        <ul className={show ?"opened_nav":"closed_nav"}>
          <li  onClick={()=>{clickFood();}}><i className="fas fa-utensils"></i>{props.navli[0]}</li>
          <li onClick={()=>{clickDrink();}}><i className="fas fa-glass-whiskey"></i>{props.navli[1]}</li>
          <li onClick={()=>{clickOrders();}}><i className="fab fa-elementor"></i>ORDERS</li>
          <li onClick={()=>{clickEdit();}}><i className="fas fa-edit"></i>EDIT</li>
          <li  onClick={()=>{setSetting(!setting);}}><i className="fas fa-cogs"></i>SETTING</li> 
        </ul>
        :
        <ul className={show ?"opened_nav2":"closed_nav2"}>
          <li onClick={()=>{clickFood();}}><i className="fas fa-utensils"></i>{props.navli[0]}</li>
          <li  onClick={()=>{clickDrink();}}><i className="fas fa-glass-whiskey"></i>{props.navli[1]}</li>
          <li onClick={()=>{togglePopup();}}><i className="fas fa-shopping-basket"></i>BASKET</li>
        </ul>
        
        }

        
        
        <div className='app'>
          {popup ? 
          <Basket timer={timer} closePopup={()=>{togglePopup();}} shopID={props.shopID}/>
          : null
          }

        </div>

        <div className='app'>
          {setting? 
          <Setting shopID={shopID} message="各種設定"　closePopup={()=>{setSetting(!setting);}} clear={()=>{setUser(false)}}/>
          : null
          }
       
        </div>

       

        </div>
        
        

      

  );

}

export default Nav;
