import React, { useEffect,useState  } from 'react';
import Confirm from './confirm';
import firebase from "firebase";



const SetOrder = (props) => {
    const [foodList,setFoodList] = useState([]);
    const [drinkList,setDrinkList] = useState([]);
    const [choice,setChoice] = useState([]);
    const [food,setFood] =useState(0);
    const [drink,setDrink] = useState(0);
    const [current,setCurrent] = useState();
    const [url,setUrl]= useState(null);
    const [popup,setPopup] = useState(false);
    const shopID=props.shopID;
    const ID = props.id;

    function choose(name){
        let list =[];

        if (choice.length>0){
            choice.map((item)=>{
                list.push(item);
            })
        }

        list.push(name);
        

        setChoice(list);
        setPopup(false)

    }

    function getPic(id,name){
        setCurrent(name)
        setPopup(true);
        let storageRef = firebase.storage().ref().child(shopID+'/MenuImage/'+id);
        
           storageRef.getDownloadURL().then((url) =>{
            setUrl(url);
            if (!document.getElementById("takeALook")){
                return;
            }
            document.getElementById("takeALook").src=url;
            
            
          })
        
        
    }


    useEffect(()=>{
        let mounted = true;

        function getItems(list){
            firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu")
            .get().then((querySnapshot)=>{
                let foods =[]
                let drinks = []
                querySnapshot.forEach((doc)=>{
                    let item = doc.data();
                    if (list.includes(item.ID)){
                        if (item.type=="food"){
                            foods.push(item);
                        }else{
                            drinks.push(item);
                        }
                    }
                })
                if (mounted){setFoodList(foods);setDrinkList(drinks)};
            })
        }

        function getList(){
            let ref= firebase.firestore()
            .collection("owners").doc(shopID)
            .collection("Menu");
            
            ref.where("ID","==",ID)
            .get().then((querySnapshot)=>{
                querySnapshot.forEach((doc)=>{
                    if (!doc.data().availableItem){
                        return;
                    }
                    let food = doc.data().numberFoods;
                    let drink = doc.data().numberDrinks;
                  
                    if (mounted){
                        setFood(food);
                        setDrink(drink);
                    }
                    let list = doc.data().availableItem;
                    getItems(list)
                })
            })
        }


       


        getList();
        return ()=>{mounted=false;}
    },[])
    
    return(
        <div className='conf'>
           
            {popup ?
            <div className="SetOrders_inner">
                <div id="back_button">
                    <i onClick={()=>{setPopup(false)}} className="far fa-arrow-alt-circle-left"></i>
                </div>
                {url!=null ? 
                <div　className="ProEditer_item">
                   
                        <img id="takeALook" src="" />
                   
                        <p className="takeALook_name">{current}</p>
                <div className="takeALook_button">
                    
                 <button onClick={()=>{choose(current)}} className="btn-flat-border">この商品を選択する</button>
                 </div>
                 </div>
                :null}
                </div>
            :
            <div className="SetOrders_inner">
                <div id="back_button">
                    <i onClick={()=>{props.closePopup()}} className="far fa-times-circle"></i>
                </div>
                
                {food > choice.length ?
                <div>
                    <h3>フード選択：</h3>
                    <div className="list_in_setOrders">
                    {foodList.map((item,key)=>(
                        <p key={key} onClick={()=>{getPic(item.ID,item.name)}}>{item.name}</p>
                    ))}
                    </div>
                </div>
                :<div>
                    {food+drink > choice.length ?
                    <div>
                        <h3>ドリンク選択：</h3>
                        <div className="list_in_setOrders"> 
                            {drinkList.map((item,key)=>(
                                <p key={key} onClick={()=>{getPic(item.ID,item.name)}}>{item.name}</p>
                            ))}
                        </div>
                    </div>
                    :
                    <div className="list_in_setOrders">
                        {drink+food == choice.length && choice.length!=0 ?
                        <Confirm  name={props.name+"：　[　"+choice+"　]"} set={choice} price={props.price} id={props.id} message={props.name}　design="SetOrders_conf" action="かごに追加"　height='50%' closePopup={()=>{props.closePopup()}}/>
                        :
                        "少々お待ちください...."
                        }
                        </div>
                    
                    }
                    </div>
                }
                
                
            </div>
            }
        </div>
    );


}


export default SetOrder;


