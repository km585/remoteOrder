import React from 'react';
import PropTypes from 'prop-types';
import Basket from './Basket';
import Login from './Login';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import Confirm from './confirm';
import Setting from './Setting';
import logo from './logo.png';

const Nav　= (props) =>{
    const [show,setShow] = useState(false);
    const [popup,setPopup] =useState(false);
    const [login,setLogin] = useState(false);
    const [user,setUser] = useState(false);
    //const [log,setLog] = useState(false);
    const [setting,setSetting] = useState(false);
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
  
 

    function toggleSetting(){
      setSetting(!setting);
    }
  
    function clickFood(){
          return props.dataFood();
    }
  
    function clickDrink(){
          return props.dataDrink();
    }

    function clickEdit(){
      return props.dataEdit();
    }

    function clickOrders(){
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




  
    componentDidMount()

    return (
      

        <div className="nav" >
          
          <img src={logo} id="logo" />
          <div className="menu_icon">
            <i className="fas fa-bars" ></i>
          </div>

          <ul className={show ?"opend_nav":"closed_nav"}>
            
           
            <li id="button1" onClick={()=>{clickFood();}}>{props.navli[0]}</li>
            <li id="button1" onClick={()=>{clickDrink();}}>{props.navli[1]}</li>
            {user ?
            <li id="button1" onClick={()=>{clickOrders();}}>ORDERS</li>
            : <li id="button1"onClick={()=>{togglePopup();}}>BASKET</li>
            }
            {user ?
               <div id="edit_buttons">
                 <li id ="button4" onClick={()=>{setSetting(!setting);}}>SETTING</li> 
                 <li id ="button4" onClick={()=>{clickEdit();}}>EDIT</li>
               </div>
              :null
            }
            
            
          </ul>

          
          
          <div className='app'>
            {popup ? 
            <Basket closePopup={()=>{togglePopup();}} shopID={props.shopID}/>
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
