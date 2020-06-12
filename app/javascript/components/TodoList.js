import React from "react"

class TodoList extends React.Component {
  constructor(props){
    super(props)
  }

  render(){
    return(
      <div>
      <form ref={ form => console.log(this.addForm  = form) }>
         <input type="text"/>
      </form>
       
      </div>
    )
  }
}

export default TodoList