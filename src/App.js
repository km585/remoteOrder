import React from 'react';
import './App.css';
import Food from './Food';
import Drink from './Drink';
import Edit from './Edit';
import Content from './Content';
import Nav from './Nav.js';
import Description from './Description';
import Orders from './Orders';
import {connect}from 'react-redux';
import "firebase/firestore";
import firebase from "firebase";
import Queue from './Queue';


class App extends React.Component {

  
  constructor(props){
    super(props);
    this.shopID=props.shopID;

    this.state={
      isFood:true,
      isDrink:false,
      isEdit:false,
      isOrders:false,
    
      data:[],
      user:null,
      lastID:0
    }
   
  }

  

  foodMode(){
    this.setState({isFood:true});
    this.setState({isDrink:false});
    this.setState({isEdit:false});
    this.setState({isOrders:false});
  }

  drinkMode(){
    this.setState({isFood:false});
    this.setState({isDrink:true});
    this.setState({isEdit:false});
    this.setState({isOrders:false});
  }

  editMode(){
    this.setState({isEdit:true});
    this.setState({isFood:false});
    this.setState({isDrink:false});
    this.setState({isOrders:false});
  }

  OrdersMode(){
    this.setState({isEdit:false});
    this.setState({isFood:false});
    this.setState({isDrink:false});
    this.setState({isOrders:true});
  }

  
  initializeDatabase(){
    let ref = firebase.firestore()
    .collection("owners").doc(this.shopID)
    .collection("Info");
    
    ref.doc("open_hours").get().then((doc)=>{
      if (doc.exists){
        return ;
      }else{
        ref.doc("open_hours").set({
      Mon:" ",
      Tue:" ",
      Wed:" ",
      Thu:" ",
      Fri:" ",
      Sat:" ",
      Sun:" "
    })
      }
    })

    ref.doc("receipt").get().then((doc)=>{
      if (doc.exists){
        return ;
      }else{
        ref.doc("receipt").set({
          message:""
    })
      }
    })

    

    firebase.firestore()
    .collection("owners").doc(this.shopID)
    .set({initialized:true});

  }





  


  render(){
    this.initializeDatabase();
    

    

    let num=<Food shopID={this.shopID}/>;
    if (this.state.isFood) {
      num=<Food shopID={this.shopID}/>;
    }else if(this.state.isDrink){
      num=<Drink shopID={this.shopID} />;
    }else if(this.state.isEdit){
      num=<Edit shopID={this.shopID} />;
    }else{
      num=<Orders shopID={this.shopID}/>;
    }


    return  <div className="main">
      
      
      
      <Nav navli={["FOOD","DRINK","BASKET"]} dataFood={()=>{this.foodMode();}} dataDrink={()=>{this.drinkMode();}} dataEdit={()=>{this.editMode();}} dataOrders={()=>{this.OrdersMode();}} shopID={this.shopID}/>
      <Description shopID={this.shopID}/>
      <Content item={num}/>
      <Queue shopID={this.shopID}/>


    </div>
    
  }

}

App= connect()(App);


export default App;
