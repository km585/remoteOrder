import React, { useState } from 'react';
import firebase from "firebase";
import "firebase/firestore";


const Orders = (props) => {
    const [data,setData] = useState([]);
    const [bill,setBill] = useState([]);
    const [orderID,setOrderID] = useState(null);
    const [orderList,setOrderList] = useState(null);
    const [popup,setPopup] = useState(false);
    const [searchedID,setSearchedID] = useState();
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
        return com;
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

   
  

    return (
        <div>
            <h2>オーダーの検索</h2>
                    <div className="editer"> 
                         <input type="number" id="searchByID" placeholder="OrderID（半角数字）"></input>
                         <button onClick={()=>{searchOrder();}}>検索</button>
                      </div>
                    
                    
                    {popup ?
                    <div className="orderSearch">
                        <div className="orderSearch_inner">
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
                {makeCombine().map((item)=>(
                    <tr>
                    <td>{item[0]}</td><td>{item[1]}</td><td><button onClick={()=>{makeItServerd(item[0]);}}>提供完了</button></td>
                    </tr>
                ))}
                
            </table>
         </div>

            
            
        
        
        
    );
}

export default Orders;
