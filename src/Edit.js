import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Food from './Food';
import { useSelector} from "react-redux";
import Confirm from './confirm';
import Productediter from './Productediter.js';


const Edit=(props)=> {
    const [lastID,setLastID] = useState(0);
    const [data,setData] = useState([]);
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const [popup,setPopup] = useState(false);
    const [msg,setMsg] = useState("");
    const [image,setImage] = useState();
    const [productEdit,setProductEdit]= useState(false);
    const [target,setTarget] = useState(null);
    const shopID = props.shopID;
   


    function getLastID2(){
        
        
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Menu")
        .get().then((querySnapshot)=>{
            let last=0;
        
            querySnapshot.forEach((doc)=>{
                let id = doc.data().ID;
            
                if (id > last){
                    last = id;
                 
                }
            })
            setLastID(last);

        })
    }



    function getImage(event){
        let image = event.target.files[0];

        setImage(image);
    }
    

    
    function addData2(){
        
        let id = lastID*1+1;
        
      
        let ref = firebase.firestore().
        collection("owners").doc(shopID)
        .collection("Menu")
        let name = document.getElementById("name").value;
        let type = document.getElementById("type").value;
        let price = Number(document.getElementById("price").value);

        if (name=="" || type == null || price == 0 || type==null){
            alert("商品の情報を入力してください。")
            return;
        }
        
        if (isNaN(price)){
            alert("価格は半角数字で表示してください。")
            
            return　;
        }
        let storageRef = firebase.storage().ref(shopID+'/MenuImage/'+id);
        storageRef.put(image);
        ref.add({
            ID: id,
            name: name,
            outOfStock:false,
            price: price *1,
            type: type,
        
        });
        
        
        document.getElementById("name").value = null;
        document.getElementById("price").value = null;
        setImage();
        document.getElementById("type").value = null;
        document.getElementById("fileButton").value=null;
    }

    

    function deleteData(){
        
        let id = document.getElementById("deleteID").value;
        id = Number(id)*1;
        if (isNaN(id)){
            alert("半角数字で表示してください。")
            
            return　;
        }
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Menu");

        ref.where("ID","==",id)
        .get().then((querySnapshot)=>{
            querySnapshot.forEach((doc)=>{
                let i = doc.id;
                ref.doc(i).delete();
            })
        })
        let storageRef = firebase.storage().ref(shopID+'/MenuImage/'+id);
        storageRef.delete();
        document.getElementById("deleteID").value = null;
        setPopup(!popup);
        
    }


    
    

    
   
    function　inStock(id){
        
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Menu");

        ref.where("ID","==",id)
        .get().then((querySnapshot)=>{
           querySnapshot.forEach((doc)=>{
               let i = doc.id;
               ref.doc(i).update({  outOfStock: false})
           })
        })

    
    }



    function　outStock(id){
        let ref = firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Menu");

        ref.where("ID","==",id)
        .get().then((querySnapshot)=>{
           querySnapshot.forEach((doc)=>{
               let i = doc.id;
               ref.doc(i).update({ outOfStock: true})
           })
        })

    }

    function conf(message){
        setPopup(!popup);
        setMsg(message);
    }

    function getEditProduct(target){
        setProductEdit(!productEdit);
        setTarget(target);
    }


    useEffect(()=>{
        let mounted = true;
        function getData(){
            if (mounted){
            firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu")
            .orderBy("ID","asc")
            .onSnapshot((snapshot)=>{
                let list = []  
                snapshot.forEach((doc) => {
                  let item = doc.data();
                  list.push(item);
                })
                if (mounted){setData(list);}
            })
        }
            //console.log("get data in Edit...!");
        }
        getData();
        return ()=>{mounted = false;
            //console.log("clean up Edit1!");
        }
        
      },[]);

    useEffect(()=>{
        let mounted = true;
        if (mounted){getLastID2();}
        return ()=>{mounted = false;
            //console.log("clean up Edit2!")
        }
       // console.log("get lastID2 in Edit...!");
    },[data])
    
    
    return(
        
            <div className="edit_page">
                {account? 
                <div>
                  <div className="editer">
                       <h2>在庫編集・確認</h2>
                     
                  {popup ?
                  <Confirm message={msg} action="はい" order={()=>{deleteData();}} closePopup={()=>{setPopup(!popup);}}/>
                  : null
                  }
                
                  <a className="sub_head">新しい商品をデータベースに追加</a>
                  <div className="edit_inner">
                      <input type="text" id="name" placeholder="商品名"></input>
                      <input type="number" id="price" placeholder="金額（半角数字）"></input>
                      <select size="1" id="type">
                          <option value="food">フード</option>
                          <option value="drink">ドリンク</option>
                          <option value="set">セット</option>
                      </select>
                                
                      <input type="file" onChange={(event)=>{getImage(event)}} id="fileButton"></input> 
                
                      <button className="btn-flat-border" onClick={addData2} >商品を追加</button>
                    </div>
                  <a className="sub_head">商品をデータベースから完全に消去</a>
                  <div className="edit_inner">
                      <input type="number" id="deleteID" placeholder="商品ID（半角数字）"　></input>
                      <button className="btn-flat-border"　onClick={()=>{conf("本当に消去しますか？");}}>消去</button>
                    </div>
                
                  </div>
                  <div className="stock">
                      <table id="stock_table">
                          <tbody>
                      <tr>
                    <th >ID</th><th >Name</th><th>Price</th><th>Stock</th><th></th>
                    </tr>
                    </tbody>
                    <tbody>
                      {data.map((item)=>(
                          <tr key={item.ID} >
                          <td>{item.ID}</td><td id="stock_item_name"><a onClick={()=>{getEditProduct(item);}}>{item.name}</a></td><td>¥{item.price}</td>
                          <td　id="stock_checker">{item.outOfStock ?
                          <a>×</a>
                          :<a>○</a>
                          }</td><td id="stock_button_outer"><button　className="btn-flat-border"　onClick={()=>{outStock(item.ID);}} id="stock_button">販売停止</button><button　className="btn-flat-border" onClick={()=>{inStock(item.ID);}} id="stock_button">販売再開</button></td>
                          </tr>
                      ))}
                      </tbody>
                      </table>
                    {productEdit?
                    <Productediter shopID={shopID} item={target} close={()=>{setProductEdit(!productEdit)}}/>
                    :
                    null
                    }                   
                    </div>
                  
                
                </div>
                :<div><Food /></div>
                }
                
                
            </div>
    );
    
}

export default Edit;