import React from "react"

class TodoLists extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      inputs: {title: '', description: '',auto_done: false},
      selectedValue: false
    }
  }

  componentWillMount(){
    fetch('/todos/get_todos', {
      method: 'GET'
    }).then((res) => res.json())
    .then((data) => {console.log( data );
    })
  }

  handleChangeInputs(e, inputs) {
    const ediable = Object.assign({}, this.state.inputs, {[e.target.name]: e.target.value})
    this.setState({inputs: ediable})
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

  render () {
    const {inputs, selectedValue} = this.state
    const selectStatus = selectedValue ? 'checked' : ''
    return (
      <div className="container">
        <div className="row text-center">
          <h3>Todo</h3>
        </div>
        <div className="row">
　         <div className="col-sm-8">
　            <div className="form-group">
                <label>
                   タイトル
                  <input type="text" name="title" value={inputs.title} className="form-control" onChange={(e) => this.handleChangeInputs(e, inputs)}/>
                </label>
              </div>
              <div className="form-group">
                <label>
                  Email
                  <input type="text" name="email" value={inputs.email} className="form-control" onChange={(e) => this.handleChangeInputs(e)}/>
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
          <div className="col-sm-8">
            <ul>
              <li>list1</li>
              <li>list2</li>
              <li>list3</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default TodoLists
