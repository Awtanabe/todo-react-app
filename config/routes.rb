Rails.application.routes.draw do
  get 'todos/index'
  root 'todos#index'
  resources :todos, only: %w[index create update] do
    collection do
      get '/get_todos', to: 'todos#todos'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
