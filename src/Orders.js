import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import { render } from '@testing-library/react';


const Orders = (props) => {
    const [data,setData] = useState([]);
    const [bill,setBill] = useState([]);
    const [orderID,setOrderID] = useState(null);
    const [orderList,setOrderList] = useState(null);
    const [popup,setPopup] = useState(false);
    const [searchedID,setSearchedID] = useState();
    const [status,setStatus] = useState();
    const [changer,setChanger] = useState("停止する");
    const [list,setList] = useState([]);
    const [test,setTest] = useState("default");
    const [orders,setOrders] = useState([]);
    const shopID = props.shopID;


    function getFireData(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Order');
        ref.orderByChild('served')
        .equalTo(false)
        .limitToFirst(10)
        .on('value',(snapshot) =>{
          setData(
            snapshot.val()
          );
        });
    }

  

    async function getOrders(){
        
        await firebase
        .firestore()
        .collection("owners").doc(shopID).collection("orders")
        .onSnapshot((snapshot) => {
            let list = []  
            snapshot.forEach((doc) => {
              
              list.push(doc.data());
            })
            setOrders(list)
        })
        
    }

  

    function makeTable(){
        
        if (data != null && data.length == 0){
            getFireData();
          
        }
        let ids =[];
        let lists =[];
        if (data == null || data.length==0){
          return ;
        }
        for (let i in data){
            ids.push(data[i].orderID);
            let l=[];
            for (let ii in data[i].list) {
                if (ii == (data[i].list).length-1){
                    l.push(data[i].list[ii]);
                }else{
                    l.push(data[i].list[ii]+", ");
                }
                
            };
            lists.push(l);
        }
       
        setOrderID(ids);
        setOrderList(lists);
    }

    function makeCombine(){
        if (orderID==null || orderList==null){
            makeTable();
        }
        let com = [];
        for (let i in orderID){
            let inner = [orderID[i],orderList[i]];
            com.push(inner);
        }
        
        setList(com);
    }

    function makeItServerd(id){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Order/'+id);
        ref.update({
            served:true,
        });
        setOrderID(null);
        setOrderList(null);
    }

    function searchOrder(){
        let id = document.getElementById("searchByID").value;
        setSearchedID(id);
        if (id==null || id ==""){
            return;
        }
        let db =firebase.database();
        let ref = db.ref(shopID+'/Order/'+id);
        ref.orderByKey()
        .on('value',(snapshot) =>{
            setBill(
              snapshot.val()
            );
          });
        if (bill == null || bill.length == 0){
            return;

        }else{
            setPopup(!popup);
        }
        
    }

    function getStatus(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Info/status');
        ref.once('value',(snapshot)=>{
            if (snapshot.exists()){
                setStatus(snapshot);
            }else{
                ref.set(true);
            }
        })
    }

    function changeStatus(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Info/');
        if (status==false){
           ref.update({status:false}); 
           setChanger("再開する");
        }else{
            ref.update({status:true});
            setChanger("停止する");
        }

    }

   

    if (status==null){
        getStatus();
    }
    
    //ここでfirestoreから読み込んだ物をorders stateに入れてる。
    useEffect(() => {
        async function getData(){
        
            await firebase
            .firestore()
            .collection("owners").doc(shopID).collection("orders")
            .onSnapshot((snapshot) => {
                let list = []  
                snapshot.forEach((doc) => {
                  
                  list.push(doc.data());
                })
                setOrders(list)
            })
            
        }
        getData();

    },[])
    
    useEffect(()=>{
        changeStatus();
    },[status])

    useEffect(()=>{
        makeCombine();
    },[])

  

   

    return (
        <div>
   
            <h2>オーダーの検索</h2>
                    <div className="editer"> 
                         <input type="number" id="searchByID" placeholder="OrderID（半角数字）"></input>
                         <button onClick={()=>{searchOrder();}}>検索</button>
                      </div>
                    
                    
                    {popup ?
                    <div className="basket">
                        <div className="basket_inner">
                            <h>ご注文</h>

                          <div className="item_list">   
                        {bill.list.map((item)=>(
                            <a>{item}<br /></a>
                        ))}
                          </div>
                          <button　 onClick={()=>{setPopup(!popup);}}>戻る </button>
                              <p className='sum'>合計金額：　¥{bill.bill}</p>
                              
                        </div>
                    </div>
                    :null
                    } 
                    
                
            <h2>未提供のオーダー</h2>
            
            <table　id="orderTable">
                <tr>
                    <th id="idCell">Order ID</th><th id="orderCell">Orders</th><th　id="buttonCell"></th>
                </tr>
                {list.map((item)=>(
                    <tr>
                    <td>{item[0]}</td><td>{item[1]}</td><td><button onClick={()=>{makeItServerd(item[0]);}}>提供完了</button></td>
                    </tr>
                ))}
                
            </table>
            
                <h2>オーダーを一時的に停止する</h2>
            <div className="editer">
                <a>現在のステータス：</a>{status ? <a　id="status_green">利用可能</a>: <a id="status_red">利用停止中</a>}
                <a> </a><button onClick={()=>{setStatus(!status);}}>{changer}</button>
                <p>一時的にお客様からのSmartOrderを通した注文を停止することができます。</p>
            </div>
//ここでordersのなかを回して、データを表示しようとしたけど、表示されない。試しに”aaa"を一周ごとにプリントさせようとしたけど、それすらできない。
//ちゃんと中身を回せてない？
//でも下のorders.lengthではちゃんと長さが表示される。
            {orders.map((item)=>{
             
                <p>aaa</p>
            
                console.log(item.orderID)
            })}
            {orders.length}
            
         </div>
        
        
    );
}

export default Orders;
