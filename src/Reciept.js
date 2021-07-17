import React, { useEffect, useState } from "react";
import firebase from "firebase";
import "firebase/firestore";


const Reciept　= (props) => {
    const shopID = props.shopID;
    const [message,setMessage] = useState(null);
   

    const today = new Date();

  
    function ScrollLock() {
        let elems = document.getElementsByTagName("body");
        for (var item of elems) {
          item.classList.add("scroll-lock");
        }
      }

      
  
      

    ScrollLock();

    useEffect(()=>{
        let mounted = true;

        function getMessage(){
            firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Info").doc("receipt")
            .get().then((doc)=>{
                let msg = doc.data().message;
                setMessage(msg);
            })
        }

        getMessage();

        return()=>{mounted=false};
    },[])


    return (
        <div className='receipt'  >
                <div className='receipt_inner'  id="conf">
                    <h1>Smart Order</h1>
                    <div className="receipt_font">
                    <p id="reciept_date">{today.getFullYear() + "/"}{ today.getMonth()+1}{ "/" + today.getDate()}<br /></p>
                        <p id="reciept_date">注文が完了しました</p>
                        
             
                        
                        <a>注文番号:{props.orderInfo[0]} </a>< br/>
                        
                        <a　id="reciept_date">合計金額:{props.orderInfo[1]}円</a>
                        </div>

                        <div className="messageFromShop">
                            
                        {message}
                    </div>
                    
                    
                    <div id="b1">
                        
                        <button className="btn-flat-border" onClick={props.order}>{props.action}</button><br />
                        <br />
                        <a className="warning">上のボタンをクリックして注文完了票をブラウザに保存。<br />もしくはスクリーンショットで端末に保存してください。</a>
                    </div>
                    
                    
                    <div　className="warning">
                        <a　className="reciept_underlined">一度メニューに戻ると、再度この注文完了票を表示することはできません。</a><br />
                        <p>商品受け取りの際にこの注文完了票をご提示ください。</p>
                        </div>
                    
                    
                    <div id="b2">
                        <button className="btn-flat-border" onClick={props.closePopup}>戻る</button>
                        
                    </div>
                </div>
            </div>
    );

}



export default Reciept;