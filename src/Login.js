import React, { useState } from "react";

import firebase from "firebase";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


const Login　= (props) => {
    const [data,setData] = useState([]);


      const uiConfig = {
        signInFlow: 'popup',
        signInSuccessUrl: "/",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
        ],
      }


    return (
        
        <div className="basket">
            <div className="basket_inner">
            <div class="log-form">
                <h2>Login to your shop account</h2>
                <div >
                  
                  <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                  
                  </div >
          
            </div>
            {props.closePopup ?
              <button class='close' onClick={props.closePopup}>メニューに戻る</button>
            : null
            }
                
               
            </div>
            
            
        </div>
    );
}

export default Login;