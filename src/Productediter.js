import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";
import SetEditer from './SetEditer';


const Productediter = (props) => {
    const shopID = props.shopID;
    const item = props.item;
    const [setEdit,setSetEdit] = useState(false);

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

    function updateNumberFoods(){
        let i;
        let newOne = document.getElementById("numberFoods").value
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection('Menu')
        .where("ID","==",item.ID)
        .get().then((quenrySnapshot)=>{
            quenrySnapshot.forEach((doc)=>
            i = doc.id)
            if (newOne ==null){
                return;
            }else{
                firebase.firestore()
                .collection("owners").doc(shopID)
                .collection('Menu').doc(i)
                .update({numberFoods:Number(newOne)})
            }
           
        });
        let em = document.getElementById("numberFoods");
        em.value = "";
        props.item.numberFoods=newOne;
    }

    function updateNumberDrinks(){
        let i;
        let newOne = document.getElementById("numberDrinks").value
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection('Menu')
        .where("ID","==",item.ID)
        .get().then((quenrySnapshot)=>{
            quenrySnapshot.forEach((doc)=>
            i = doc.id)
            if (newOne ==null){
                return;
            }else{
                firebase.firestore()
                .collection("owners").doc(shopID)
                .collection('Menu').doc(i)
                .update({numberDrinks:Number(newOne)})
            }
           
        });
        let em = document.getElementById("numberDrinks");
        em.value = "";
        props.item.numberDrinks=newOne;
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
            <div className={setEdit ? "proEditer_inner_hidden":"proEditer_inner"}>
                <div id="back_button">
                <i onClick={props.close} className="far fa-times-circle"></i>
                </div>
                    <h2>商品編集</h2>
                <div className="ProEditer_item">
                    <p>
                        <a>商品名：</a>
                        <input　type="text" id="newName" placeholder={props.item.name}/> 
                        <button className="btn-flat-border"　onClick={()=>{getId();}}>変更</button>
                    </p>
                    <p>
                        <a>価格：</a>
                        <input type="number" id="newPrice" placeholder={props.item.price}/>
                        <button 　className="btn-flat-border"　onClick={()=>{updatePrice();}}>変更</button>
                    </p>
                    {props.item.type=="set"?
                    <div>
                    <p>
                        セット内容：
                    </p>
                    <p>
                       <a>フード数：</a> 
                        <input type="number" id="numberFoods" placeholder={props.item.numberFoods? props.item.numberFoods:null} />
                        <button 　className="btn-flat-border"　onClick={()=>{updateNumberFoods()}}>変更</button>
                    </p> 
                    <p>
                        <a>ドリンク数：</a>
                        <input type="number" id="numberDrinks" placeholder={props.item.numberDrinks ? props.item.numberDrinks:null} />
                        <button 　className="btn-flat-border"　onClick={()=>{updateNumberDrinks()}}>変更</button>
                    </p>  
                    <button className="btn-flat-border" onClick={()=>{setSetEdit(true)}}>セットの詳細を編集</button>
                    </div>
                    :
                    null
                    }
                    

                </div>
            </div>
            
            <SetEditer shopID={shopID} item={item} css={setEdit? "SetEditer_inner":"SetEditer_inner_hidden"} close={()=>{setSetEdit(false)}}/>
            
            
        </div>
    );

};

export default Productediter;