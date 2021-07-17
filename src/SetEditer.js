import React, { useState,useEffect } from 'react';
import firebase from "firebase";
import "firebase/firestore";


const SetEditer = (props) => {
    const shopID = props.shopID;
    const item = props.item;
    const [list,setList] = useState([]);
    const [drink,setDrink] = useState([]);
    const [food,setFood] = useState([]);
    const [showFood,setShowFood] = useState(true);

    function makeItAvailable(id){
        let ref= firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu");

            ref.where("ID","==",item.ID)
            .get().then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    let i = doc.id;
                    
                    let list = doc.data().availableItem;
                    if (!list){
                        let first=[];
                        first.push(id);
                        ref.doc(i).update({availableItem:first});
                        setList(first)
                        return ;
                    }else if (list.includes(id)){
                        let index = list.indexOf(id);
                        list.splice(index,1);
                        ref.doc(i).update({availableItem:list});
                    }else{
                        list.push(id);
                        ref.doc(i).update({availableItem:list});
                    }
                    
                    setList(list)
                })
            })
    }

 

    useEffect(()=>{
        let mounted = true;
        function getAllDrink(){
            firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu")
            .where("type","==","drink")
            .onSnapshot((snapshot)=>{
                let list =[]
                snapshot.forEach((doc)=>{
                    list.push(doc.data());
                })
                if (mounted){setDrink(list);}
            })
        }

        function getAllFood(){
            firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu")
            .where("type","==","food")
            .onSnapshot((snapshot)=>{
                let list =[]
                snapshot.forEach((doc)=>{
                    list.push(doc.data());
                })
                if (mounted){setFood(list);}
            })
        }

        getAllDrink();
        getAllFood();

        return ()=>{mounted= false;}
    },[])

    useEffect(()=>{
        let mounted = true;
        function getList(){
            let ref= firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu");
            
            ref.where("ID","==",item.ID)
            .get().then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    if (!doc.data().availableItem){
                        setList([])
                        return;
                    }
                    let list = doc.data().availableItem;
                    if (mounted){setList(list)}
                })
            })
        }
        getList();
        return ()=>{mounted=false;}
    },[])

    return (
        
            <div className={props.css}>
                <div id="back_button">
                <i onClick={()=>{props.close()}} className="far fa-times-circle"></i>
                </div>
                <div className="buttons_in_setEditer">
                    <button className="btn-flat-border" onClick={()=>{setShowFood(true)}}>Food</button><button className="btn-flat-border" onClick={()=>setShowFood(false)}>Drink</button>
                </div>
                <div className="list_in_setEditer">
                    {showFood?
                    <div>
                        {food.map((i,key)=>(
                          
                           <p key={key} onClick={()=>{makeItAvailable(i.ID)}} className={list.includes(i.ID) ? "available_in_set":"unavailable_in_set"}>{i.name}</p>
                          
                        ))}
                    </div> 
                    :
                    <div>
                       {drink.map((i,key)=>(
                           <p key={key} onClick={()=>{makeItAvailable(i.ID)}} className={list.includes(i.ID) ? "available_in_set":"unavailable_in_set"}>{i.name}</p>
                        ))}
                    </div> 
                    }
                </div>

                    
                
                
            </div>
        
    );
}

export default SetEditer;