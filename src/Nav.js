import React from 'react';
import PropTypes from 'prop-types';
import Basket from './Basket';
import Login from './Login';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import Confirm from './confirm';

const Nav　= (props) =>{
    const [popup,setPopup] =useState(false);
    const [login,setLogin] = useState(false);
    const [user,setUser] = useState(false);
    const [log,setLog] = useState(false);
    const dispatch = useDispatch();
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
  
    function toggleLogin(){
        setLogin(!login);
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



    function logout() {
      firebase.auth().signOut();
      setUser(false);
      setLog(false);
    }

 
  
    componentDidMount()

    return (
      

        <div className="nav" >
          
          
          {user ?
          <div id="edit_buttons">
          <p id ="button4"><a onClick={()=>{setLog(true)}}>LOGOUT</a></p>
          <p id ="button4"><a onClick={()=>{clickEdit();}}>EDIT</a></p>
          </div>
          :null
          }
         
       
          <div className="list">
            
           
            <p id="button1"><a onClick={()=>{clickFood();}}>{props.navli[0]}</a></p>
            <p id="button1"><a onClick={()=>{clickDrink();}}>{props.navli[1]}</a></p>
            {user ?
            <p id="button1"><a onClick={()=>{clickOrders();}}>ORDERS</a></p>
            : <p id="button1"><a onClick={()=>{togglePopup();}}>BASKET</a></p>
            }
            
            
          </div>

          <div className='app'>
            {log ?
            <Confirm message="ログアウトしますか？"　action="はい" order={()=>{logout();}} closePopup={()=>{setLog(!log);}}/>
            :
            null
            }
          </div>
          
          <div className='app'>
            {popup ? 
            <Basket closePopup={()=>{togglePopup();}} shopID={props.shopID}/>
            : null
            }

          </div>
          
          
        </div>
        

    );

}
/**
 
 
<div>
          {login ? 
            <Login closePopup={()=>{toggleLogin();}} />
            : null
            }
          </div>

          */
export default Nav;
