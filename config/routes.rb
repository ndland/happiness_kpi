HappinessKpi::Application.routes.draw do
  root to: 'main#index'

  resources :reports

  namespace :api do
    resources :emotions
    resources :last_week
  end
end
