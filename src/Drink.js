import React, {Component, useEffect, useState} from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Item from './Item';

const Drink = (props) => {
    const [data,setData] = useState([]);
    const shopID = props.shopID;

  

    function getDrink(){
      let list=[];
      if (data != null){
        data.map((item)=>{
          
          if (item.type=="drink"){
              list.push(item);
          }
        })
      }
     // console.log("getting DRINKs...!");

      return list;
  }

  
     

    useEffect(()=>{
      let mounted = true;
      async function getData(){
        //console.log("reading DRINKS...!");
        
        if (mounted==true){
          await firebase
        .firestore()
        .collection("owners").doc(shopID).collection("Menu")
        .onSnapshot((snapshot) => {
            let list = []  
            snapshot.forEach((doc) => {
              let item = doc.data();
              list.push(item);
            })
            if (mounted) {setData(list);}
        })
      }
    }
    getData();
    return()=>{mounted = false;
      //console.log("clean up Drink!")
    }
    },[])
   

    return (
        
        <div>
            
  
            
            <a id="inform">※メニューからなくなっている商品は品切れ、販売停止中となっております。</a>
            {getDrink().map((item)=>(
              <li key={item.ID}>
                {item.outOfStock ?
                null
                :<Item id={item.ID} name={item.name} price={item.price}  shopID={shopID} />
                }
                
              </li>
            ))}
            
        </div>
        
    );
}


export default Drink;