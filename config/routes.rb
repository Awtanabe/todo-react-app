Rails.application.routes.draw do
  root 'todos#index'
  resources :todos, only: %w[index create update destroy] do
    collection do
      get '/get_todos', to: 'todos#todos'
    end
  end
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
