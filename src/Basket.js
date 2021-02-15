import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import firebase from "firebase";
import Confirm from "./confirm";
import Reciept from "./Reciept";
import html2canvas from "html2canvas";


const Basket　= (props) => {
  const basket = useSelector((state) => state.BasketReducer.basket);
  const dispatch = useDispatch();
  const [lastID,setLastID] = useState(0);
  const [OC,setOC] = useState(false);
  const [orderDone,setOrderDone] = useState(false);
  const [yourID,setYourID] = useState();
  const [sum,setSum] =useState(0);
  const shopID = props.shopID;

  
  let total=0;
  let list = [];

  let num=0;

  function getSum(){
    basket.map((item)=>(
      total=total+item.price
    ))
    return total;
  }

  function reset(){
    dispatch({
        type:'RESET',

    });          
    
  }

  function remove(i){
    dispatch({
      type:'REMOVE',
      payload:{num:i}
    });
  }

  function getLastID(){
    let db = firebase.database();
    let ref = db.ref(shopID+'/Order/');
    ref.orderByKey()
    .limitToLast(1)
    .on('value',(snapshot)=>{
        let res = snapshot.val();
        for (let i in res){
            setLastID(i*1+1);
            return ;
        }
    });
  }
  function addData(list){
    let db =firebase.database();
    let id = lastID;
  
    let ref = db.ref(shopID+'/Order/'+id);
    setYourID(id);

    let price = getSum()*0.5;
    setSum(price);

    if (list.length==0){
      return;
    }else{
      
      ref.set({
        orderID: id,
        list:list,
        served:false,
        bill:price
      })
    }
    
    
    reset();
    toggleOC();
    setOrderDone(!orderDone);
    
    
  }
  
  if (lastID==0){
    getLastID();
  }

  function toggleOC(){
    setOC(!OC);
  }

  function ScrollUnlock() {
    let elems = document.getElementsByTagName("body");
    for (var item of elems) {
      item.classList.remove("scroll-lock");
    }

  }

  function toggleOrderDone(){
    setOrderDone(false);
    ScrollUnlock();
    props.closePopup();
  }

  

  function saveAsImage(url){
      const downloadLink = document.createElement("a");
    
      if (typeof downloadLink.download === "string") {
        downloadLink.href = url;
    
        // ファイル名
        downloadLink.download = "component.png";
    
        // Firefox では body の中にダウンロードリンクがないといけないので一時的に追加
        document.body.appendChild(downloadLink);
    
        // ダウンロードリンクが設定された a タグをクリック
        downloadLink.click();
    
        // Firefox 対策で追加したリンクを削除しておく
        document.body.removeChild(downloadLink);
      } else {
        window.open(url);
      }
  }

  function screenShot(){
    const target = document.getElementById("conf");
    html2canvas(target).then(canvas => {
      const targetImgUri = canvas.toDataURL("img/png");
      saveAsImage(targetImgUri);
    });
  }

  

  
  
  return (
    <div className='basket' >
      
          <div className='basket_inner' >
            {OC ?
            <div>
              <Confirm message="オーダーを送信しますか？" action="注文" order={()=>{addData(list);}} closePopup={()=>{toggleOC();}}/>
            </div>
            :null
            }
            <h4>買い物かご</h4>
            <div className="item_list" >
            
           
      
              {orderDone ?
              <div >
                
              <Reciept action="この注文完了票を画像として保存"　order={()=>{screenShot();}} orderInfo={[yourID,sum]}  closePopup={()=>{toggleOrderDone()}}/>
              </div>
              : null
              }
              <ul id="itemListInBasket">
                {basket.map((item)=>(
                  num = num+1,
                  item.num = num,
                  list.push(item.name),
                  <div id="itemInBasket">
                    <a onClick={()=>remove(item.num)} id="delete_key">消去</a>
                    {item.name}　¥{item.price} 
                  </div>
                  
                ))}
              </ul>
              
            </div>
            <div className="buttons">
              <a onClick={reset} id="reset">かごを空にする</a>
              <div　className='sum'>
                 合計金額 ¥{getSum()}
              
              </div>
              
              <button　onClick={()=>toggleOC()} id="button2">注文する</button>
            </div>
            
            <div id='close'>
              <button  onClick={()=>{toggleOrderDone();}} id="button2">メニューに戻る</button>
            </div>
          </div>
          
            
          
        </div>
  );

}



export default Basket;

