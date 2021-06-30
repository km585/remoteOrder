import React from 'react';

class Content extends React.Component{

    constructor(props){
      super(props);
      this.item=props.item;
  
    }
  
  
    conStyle={
      border:"2px solid black",
      overflow: "hidden"
    }
  
    render(){
  
      return(
        <div className="content" >
          {this.props.item}
        </div>
      )
    }
  }

export default Content;
