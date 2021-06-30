import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Confirm from './confirm';
import sound1 from "./sound/sound1.mp3";



const Orders = (props) => {
    
    const [bill,setBill] = useState([]);
    const [sum,setSum] = useState();
    const [orderID,setOrderID] = useState(null);
    const [orderList,setOrderList] = useState(null);
    const [popup,setPopup] = useState(false);
    const [searchedID,setSearchedID] = useState();
    //const [status,setStatus] = useState();
    const [eatIn,setEatIn] = useState();
    const [orders,setOrders] = useState([]);
    const [settle, setSettle] = useState(false);
    const [delConf,setDelConf] = useState(null);
    const [served,setServed] = useState(false);
    const shopID = props.shopID;

    


    function changeServedwithID(id){
        firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .doc(id)
        .update({served:true})
    }

    function makeItServerd2(id){
        firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .where("orderID","==",id)
        .get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                changeServedwithID(doc.id);
            })
        })
        setServed(null);
        setOrderID(null);
        setOrderList(null);
    }


    function searchOrderWithID(){
        let id = document.getElementById("searchByID").value;
        let year = new Date().getFullYear();
      let month = new Date().getMonth();
      let date = new Date().getDate();
      const sinceAtDate = firebase.firestore.Timestamp.fromDate(new Date(year,month,date))
        setSearchedID(id);
        if (id==null || id ==""){
            return;
        }
        
        let db =firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .orderBy("time","asc")
        .where("orderID","==",id*1).startAt(sinceAtDate)
        .get().then((querySnapshot)=>{
            
            querySnapshot.forEach((doc)=>{
                let item = doc.data();
                
                setBill(item);
                setPopup(!popup);
            })
            
        })
    }

    function searchOrderWithTable(){
        let id = document.getElementById("searchByID").value;
        
        setSearchedID(id);
        if (id==null || id ==""){
            return;
        }
        
        let db =firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .where("table","==",id*1).where("served","==",true)
        .where("settled","==",false)
        .get().then((querySnapshot)=>{
            let l = []
            let s = 0;
            
            querySnapshot.forEach((doc)=>{
                let item = doc.data();
                l.push(item);
                s += item.bill;
            })
            setSum(s);
            setBill(l);
            setPopup(!popup);
            
        })
    }

    function settleID(id){
       
        let ref= firebase.firestore();

        ref.collection("owners").doc(shopID).collection("orders")
        .doc(id).update({settled:true});
    }

    function makeSettled(bill){

        bill.map((item)=>{
            firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .where("orderID","==",item.orderID).where("settled","==",false)
        .get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                settleID(doc.id);
            })
        })
        })
        setSettle(!settle);
        setPopup(!popup);
    }

    function deleteOrder(id){
        let year = new Date().getFullYear();
      let month = new Date().getMonth();
      let date = new Date().getDate();
      const sinceAtDate = firebase.firestore.Timestamp.fromDate(new Date(year,month,date))
        
        firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .orderBy("time","asc").startAt(sinceAtDate)
        .where("orderID","==",id)
        .get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                
                doc.ref.delete();
            })
        })
        setDelConf(null);
    }






  

  

   useEffect(()=>{
       let mounted = true;
    async function getEatIn(){
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("Eat_in");

        await ref.get().then((doc)=>{
            if (doc.exists){
                setEatIn(doc.data().Eat_in);
             
            }else{
                ref.set({Eat_in: false})
                if (mounted){setEatIn(false);}
            }
        })
    }
    getEatIn();
    return ()=>{mounted = false;
    }
   },[])


    useEffect(() => {
        let mounted = true;
        async function getData(){
        
            await firebase
            .firestore()
            .collection("owners").doc(shopID).collection("orders")
            .where("served","==",false)
            .orderBy("time", "asc")
            .limit(10)
            .onSnapshot((snapshot) => {
                let list = []  
                snapshot.forEach((doc) => {
                  let item = doc.data();
                  list.push(item);
                })
                if (mounted){setOrders(list);new Audio(sound1).play()}
            })
            
        }
        getData();
        return ()=>{mounted = false;
        }
        

    },[])
    
    

  

  

   

    return (
        <div className="order_inner">
            
            <h2>オーダーの検索</h2>
                    {eatIn ?
                      <div　className="editer">
                          <input type="number" id="searchByID" placeholder="テーブル（半角数字）"></input>
                         <button  className="btn-flat-border" onClick={()=>{searchOrderWithTable();}}>検索</button>
                      </div>
                    :
                      <div className="editer"> 
                         <input type="number" id="searchByID" placeholder="OrderID（半角数字）"></input>
                         <button className="btn-flat-border" onClick={()=>{searchOrderWithID();}}>検索</button>
                      </div>
                    }
                    
                    
                    
                    {popup ?
                    <div className="basket">
                        

                        {eatIn ?
                        <div className="basket_inner">
                            <div id="back_button">
                            <i onClick={()=>{setPopup(!popup);}} className="far fa-times-circle"></i>
                              </div>
                        <div id="order_head"><a>テーブル番号　{searchedID}　のご注文</a></div>
                        <div className="item_list">   
                        {bill.map((item)=>(
                            
                            <div key={item.orderID}>{item.list.map((i)=>(<li key={i}>{i}<br/></li>))}</div>
                        ))}
                        {bill.length ==0 ?
                        <a>未精算の注文はありません。</a>
                        :
                        <button className="btn-flat-border" onClick={()=>{setSettle(!settle);}}>精算完了</button>

                        }
                        {settle ?
                        <Confirm message="精算が完了しましたか？"　action="はい" order={()=>{makeSettled(bill);}} closePopup={()=>{setSettle(!settle)}} />
                        :
                        null
                        }


                        
                          </div>
                          
                          
                              <p className='sum'>合計金額：　¥{sum}</p>
                              </div>
                        :
                        <div className="basket_inner">
                            <div id="back_button">
                            <i onClick={()=>{setPopup(!popup);}} className="far fa-times-circle"></i>
                              </div>
                        <div id="order_head">注文番号　{searchedID}　のご注文</div>
                        <div className="item_list">   
                        {bill.list.map((item)=>(
                            <li key={item}>{item}<br/></li>
                        ))}
                      
                        
                          </div>
                              <p className='sum'>合計金額：　¥{bill.bill}</p>
                              <a id="customer_contact">お客様情報：{bill.contact}</a>
                              </div>
                        }
                          
                              
                        </div>
                   

                    :null
                    } 
                    
                
            <h2>未提供のオーダー</h2>
            

            <table id="orderTable">
                <tbody>
                <tr key="top">
                {eatIn ? <th id="idCell" key="idCell">Table</th>:<th id="idCell" key="idCell">ID</th>}<th id="orderCell" key="orderCell">Orders</th><th　key="buttonCell" id="buttonCell"></th><th id="buttonCell"></th>
                </tr>
                
                {orders.map((item)=>(
                    
                    <tr key={item.orderID}>
                       
                        
                    {eatIn ? <td key={"table"+item.table}>{item.table}</td>:<td key={"order"+item.orderID}>{item.orderID}</td>}<td>{item.list.map((item)=>(<a key={item}>{item}<br/></a>))}</td><td><button className="btn-flat-border" onClick={()=>{setServed(item.orderID);}}>提供完了</button></td><td><i onClick={()=>{setDelConf(item.orderID)}} className="fas fa-trash-alt"></i></td>
                 
                    </tr>
                ))}
                </tbody>
            </table>  

            {delConf ?
            <Confirm message="オーダーを消去しますか？" design="logout_conf" order={()=>{deleteOrder(delConf)}}　action="はい" closePopup={()=>{setDelConf(null)}}/>
            :
            null
            }

            {served ?
            <Confirm message="注文の提供を完了しますか？" design="logout_conf" order={()=>makeItServerd2(served)} action="はい" closePopup={()=>{setServed(null)}} />
            :
            null
            }

                
            
            
         </div>
        
        
    );
}

export default Orders;
