import React, {useState,useEffect} from 'react';
import firebase from "firebase";
import "firebase/firestore";
import Item from './Item';


const Food =(props)=> {
    const [data,setData] = useState([]);
    const shopID = props.shopID;


    function getFood(){
        let list=[];
        if (data != null){
          data.map((item)=>{
            if (item.type=="food"){
                list.push(item);
            }
          })
        }
        //console.log("getting FOOD...!");

        return list;
    }

    useEffect(()=>{
      let mounted = true;
      async function getData(){
        //console.log("reading FOOD...!");
        
        if (mounted){
          await firebase
        .firestore()
        .collection("owners").doc(shopID).collection("Menu")
        .onSnapshot((snapshot) => {
            let list = []  
            snapshot.forEach((doc) => {
              let item = doc.data();
              list.push(item);
            })
            if (mounted){setData(list);}
          })
        }
      }
    
      getData();
      return()=> {mounted=false;
        //console.log("claen up Foods!")
      };
    },[])


    return (
        
        <div>
          <div>
            <h2></h2>
            <a id="inform">※メニューからなくなっている商品は品切れ、販売停止中となっております。</a>
            {getFood().map((item)=>(
                
                <li key={item.ID}>
                {item.outOfStock ?
                null
                :<Item id={item.ID} name={item.name} price={item.price}  shopID={shopID} />
                }
                
              </li>
            ))}
          </div>

            
        </div>
        
    );
    
}

export default Food;