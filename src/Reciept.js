import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import Confirm from "./confirm";
import html2canvas from "html2canvas";


const Reciept　= (props) => {
    const [done,setDone] = useState(false);

    const today = new Date();

    function shot(){
        props.order();
        setDone(true);
    }

    function ScrollLock() {
        let elems = document.getElementsByTagName("body");
        for (var item of elems) {
          item.classList.add("scroll-lock");
        }
      }

      
  
      

    ScrollLock();


    return (
        <div className='receipt'  >
                <div className='receipt_inner'  id="conf">
                    <h1>Smart Order</h1>
                    <div className="receipt_font">
                        <p>注文が完了しました。</p>
                        
             
                        <p>{today.getFullYear() + "/"}{ today.getMonth()+1}{ "/" + today.getDate()}<br /></p>
                        <a>注文番号:{props.orderInfo[0]}, </a>
                        
                        <a>合計金額:{props.orderInfo[1]}</a>
                        </div>
                    
                    
                    <div id="b1">
                        
                        <button onClick={props.order}>{props.action}</button><br />
                        <br />
                        <a className="warning">上のボタンをクリックして注文完了票をブラウザに保存。<br />もしくはスクリーンショットで端末に保存してください。</a>
                    </div>
                    
                    
                    <div　className="warning">
                        <a>一度メニューに戻ると、再度この注文完了票を表示することはできません。</a><br />
                        <a>必ずこの注文完了票を保存してください。</a><br />
                        <p>お帰りの際にこの注文完了票をご提示ください。<br />スタッフが確認致します。</p>
                        </div>
                    
                    <div id="b2">
                        <button onClick={props.closePopup}>戻る</button>
                        
                    </div>
                </div>
            </div>
    );

}



export default Reciept;