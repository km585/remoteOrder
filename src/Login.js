import React from "react";

import firebase from "firebase";

import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';


const Login　= (props) => {
  


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
            
                <h2>LOGIN</h2>
                <div id="login_menu">
                  
                  <StyledFirebaseAuth  uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
                  
                  </div >
          
        
            {props.closePopup ?
              <button class='close' onClick={props.closePopup}>メニューに戻る</button>
            : null
            }
                
               
            </div>
            
            
        </div>
    );
}

export default Login;