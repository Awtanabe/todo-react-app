class TodosController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
  end

  def todos
    @todos = Todo.all

    render json: {todos:  @todos}
  end

  def create
    todo = Todo.new(todo_params)

    if todo.save
      render json: { status: 'SUCCESS' }
    else
      render json: { status: 'nooo' }
    end
  end

  def update
    todo = Todo.find(params[:id])
    
    todo.update(todo_params)
    render json: { status: 'success' }
  end

  def destroy
    todo = Todo.find(params[:id])
    todo.destroy
  end

  private

  def todo_params
    params.permit(:title, :description, :auto_done)
  end
end
