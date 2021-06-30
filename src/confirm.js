import React, {Component} from 'react';
import {connect}from 'react-redux';

class Confirm extends Component {
    constructor(props){
        super(props);
        this.name = props.name;
        this.price = props.price;
        this.id=props.id;
        this.quantity= 1;
        this.message = props.message;
        this.action = props.action;
        this.warning = props.warning;
        this.today = new Date();
        this.state={
            message:this.message,
            action: this.action,
            added: false,
            ordered:false
        }
        this.doAction = this.doAction.bind(this);
        this.doChange = this.doChange.bind(this);
    }

    conDes={
        position: 'relative',
        minHeight: '200px',
        height:'30%',
        width: '30%',
        top: '35%',
        margin: 'auto',
        background: 'white',
        textAlign: 'center',
        zIndex: '20',
        border: '1.5px solid black',
        padding:0,
        borderRadius:'5vh',
        
       
    }

    doChange(){
        if (this.state.added==false){
            this.setState({message:"買い物かごに追加しました！"});
            this.setState({action:null})
            this.setState({added:true});
        }else{
            this.setState({message:"キャンセルしました。"});
            this.setState({action:"追加"})
            this.setState({added:false});
        }
        
    }

    doAction(e){
        if (this.props.order != null){
            this.props.order();
        }else if (this.state.added==false){
            this.props.dispatch({
                type:'ADD_TO_CART', 
                payload:{id:this.id, name:this.name,price:this.price,num:0}
            });
            this.doChange();
        }else{
            this.props.dispatch({
                type:'CANCEL', 
                payload:{id:this.id}
            });
            this.doChange();
        }
        
    }

    addOne(){
        this.props.dispatch({
            type:'ADD_ONE', 
            payload:{id:this.id, name:this.name,price:this.price,quantity:this.quantity}
        })
    }

    show(list){
        return (
          <ul>
            {list.map((item)=>
            <div>
              {item}
            </div>
            )}
          </ul>
        )
      }
  
    

    render (){
        return (
            <div className='conf'  >
                <div className={this.props.design!=null?　this.props.design:"basket_conf"}   id="conf">
                {this.props.closePopup?
                <div id="back_button">
                    <i onClick={this.props.closePopup} className="far fa-times-circle"></i>
                </div>
                :
                null}
                    
                    {this.props.pic ?
         
                    <img src={this.props.pic}id="conf_pic" />
                    
                    :
                    null
                    }

                    
                    <div className={this.props.design=="logout_conf" ? "logout_msg":"msg"}>
                        {this.state.message}
                        
                    </div>
                    {this.props.orderInfo ?
                        <div >
                        <a>{this.today.getFullYear() + "/"+ this.today.getMonth() + "/" + this.today.getDate()}<br /></a>
                        <a>注文番号:{this.props.orderInfo[0]}, </a>
                        
                        <a>合計金額:{this.props.orderInfo[1]}</a>
                        </div>
                        :
                        <div></div>
                        }

                    <div className="conf_button">
                        <div >
                        {this.state.action ?
                        <button className="btn-flat-border"　onClick={this.doAction} id="conf_button2">{this.state.action}</button>
                        :<div></div>
                        }
                         </div>
                    </div>

                    {this.warning?
                    <div className="conf_warn">
                        <a id="conf_warning_a">{this.warning}</a>
                        </div>
                    :null
                    }
                    
                    
                </div >
                
            </div>
        )
    }
}

Confirm = connect()(Confirm);

export default Confirm;

