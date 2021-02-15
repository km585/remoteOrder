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
    let db = firebase.database();
    let ref = db.ref(this.shopID+'/Info/opening_hours');
    ref.once("value",snapshot => {
        if (snapshot.exists()){
            return;
        }else{
            ref.set({
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

    return  <div>
      <div id="title">
        <h1>Smart Order</h1>
        
        
      </div>
      
      
      <Nav navli={["FOOD","DRINK","BASKET"]} dataFood={()=>{this.foodMode();}} dataDrink={()=>{this.drinkMode();}} dataEdit={()=>{this.editMode();}} dataOrders={()=>{this.OrdersMode();}} shopID={this.shopID}/>
      <Description shopID={this.shopID}/>
      <Content item={num}/>
  
    </div>
    
  }

}

App= connect()(App);


export default App;
