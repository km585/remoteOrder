import React, {useState,useEffect} from 'react';
import { useSelector} from "react-redux";
import firebase from "firebase";
import "firebase/firestore";

const Description = (props) => {
    const [shopName,setShopName] = useState();
    const account = useSelector((state) => state.AccountReducer.isSignedIn);
    const shopID = props.shopID;
    const [hours,setHours] = useState([]);

    const conStyle={
        border:"2px solid black",
        marginBottom: "5px",
        textAlign:"center"
      };


     
    

    function changeName(){
        let db =firebase.database();
        var newName = document.getElementById("shopName").value;

        let ref = db.ref(shopID+'/Info/');

        if (newName==""){
            return;
        }else {
            ref.update({
                shop_name:newName
            })
            setShopName(newName);
        }
        var name = document.getElementById("shopName");
        name.value = "";
    }

    function initialName(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Info/shop_name');
        
            ref.on('value',(snapshot) =>{
                if (snapshot.val()==null) {
                    setShopName("NO NAME");
                }else{
                    setShopName(
                  snapshot.val()
                );
                }
                
              });
        
    }

    function initialTime(){
        let db =firebase.database();
        let ref = db.ref(shopID+'/Info/opening_hours');
        ref.orderByKey()
        .on('value',(snapshot) =>{
            
            setHours(
                snapshot.val()
            );
            
        });
    }


  

    function changeHours(day){
        var new_hour = document.getElementById(day).value
        if (new_hour==""){
            return;
        }
        let db =firebase.database();
        let ref = db.ref(shopID+'/Info/opening_hours');
        if (day=="Mon"){
            ref.update({
                Mon:new_hour
            });
        }else if (day =="Tue"){
            ref.update({
                Tue:new_hour
            });
        }else if (day =="Wed"){
            ref.update({
                Wed:new_hour
            });
        }else if (day =="Thu"){
            ref.update({
                Thu:new_hour
            });
        }else if (day =="Fri"){
            ref.update({
                Fri:new_hour
            });
        }else if (day =="Sat"){
            ref.update({
                Sat:new_hour
            });
        }else if (day =="Sun"){
            ref.update({
                Sun:new_hour
            });
        }else{
            return;
        }
        let em = document.getElementById(day);
        em.value = "";
        
        
    }



    if (shopName == null ){
        initialName();
    }
    if (hours != null){
        
        if (hours.length == 0){
            initialTime();
        }
    }
    
   

    return (
        <div >
        {account?
        <div className="description"　>
            <h2>
                <input type="text" id="shopName" placeholder={shopName} />
                <button onClick={()=>{changeName();}}>変更</button>
            </h2>
            
            {hours!=null ?
            <div className="hours">
            <p>Open hours:</p>
            <p><a>MON : <input type="text" id="Mon" placeholder={hours.Mon}/><button　onClick={()=>{changeHours("Mon");}}>変更</button>, </a>
            <a>TUE : <input type="text" id="Tue" placeholder={hours.Tue}/><button onClick={()=>{changeHours("Tue")}}>変更</button></a></p>
            <p><a>WED : <input type="text" id="Wed" placeholder={hours.Wed}/><button onClick={()=>{changeHours("Wed")}}>変更</button>, </a>
            <a>THU : <input type="text" id="Thu" placeholder={hours.Thu}/><button onClick={()=>{changeHours("Thu")}}>変更</button></a></p>
            <p><a>FRI : <input type="text" id="Fri" placeholder={hours.Fri}/><button onClick={()=>{changeHours("Fri")}}>変更</button>, </a>
            <a>SAT : <input type="text" id="Sat" placeholder={hours.Sat}/><button onClick={()=>{changeHours("Sat")}}>変更</button>, </a>
            <a>SUN : <input type="text" id="Sun" placeholder={hours.Sun}/><button onClick={()=>{changeHours("Sun")}}>変更</button>, </a></p>
            </div>
            :
            null
            }
            
            
        </div>
        :
        <div className="description"　>
            <h2>{shopName}</h2>
            <div className="hours">
            <p>Open hours:</p>
            <p><a id="day">MON: {hours.Mon},</a>  <a id="day">TUE: {hours.Tue}</a> </p>
            <p><a id="day">WED : {hours.Wed},</a> <a id="day">THU: {hours.Thu}</a> </p>
            <p><a id="day">FRI : {hours.Fri},</a> <a id="day">SAT: {hours.Sat},</a>  <a id="day">SUN : {hours.Sun}</a></p>
            
            </div>
            
        </div>
        }
      </div>  
        
    );

} 

export default Description;

