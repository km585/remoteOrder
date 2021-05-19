import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Confirm from './confirm';



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

        setOrderID(null);
        setOrderList(null);
    }


    function searchOrderWithID(){
        let id = document.getElementById("searchByID").value;
        setSearchedID(id);
        if (id==null || id ==""){
            return;
        }
        
        let db =firebase.firestore()
        .collection("owners").doc(shopID).collection("orders")
        .where("orderID","==",id*1)
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






  

  

   useEffect(()=>{
    async function getEatIn(){
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("Eat_in");

        await ref.get().then((doc)=>{
            if (doc.exists){
                setEatIn(doc.data().Eat_in);
             
            }else{
                ref.set({Eat_in: false})
                setEatIn(false);
            }
        })
    }
    getEatIn();
   },[])


    useEffect(() => {
        async function getData(){
        
            await firebase
            .firestore()
            .collection("owners").doc(shopID).collection("orders")
            .where("served","==",false)
            .orderBy("orderID", "asc")
            .limit(10)
            .onSnapshot((snapshot) => {
                let list = []  
                snapshot.forEach((doc) => {
                  let item = doc.data();
                  list.push(item);
                })
                setOrders(list)
            })
            
        }
        getData();
        //console.log("Orders_getData!");

    },[])
    
    

  

  

   

    return (
        <div>
   
            <h2>オーダーの検索</h2>
                    {eatIn ?
                      <div　className="editer">
                          <input type="number" id="searchByID" placeholder="テーブル（半角数字）"></input>
                         <button onClick={()=>{searchOrderWithTable();}}>検索</button>
                      </div>
                    :
                      <div className="editer"> 
                         <input type="number" id="searchByID" placeholder="OrderID（半角数字）"></input>
                         <button onClick={()=>{searchOrderWithID();}}>検索</button>
                      </div>
                    }
                    
                    
                    
                    {popup ?
                    <div className="basket">
                        

                        {eatIn ?
                        <div className="basket_inner">
                            <div id="back_button">
                              <button　 onClick={()=>{setPopup(!popup);}} id="conf_button3">×</button>
                              </div>
                        <div id="order_head"><a>テーブル番号　{searchedID}　のご注文</a></div>
                        <div className="item_list">   
                        {bill.map((item)=>(
                            
                            <div key={item.orderID}>{item.list.map((i)=>(<li key={i}>{i}<br/></li>))}</div>
                        ))}
                        {bill.length ==0 ?
                        <a>未精算の注文はありません。</a>
                        :
                        <button onClick={()=>{setSettle(!settle);}}>精算完了</button>

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
                              <button　 onClick={()=>{setPopup(!popup);}} id="conf_button3">× </button>
                              </div>
                        <div id="order_head"><h>注文番号　{searchedID}　のご注文</h></div>
                        <div className="item_list">   
                        {bill.list.map((item)=>(
                            <li key={item}>{item}<br/></li>
                        ))}
                      
                        <li key="info">{bill.contact}</li>
                          </div>
                              <p className='sum'>合計金額：　¥{bill.bill}</p>
                              </div>
                        }
                          
                              
                        </div>
                   

                    :null
                    } 
                    
                
            <h2>未提供のオーダー</h2>
            

            <table id="orderTable">
                <tbody>
                <tr>
                {eatIn ? <th id="idCell">Table</th>:<th id="idCell">Order ID</th>}<th id="orderCell">Orders</th><th　id="buttonCell"></th>
                </tr>
                {orders.map((item)=>(
                    <tr key={item.table}>
                        
                    {eatIn ? <td>{item.table}</td>:<td>{item.orderID}</td>}<td>{item.list.map((item)=>(<a key={item}>{item}<br/></a>))}</td><td><button onClick={()=>{makeItServerd2(item.orderID);}}>提供完了</button></td>
                   
                    </tr>
                ))}
                </tbody>
            </table>  

                
            
            
         </div>
        
        
    );
}

export default Orders;
