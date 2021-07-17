import React from 'react';
import Confirm from './confirm';
import { useState, useEffect } from "react";
import firebase from "firebase";
import Reciept from './Reciept';



const Setting = (props) =>{
    const [status,setStatus] = useState();
    const shopID = props.shopID;
    const [eatIn,setEatIn] = useState();
    const [log,setLog] = useState(false);
    const [message,setMessage] = useState(null);
    const [demo,setDemo] = useState(false);

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

    function changeMessage(){
       let  msg = document.getElementById("setting_msg").value;

       firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("receipt")
        .update({message:msg})
    }
   

    if (status == null ){
        getStatus2();
    }

    if (eatIn == null){
        getEatIn();
    }

    useEffect(()=>{
        let mounted = true;

        async function getMessage(){
            await firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Info").doc("receipt")
            .get().then((doc)=>{
                let msg = doc.data().message;
                setMessage(msg);
            })
        }

        if (eatIn){getMessage();}

        return()=>{mounted=false};
    },[])


    

    return (
        <div className="setting">
            <div className="setting_inner" >
            <div id="back_button">
            <i onClick={props.closePopup} className="far fa-times-circle"></i>
                </div>
                
                        <h2>{props.message}</h2>        
                    
                    <div className="popup_head">
                        <a >スマートオーダーを一時的に停止する</a>
                    </div>
                    
            <div className="setting_element">
                <a>現在のステータス：</a>{status ? <a　id="status_green">利用可能</a>: <a id="status_red">利用停止中</a>}
                <a> </a><button className="btn-flat-border"　onClick={()=>{changeStatus2();}}>変更</button>                
            </div>
            <div className="setting_element">
              <a>店内での飲食スペース：</a>{eatIn? <a id="status_green">あり </a>:<a id="status_red">なし</a>}
              <a> </a><button　className="btn-flat-border" onClick={()=>{changeEatIn();}}>変更</button>
            </div>
            <div className="setting_element">
             {eatIn ?
                null
                :
                <div className="setting_message">
                    <a>注文完了票に表示するメッセージ:</a>
                  <textarea id="setting_msg" placeholder={message}/>
                  <button className="btn-flat-border" onClick={()=>{setDemo(true)}}>シュミレート</button>
                  <button className="btn-flat-border" onClick={()=>{changeMessage()}}>変更</button>
            </div>
                
                }   
            </div>
            

            {demo ?
            <Reciept shopID={shopID} action="この注文完了票を画像として保存"　 orderInfo={["オーダーID",0]}  closePopup={()=>{setDemo(false)}}/>
            :null
            }


            <div className="setting_logout">
                
              <i onClick={()=>{setLog(true)}} className="fas fa-sign-out-alt"></i>
            </div>

            

            <div className='app'>
            {log ?
            <Confirm message="ログアウトしますか？"　action="はい" design="logout_conf" order={()=>{logout();}} closePopup={()=>{setLog(!log);}}/>
            :
            null
            }
          </div>
                
                
            </div>
            
        </div>
    );

}

export default Setting;