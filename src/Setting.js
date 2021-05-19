import React from 'react';
import Confirm from './confirm';
import { useState, useEffect } from "react";
import firebase from "firebase";


const Setting = (props) =>{
    const [status,setStatus] = useState();
    const shopID = props.shopID;
    const [eatIn,setEatIn] = useState();
    const [log,setLog] = useState(false);

    function getStatus2(){
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("status");
        ref.get().then((doc)=>{
            if (doc.exists){
                setStatus(doc.data().status);
            }else{
                ref.set({status:true})
                setStatus(true);
            }
        })
       // console.log("Setting_getStatus!");
    }

  

    function changeStatus2(){
        let newState = !status;
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("status")
        .update({status:newState});
        setStatus(null);
        //console.log("Setting_changeStatus!");

    }

    function getEatIn(){
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("Eat_in");

        ref.get().then((doc)=>{
            if (doc.exists){
                setEatIn(doc.data().Eat_in);
                
            }else{
                ref.set({Eat_in: false})
                setEatIn(false);
            }
        })
    }

    function changeEatIn(){
        let bool = !eatIn
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("Eat_in")
        .update({Eat_in:bool});
        setEatIn(null);
    }

    function logout() {
        firebase.auth().signOut();
        setLog(false);
        props.closePopup();
        props.clear();
    }
   

    if (status == null ){
        getStatus2();
    }

    if (eatIn == null){
        getEatIn();
    }

    

    return (
        <div className="setting">
            <div className="setting_inner" >
            <div id="back_button">
                    <button onClick={props.closePopup}　id="conf_button3">×</button>
                </div>
                <div id="msg">
                        {props.message}
                        
                    </div>
                    <a id="head">スマートオーダーを一時的に停止する</a>
            <div id="status">
                <a>現在のステータス：</a>{status ? <a　id="status_green">利用可能</a>: <a id="status_red">利用停止中</a>}
                <a> </a><button onClick={()=>{changeStatus2();}}>変更</button>                
            </div>
            <div id="status">
              <a>店内での飲食スペース：</a>{eatIn? <a id="status_green">あり </a>:<a id="status_red">なし</a>}
              <a> </a><button onClick={()=>{changeEatIn();}}>変更</button>
            </div>
            <div>
              <p><button onClick={()=>{setLog(true)}}>ログアウト</button></p>
            </div>

            <div className='app'>
            {log ?
            <Confirm message="ログアウトしますか？"　action="はい" order={()=>{logout();}} closePopup={()=>{setLog(!log);}}/>
            :
            null
            }
          </div>
                
                
            </div>
            
        </div>
    );

}

export default Setting;