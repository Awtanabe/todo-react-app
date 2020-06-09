import React from "react"

class TodoLists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      todolists: [],
      inputs: {title: '', description: '',auto_done: false},
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
    const formData = new FormData();
    formData.append('title', this.state.inputs.title)
    formData.append('description', this.state.inputs.description)
    formData.append('auto_done', this.state.inputs.auto_done)

    fetch('/todos',{
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then((res) => console.log("aa"))
    
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

  ShowTodo(todo) {
    return (
      <li>
      todo: {todo.title} <button onClick={()=> this.toggleEdiable(todo)}>編集</button>
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

  render () {
    const {inputs, selectedValue, todolists, ediable} = this.state
    const selectStatus = selectedValue ? 'checked' : ''
  
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
                </label>
              </div>
              <div className="form-group">
                <label>
                description
                  <input type="text" name="description" value={inputs.description} className="form-control" onChange={(e) => this.handleChangeInputs(e)}/>
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
