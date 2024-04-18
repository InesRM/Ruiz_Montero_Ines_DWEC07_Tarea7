import Restaurant from './restaurante.js';
import RestaurantController from './restauranteController.js';
import RestaurantView from './restauranteView.js';
import AuthenticationService from './authentication.js';
const RestaurantApp = new RestaurantController(Restaurant.getInstance(), new RestaurantView(),
    AuthenticationService.getInstance());

export default RestaurantApp;