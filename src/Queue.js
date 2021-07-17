import firebase from "firebase";
import React, { useState,useEffect } from "react";

const Queue = (props) => {
    const shopID = props.shopID;
    const [IDs,setIDs] = useState([]);
    const [eatIn,setEatIn] = useState();
    const [done,setDone] = useState([]);


    useEffect(()=>{
        let mounted = true;

        async function getQueueTakeOut(){
    
            await firebase
            .firestore()
            .collection("owners").doc(shopID).collection("orders")
            .where("served","==",false)
            .orderBy("time", "asc")
            .onSnapshot((snapshot) => {
                let list=[]; 
                    snapshot.forEach((doc) => {
                       let id = doc.data().orderID;
                       list.push(id);
                    })
                
                if (mounted){setIDs(list);}
            })
        }

        async function getQueueEatIn(){
    
            await firebase
            .firestore()
            .collection("owners").doc(shopID).collection("orders")
            .where("served","==",false)
            .orderBy("time", "asc")
            .onSnapshot((snapshot) => {
                let list=[]; 
                    snapshot.forEach((doc) => {
                       let id = doc.data().table;
                       list.push(id);
                    })
                
                if (mounted){setIDs(list);}
            })
        }


        if (eatIn==true){
            getQueueEatIn();
        
        }else{
           getQueueTakeOut(); 
         
        }
        
      
        return()=>{ mounted=false; }
    },[])

    useEffect(()=>{
        let mounted = true;

        async function getList(){
    
            await firebase
            .firestore()
            .collection("owners").doc(shopID).collection("orders")
            .where("served","==",true)
            .where("settled","==",false)
            .orderBy("orderID","asc")
            .onSnapshot((snapshot) => {
                let list=[]; 
                    snapshot.forEach((doc) => {
                       let id = doc.data().orderID;
                       list.push(id);
                    })
                
                if (mounted){setDone(list)};
            })
        }

        if (eatIn==true){
    
        }else{
            getList();
        }
        
      
        return()=>{ mounted=false; }
    },[])

    useEffect(()=>{
        let mounted=true;
        async function getEatIn(){
            let ref = firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Info").doc("Eat_in");
    
            await ref.get().then((doc)=>{
                if (doc.exists){
                    if (mounted){setEatIn(doc.data().Eat_in);}
                 
                }else{
                    if (mounted){setEatIn(false);}
                }
            })
        }
        getEatIn();
        return ()=>{mounted=false}
       },[])

       

    
    

    return (
        <div className="basket_outer">
           
            <div className="queue_inner">
                
                {IDs.length!=0 ?
                <div>
                    {eatIn ?
                      <div className="queue_numbers">
                        注文を調理中のテーブル番号　＞＞＞　NEXT：
                        <a>{IDs[0]}</a>
                        →
                        <a>{IDs[1]}</a>
                        →
                        <a>{IDs[2]}</a>
                       
                      </div>
 
                    :
                    <div className="queue_numbers">
                      <div >
                        受け取り呼び出し番号：
                        {done.map((item,key)=>(<a key={key}>{item}</a>))}
                        <a></a>
                        <a>
                        準備中の注文番号</a>＞＞＞ NEXT：
                        <a>{IDs[0]}</a>
                        →
                        <a>{IDs[1]}</a>
                        
                        
                        
                      </div>
                    </div>
                    }

                </div>
                :
                null
                }
            </div>
        </div>
    );
}

export default Queue;