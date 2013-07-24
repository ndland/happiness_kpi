HappinessKpi::Application.routes.draw do
  root to: 'main#index'

  resources :reports

  namespace :api do
    resources :emotions
  end
end
