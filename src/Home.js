import React, { useEffect } from 'react';
import './App.css';
import "firebase/firestore";
import firebase from "firebase";
import Login from './Login';
import { Link } from 'react-router-dom'
import { useState} from "react";
import { useSelector, useDispatch } from "react-redux";



const Home = (props) => {
    const [popup,setPopup] =useState(true);
    const [user,setUser] = useState(false);
    const dispatch = useDispatch();
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const [owners,setOwners] = useState([]);
    const [shopName,setShopName] = useState();

   

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
      }

     
      function getOwners(){
    
        let db = firebase.database();
        let ref = db.ref("/");
        ref.once('value',(snapshot)=>{
            setOwners(snapshot.val())
        });
       
    }

    function initialName(){
      let db =firebase.database();
      let ref = db.ref(props.user+'/Info/shop_name');
      
          ref.on('value',(snapshot) =>{
              if (snapshot.val()==null) {
                  setShopName("NO NAME");
              }else{
                  setShopName(
                snapshot.val()
              );
              }
              
            });
      
  }


    
    
      componentDidMount()

      useEffect(()=>{
        getOwners();
        initialName();
      });
    

    return (
        <div>
           <h1>Smart Order</h1>
           
          <div className="home">
            { account?
            <div>
              <p >WELCOME! <button onClick={()=>{logout();}}>LOGOUT</button></p>
              <h2 >{shopName}</h2>
              
              <nav>
            
                <Link to={"/"+props.user} id="link">ストアのページに移動する</Link>
                
              </nav>
            </div>
            :
            <Login />
              //<nav>
                //{Object.keys(owners).map((item)=>(<Link to={"/"+item} >次</Link>))} 
              //</nav>

            }
          
          </div>
        
        </div>
    )
}

export default Home;
