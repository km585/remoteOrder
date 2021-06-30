import React, { useEffect } from 'react';
import './App.css';
import "firebase/firestore";
import firebase from "firebase";
import Login from './Login';
import { Link } from 'react-router-dom'
import { useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import logo from './logo.png';


const Home = (props) => {


    const dispatch = useDispatch();
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const [shopName,setShopName] = useState();
    const [owners,setOwners] = useState([]);

   

    function componentDidMount() {
        firebase.auth().onAuthStateChanged(user => {
          if (!user){
            dispatch({
              type:'LOGIN',
              payload:{isSignedIn:false}
            });
            
          }else {
            
            dispatch({
              type:'LOGIN',
              payload:{isSignedIn:true}
            });

          }
        });
      }
      function logout() {
        firebase.auth().signOut();

      }


    function initialName(){
      firebase.firestore()
      .collection("owners").doc(props.user)
      .collection("Info").doc("shop_name")
      .get().then((snapshot)=>{
        if (snapshot.exists){
          setShopName(snapshot.data().display_name);
        }else{
          
        }
        
      })
      //console.log("initials!");

      


    }

    useEffect(()=>{
      async function getOwners(){
    
        await firebase.firestore()
        .collection("owners")
        .onSnapshot((snapshot)=>{
          let list =[]
          
          snapshot.forEach((doc)=>{
            
            let item = doc.id;
            list.push(item);
          
            
          })
     
          setOwners(list);
          
         // console.log("Home_getOwners!");
    
        })
      }
      getOwners();
    },[]);

 


    
    
      componentDidMount()
      if (shopName==null){
        initialName();
      }
      
      useEffect(()=>{
          initialName();
          //console.log("Home!");
      },[shopName]);
    

    return (
        <div >
          <div className="home_logo">
            <img src={logo} id="home_logo" />
          </div>
           
           
          <div className="home">
            { account?
            <div>
              <p >WELCOME! <button className="btn-flat-border" onClick={()=>{logout();}}>LOGOUT</button></p>
              <h2 >{shopName}</h2>
              
              <nav>
            
                <Link to={"/"+props.user} id="link">ストアのページに移動する</Link>
                
              </nav>
            </div>
            :
            <Login />

            }
          
          </div>
        
        </div>
    )
}

export default Home;
