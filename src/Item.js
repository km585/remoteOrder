import React from 'react';
import Confirm from './confirm';
import { useState } from "react";
import { useSelector} from "react-redux";
import firebase from "firebase";


const Item = (props) => {
    

    const [showPopup,setShowPopup] = useState(false);
    const [inStock,setInstock] = useState(true);
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const shopID = props.shopID;
   

    function togglePopup() {
        if (account){
            return;
        }else{
             setShowPopup(!showPopup);
        }
       
    }

    function soldOut(){
        setInstock(!inStock);
    }

    function getPic(id){
        let storageRef = firebase.storage().ref().child(shopID+'/MenuImage/'+id);
        
           storageRef.getDownloadURL().then((url) =>{
            document.getElementById("image"+id).src=url;
          }); 
        
        
    }

 

    return (
            
        <div className='product' >
            <div className='itemPhoto' onClick={()=>{togglePopup();}}>
                <img id={"image"+props.id} src="" />
                {props.id ?
                getPic(props.id)
                : null}
            </div>
            <div className='itemInfo'>
                {inStock ?
                <a id='itemName' onClick={()=>{togglePopup();}}>{props.name}</a>
                : <p　id='itemName'>SOLD OUT</p>
                }
                <p id='itemPrice'>¥{props.price}</p>
                
                
                
            </div>
            <div className='app'>
                {showPopup ? 
                <Confirm name={props.name} price={props.price} id={props.id} message="買い物かごに追加しますか？"　action="かごに追加"　height='50%' closePopup={()=>{togglePopup();}}/>
                : null
                }
            </div>
   
        </div>
    );

}

export default Item;