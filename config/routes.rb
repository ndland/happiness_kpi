HappinessKpi::Application.routes.draw do
  root to: 'main#index'

  namespace :api do
    resources :emotions
  end
end
