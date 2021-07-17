import React, { useEffect } from 'react';
import Confirm from './confirm';
import { useState } from "react";
import { useSelector} from "react-redux";
import firebase from "firebase";
import SetOrders from './SetOrders';


const Item = (props) => {
    const [list,setList] = useState([]);
    const [showPopup,setShowPopup] = useState(false);
    const [inStock,setInstock] = useState(true);
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const [url,setUrl] = useState();
    const shopID = props.shopID;
   

    function togglePopup() {
        if (account){
            return;
        }else{
             setShowPopup(!showPopup);
        }
       
    }

    

    useEffect(()=>{
        let mounted=true;
        async function getPic(id){
            let storageRef = firebase.storage().ref().child(shopID+'/MenuImage/'+id);
            
               await storageRef.getDownloadURL().then((url) =>{
                if (!document.getElementById("image"+id)){
                    return;
                }
                document.getElementById("image"+id).src=url;
                
                setUrl(url);
              })
            
            
        }

        function getList(){
            let ref= firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu");
            
            ref.where("ID","==",props.id)
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

        getPic(props.id);
        return()=>{mounted=false};
    },[])

 

    return (
            
        <div className='product' >
      
            <div className='itemPhoto' onClick={()=>{togglePopup();}}>
                <img id={"image"+props.id} src="" />
                
            </div>
            <div className='itemInfo'>
                {inStock ?
                <a id='itemName' onClick={()=>{togglePopup();}}>{props.name}</a>
                : <p　id='itemName'>SOLD OUT</p>
                }
                <p id='itemPrice'>{props.price ? <a>¥{props.price}</a>: null}</p>
                
                
                
            </div>

            {list.length>0 ?
            <div className='app'>
            {showPopup ? 
            <SetOrders shopID={shopID} name={props.name} price={props.price} id={props.id} closePopup={()=>{togglePopup();}}/>
            //"ここに新しいコンポーネントを作る。（セットの内容を指定してバスケットに入れる。セットを追加して、内容物を０円にして追加？）"
            : null
            }
            </div>
            :
            <div className='app'>
                {showPopup ? 
                <Confirm pic={url} name={props.name} price={props.price} id={props.id} message={props.name}　design="item_conf" action="かごに追加"　height='50%' closePopup={()=>{togglePopup();}}/>
                : null
                }
            </div>
            }
            
   
        </div>
    );

}

export default Item;