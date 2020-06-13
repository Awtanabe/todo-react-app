import React from "react"
import TodoList from './TodoList'

class TodoLists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todolists: [],
      inputs: {id: null,title: '', description: '',auto_done: false},
      errors: {
        title: "",
        description: ""
      },
      selectedValue: false,
      ediable: {}
    }
  }

  componentDidMount(){
    fetch('/todos/get_todos', {
      method: 'GET'
    }).then((res) => res.json())
    .then((data) => { this.setState({todolists: data.todos})
    })
  }

  handleChangeInputs(e) {
    const ediable = Object.assign({}, this.state.inputs, {[e.target.name]: e.target.value})
    this.setState({inputs: ediable})
  }

  handleChangeEditInputs(e){
    const ediable = Object.assign({}, this.state.ediable, {[e.target.name]: e.target.value})
    this.setState({ediable: ediable})

  }

  handleSelect() {
    this.setState({selectedValue: !this.state.selectedValue})
  }

  handleSave() {
    const errorResult = this.validateInputs(this.state.inputs)
  
    if (errorResult.title == "titleにエラーあり" ||  errorResult.description == "descriptionにエラーあり" ) {return}
   
    const formData = new FormData();
    formData.append('title', this.state.inputs.title)
    formData.append('description', this.state.inputs.description)
    formData.append('auto_done', this.state.inputs.auto_done)

    fetch('/todos',{
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then((res) => console.log("aa"))

    this.state.inputs.id = this.state.todolists[this.state.todolists.length - 1].id + 1
  
    const newTodo = [...this.state.todolists, this.state.inputs]

    this.setState({todolists: newTodo,inputs: {id: null, title: '', description: '',auto_done: false },errors: errorResult })
  }

  handleUpdate(todo) {
    const formData = new FormData();
    formData.append('title', this.state.ediable.title)
    formData.append('description', this.state.ediable.description)
    formData.append('auto_done', this.state.ediable.auto_done)
    fetch(`/todos/${todo.id}`,{
      method: 'PATCH',
      credentials: 'include',
      body: formData
    }).then((res) => console.log(res.status))

    var re = Object.assign([], this.state.todolists)

    var target = re.find((r)=> r.id == todo.id)
    target.title = todo.title

    this.setState({todolists: re})

    this.clearEdiable()
  }

  handleDelete(todo) {
    fetch(`/todos/${todo.id}`, {
      method: 'DELETE',
      credentials: 'include'
    }).then((res) => console.log(res.status))

    var re = Object.assign([], this.state.todolists)

    var target = re.filter((r)=> r.id !== todo.id)
    target

    this.setState({todolists: target})

    this.clearEdiable()
  }

  ShowTodo(todo) {
    return (
      <li>
      todo: {todo.title} <button onClick={()=> this.toggleEdiable(todo)}>編集</button>
                        <button onClick={()=> this.handleDelete(todo)}>削除</button>
      </li>
    )

  }
  showEditTodo(ediable){
    const {selectedValue} = this.state
    const selectStatus = selectedValue ? 'checked' : ''
    console.log(ediable)
    return(
      <li>
        <div className="col-sm-8 aligin-center">
              編集<button onClick={() => this.clearEdiable()}>戻す</button>
　            <div className="form-group">
                <label>
                   タイトル
                  <input type="text" name="title" value={ediable.title} className="form-control" onChange={(e) => this.handleChangeEditInputs(e)}/>
                </label>
              </div>
              <div className="form-group">
                <label>
                description
                  <input type="text" name="description" value={ediable.description} className="form-control" onChange={(e) => this.handleChangeEditInputs(e)}/>
                </label>
              </div>
              <div className="form-group">
                <label>
                  自動フラグ
                  <input name="auto_done" type="checkbox" checked={selectStatus} className="form-control" onChange={() => this.handleSelect()}/>
                </label>
              </div>
              <button className="btn btn-primary" onClick={() => this.handleUpdate(ediable)}>送信</button>
           </div>
      </li>
    )
  }

  toggleEdiable(todo) {
    this.setState({ediable: todo})
  }

  clearEdiable() {
    this.setState({ediable: {}})
  }

  validateInputs(inputs) {

     const errors = Object.assign([], this.state.errors)

     errors.title = ""
     errors.description = ""
     debugger
     if (inputs.title == "" ){ 
        errors.title = "titleにエラーあり"
     }
     if (inputs.description == "" ){ 
       errors.description = "descriptionにエラーあり"
    }

    if ( errors.title == "titleにエラーあり" || errors.description == "descriptionにエラーあり" ){
      this.setState({errors})
      return errors
    }  
    return errors
  }

  render () {
    const {inputs, selectedValue, todolists, ediable, errors} = this.state
    const selectStatus = selectedValue ? 'checked' : ''
    console.log(inputs.title)
    
    return (
      <div className="container">
        <div className="row text-center">
          <h3>Todo</h3>
        </div>
        <div className="row">
　         <div className="col-sm-8 aligin-center">
　            <div className="form-group">
                <label>
                   タイトル
                  <input type="text" name="title" value={inputs.title} className="form-control" onChange={(e) => this.handleChangeInputs(e)}/>
                  <span className="error-message">{errors.title}</span>
                </label>
              </div>
              <div className="form-group">
                <label>
                description
                  <input type="text" name="description" value={inputs.description} className="form-control" onChange={(e) => this.handleChangeInputs(e)}/>
                  <span className="error-message">{errors.description}</span>
                </label>
              </div>
              <div className="form-group">
                <label>
                  自動フラグ
                  <input name="auto_done" type="checkbox" checked={selectStatus} className="form-control" onChange={() => this.handleSelect()}/>
                </label>
              </div>
              <button className="btn btn-primary" onClick={() => this.handleSave()}>送信</button>
           </div>
        </div>
        <div className="row">
          <div className="col-sm-8 aligin-center">
            <ul>
              {todolists.map((todo) => 
                todo.id == ediable.id
                  ? this.showEditTodo(ediable)
                  : this.ShowTodo(todo)
                )
              }
            </ul>
          </div>
        </div>

      </div>
    );
  }
}

export default TodoLists
