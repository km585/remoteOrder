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
    const [initial,setInitial] = useState(false);

    

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
       //   console.log("Root_getOwner!");
    
        })
      }
      getOwners();
    },[]);

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
              {owners.map((item)=>(<Route key={item} path={"/"+item} render={()=> <App shopID={item}  />}/>))} 
                   
            </Switch>
            }
            

           
            
            
          
        </div>
    )
}



export default Root;
