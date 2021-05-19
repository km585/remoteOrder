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


  


    function changeName2(){
        
        var newName = document.getElementById("shopName").value;

        let ref = firebase.firestore()
        .collection("owners")
        .doc(shopID)
        .collection("Info").doc("shop_name");

        if (newName==""){
            return;
        }else {
            ref.update({display_name:newName});
            setShopName(newName);
        }
        var name = document.getElementById("shopName");
        name.value = "";
        //console.log("change names...!");
    }


    function initialName2(){
        let ref = firebase.firestore()
        .collection("owners")
        .doc(shopID)
        .collection("Info");
        ref.doc("shop_name").get().then((doc)=>{
            if (doc.exists){
                let name = doc.data();
                setShopName(name.display_name);
            }else{
                ref.doc("shop_name").set({display_name:"NO NAME"});
                setShopName("NO NAME");
            }
        })

    }

    function initialTime2(){
        firebase.firestore()
        .collection("owners").doc(shopID)
        .collection("Info").doc("open_hours")
        .get().then((doc)=>{
            let item = doc.data();
            setHours(item);
        })
    }

 

   function changeHours(day){
    var new_hour = document.getElementById(day).value
    if (new_hour==""){
        return;
    }
    
    let ref = firebase.firestore().collection("owners").doc(shopID)
    .collection("Info").doc("open_hours");
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

  if (hours==null){
   // console.log("initial time2..!");
      initialTime2()
  }
  if(shopName==null){
    initialName2();
    //console.log("initial name2...!");
  }

    useEffect(()=>{
        initialName2();
     //   console.log("ue initialName2...!");
    },[])

    useEffect(()=>{

        initialTime2();
     //   console.log("hours...!");
    },[])
    
    
    
   

    return (
        <div >
        {account?
        <div className="description"　>
            <h2>
                <input type="text" id="shopName" placeholder={shopName} />
                <button onClick={()=>{changeName2();}}>変更</button>
            </h2>
            
            {hours!=null ?
            <div className="hours_in_edit">
            <p>Open hours:</p>
            <p><a>MON : <input type="text" id="Mon" placeholder={hours.Mon}/><button onClick={()=>{changeHours("Mon")}}>変更</button></a></p>
            <p><a>TUE : <input type="text" id="Tue" placeholder={hours.Tue}/><button onClick={()=>{changeHours("Tue")}}>変更</button></a></p>
            <p><a>WED : <input type="text" id="Wed" placeholder={hours.Wed}/><button onClick={()=>{changeHours("Wed")}}>変更</button></a></p>
            <p><a>THU : <input type="text" id="Thu" placeholder={hours.Thu}/><button onClick={()=>{changeHours("Thu")}}>変更</button></a></p>
            <p><a>FRI : <input type="text" id="Fri" placeholder={hours.Fri}/><button onClick={()=>{changeHours("Fri")}}>変更</button></a></p>
            <p><a>SAT : <input type="text" id="Sat" placeholder={hours.Sat}/><button onClick={()=>{changeHours("Sat")}}>変更</button></a></p>
            <p><a>SUN : <input type="text" id="Sun" placeholder={hours.Sun}/><button onClick={()=>{changeHours("Sun")}}>変更</button> </a></p>
            </div>
            :
            null
            }
            
            
        </div>
        :
        <div className="description"　>
            <h3>{shopName}</h3>
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

