import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Food from './Food';
import { useSelector} from "react-redux";
import Confirm from './confirm';


const Edit=(props)=> {
    const [lastID,setLastID] = useState(0);
    const [data,setData] = useState([]);
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const [popup,setPopup] = useState(false);
    const [msg,setMsg] = useState("");
    const [image,setImage] = useState();
    const shopID = props.shopID;
   



    function getLastID(){
        let db = firebase.database();
        let ref = db.ref(shopID+'/Menu');
        ref.orderByKey()
        .limitToLast(1)
        .on('value',(snapshot)=>{
            let res = snapshot.val();
            for (let i in res){
                setLastID(i);
                return ;
            }
        });
    }

    function getImage(event){
        let image = event.target.files[0];

        setImage(image);
    }
    

    function addData(){
        let db =firebase.database();
        let id = lastID*1+1;
        let ref = db.ref(shopID+'/Menu/'+id);
        
        let price = document.getElementById("price").value;
        if (!Number(price)){
            return　;
        }
        let storageRef = firebase.storage().ref(shopID+'/MenuImage/'+id);
        storageRef.put(image);
        ref.set({
            id: id,
            name: document.getElementById("name").value,
            outOfStock:false,
            price: price *1,
            type: document.getElementById("type").value,
        
        });
        
        
        document.getElementById("name").value = null;
        document.getElementById("price").value = null;
        setImage();
        document.getElementById("type").value = null;
    }

    function deleteData(){
        let db =firebase.database();
        let id = document.getElementById("deleteID").value;
        id = Number(id)*1;
        let ref = db.ref(shopID+'/Menu/'+id);
        ref.remove();
        let storageRef = firebase.storage().ref(shopID+'/MenuImage/'+id);
        storageRef.delete();
        document.getElementById("deleteID").value = null;
        setPopup(!popup);
    }
    
    if (lastID==0){
        getLastID();
    }

    function getFireData(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Menu');
        ref.orderByKey()
        .on('value',(snapshot) =>{
          setData(
            snapshot.val()
          );
        });
    }

    function　inStock(id){
        
        let db =firebase.database();
        let ref = db.ref(shopID+'/Menu/'+id);
        ref.update({
            outOfStock: false
        })
    }

    function　outStock(id){
        
        let db =firebase.database();
        let ref = db.ref(shopID+'/Menu/'+id);
        ref.update({
            outOfStock: true
        })
    }

    function conf(message){
        setPopup(!popup);
        setMsg(message);
    }


    useEffect(()=>{
        getFireData();
      });
    
    
    return(
        
            <div className="edit_page">
                {account? 
                <div>
                  <div className="editer">
                       <h2>商品の編集</h2>
                     
                  {popup ?
                  <Confirm message={msg} action="はい" order={()=>{deleteData();}} closePopup={()=>{setPopup(!popup);}}/>
                  : null
                  }
                
                  <h>新しい商品をデータベースに追加</h>
                  <div className="edit_inner">
                      <input type="text" id="name" placeholder="商品名"></input>
                      <input type="numebr" id="price" placeholder="金額（半角数字）"></input>
                      <select size="1" id="type">
                          <option value="food">フード</option>
                          <option value="drink">ドリンク</option>
                      </select>
                                
                      <input type="file" onChange={(event)=>{getImage(event)}} id="fileButton"></input> 
                
                      <button onClick={addData} >追加</button>
                    </div>
                  <h>商品をデータベースから完全に消去</h>
                  <div className="edit_inner">
                      <input type="number" id="deleteID" placeholder="商品ID（半角数字）"　></input>
                      <button onClick={()=>{conf("本当に消去しますか？");}}>消去</button>
                    </div>
                
                  </div>
                  <div className="stock">
                      <table id="stock_table">
                      <tr>
                    <th >ID</th><th >Name</th><th>Price</th><th>Stock</th><th></th>
                    </tr>
                      {data.map((item)=>(
                          <tr >
                          <td>{item.id}</td><td id="stock_item_name">{item.name}</td><td>¥{item.price}</td>
                          <td>{item.outOfStock ?
                          "在庫なし"
                          :"在庫あり"
                          }</td><td><button　onClick={()=>{outStock(item.id);}} id="stock_button">販売停止</button><button onClick={()=>{inStock(item.id);}} id="stock_button">販売再開</button></td>
                          </tr>
                      ))}
                      </table>
                   
                    </div>
                  
                
                </div>
                :<div><Food /></div>
                }
                
                
            </div>
    );
    
}

export default Edit;