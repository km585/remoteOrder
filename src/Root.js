import React from 'react';
import './App.css';
import App from './App';
import "firebase/firestore";
import firebase from "firebase";
import Home from './Home';
import { useState,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { BrowserRouter as Router, Route,Switch } from 'react-router-dom';

const Root = () => {
    const [user,setUser] = useState(false);
    const dispatch = useDispatch();
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const [owners,setOwners] = useState([]);

    function getOwners(){
    
      let db = firebase.database();
      let ref = db.ref("/");
      ref.once('value',(snapshot)=>{
          setOwners(snapshot.val())
      });
     
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

      function getName(){
        return firebase.auth().currentUser.uid;
      }

     

    


    componentDidMount();

    useEffect(()=>{
      getOwners();

  
    });

    return (
        <div>
            {account ?
             <Switch>
           
            
             <Route exact path="/" render={()=><Home user={getName()}/>}/>
             <Route  exact path={"/"+getName()} render={() => <App shopID={getName()} />} />
             
            
           </Switch>
            :
            <Switch>
           
            
              <Route  exact path="/" component={Home}/>
              
              {Object.keys(owners).map((item)=>(<Route path={"/"+item} render={()=> <App shopID={item}  />}/>))} 
                   
            </Switch>
            }
            

           
            
            
          
        </div>
    )
}



export default Root;
