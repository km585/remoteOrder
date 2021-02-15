import React, {Component, useState} from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Item from './Item';

const Drink = (props) => {
    const [data,setData] = useState([]);
    const shopID = props.shopID;
   

    function getFireData(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Menu');
        ref.orderByChild('type')
        .on('value',(snapshot) =>{
          setData(
            snapshot.val()
          );
        });
    }


  

    function getDrink(){
      let list=[];
      if (data != null){
        data.map((item)=>{
          if (item.type=="drink"){
              list.push(item);
          }
        })
      }
      

      return list;
  }

  
     if (data != null && data.length == 0){
         
        getFireData();
    }

    return (
        
        <div>
            
            <h2>Drink menu</h2>
            
            <a id="inform">※メニューからなくなっている商品は品切れ、販売停止中となっております。</a>
            {getDrink().map((item)=>(
              <div>
                {item.outOfStock ?
                null
                :<Item id={item.id} name={item.name} price={item.price}  shopID={shopID} />
                }
                
              </div>
            ))}
            
        </div>
        
    );
}


export default Drink;