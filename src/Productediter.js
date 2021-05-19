import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Food from './Food';
import { useSelector} from "react-redux";
import Confirm from './confirm';
import Edit from './Edit';

const Productediter = (props) => {
    const shopID = props.shopID;
    const item = props.item;

    function getId(){
        let i;
        let newName = document.getElementById("newName").value
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection('Menu')
        .where("ID","==",item.ID)
        .get().then((quenrySnapshot)=>{
            quenrySnapshot.forEach((doc)=>
            i = doc.id)
            if (newName==""){
                return;
            }else{
                updateName(i,newName);
            }
           
        });
        let em = document.getElementById("newName");
        em.value = "";
        props.item.name = newName;
        
    }

    function updateName(id,n){
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection('Menu').doc(id)
        .update({name:n});
    }

    function updatePrice(){
        let i;
        let newPrice = document.getElementById("newPrice").value
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection('Menu')
        .where("ID","==",item.ID)
        .get().then((quenrySnapshot)=>{
            quenrySnapshot.forEach((doc)=>
            i = doc.id)
            if (newPrice==null){
                return;
            }else{
                firebase.firestore()
                .collection("owners").doc(shopID)
                .collection('Menu').doc(i)
                .update({price:newPrice})
            }
           
        });
        let em = document.getElementById("newPrice");
        em.value = "";
        props.item.price=newPrice;

        
    }

    return (
        <div className="pro_editer">
            <div className="proEditer_inner">
                <div id="back_button">
                 <button onClick={props.close} id="conf_button3">×</button>   
                </div>
                
                <h2>商品編集</h2>
                <div>
                    <p>
                        <a>商品名：</a>
                        <input　type="text" id="newName" placeholder={props.item.name}/> 
                        <button onClick={()=>{getId();}}>変更</button>
                    </p>
                    <p>
                        <a>価格：</a>
                        <input type="number" id="newPrice" placeholder={props.item.price}/>
                        <button onClick={()=>{updatePrice();}}>変更</button>
                    </p>

                </div>
            </div>
        </div>
    );

};

export default Productediter;