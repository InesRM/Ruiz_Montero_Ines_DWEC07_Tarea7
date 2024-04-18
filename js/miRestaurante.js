import RestaurantApp from './restauranteApp.js';

const historyActions = {
    init: () => {
        RestaurantApp.handleInit();
    },

    removeProductByCategory: (event) => {
        ManagerApp.handleRemoveProductForm();
        ManagerApp.handleRemoveProductListByCategory(event.state.category);
    },

    AsDsMenuByDish: (event) => {
        ManagerApp.handleAsDsMenuForm();
        ManagerApp.handleAsDsMenuListByDish(event.state.dish);
    },

    CategoryList: (event) => RestaurantApp.handleDishesCategoryList(event.state.category),
    AllergenListInMenu: (event) => RestaurantApp.handleDishesAllergenList(event.state.allergen),
    MenuListInMenu: (event) => RestaurantApp.handleDishesMenuList(event.state.menu),
    RestaurantListInMenu: (event) => RestaurantApp.handleRestaurantList(event.state.restaurant),
    showDetailsDishes: (event) => RestaurantApp.handleShowDetailsDishes(event.state.category),
    newCategory: () => ManagerApp.handleNewCategoryForm(),
    removeCategory: () => ManagerApp.handleRemoveCategoryForm(),
    newProduct: () => ManagerApp.handleNewProductForm(),
    removeProduct: () => ManagerApp.handleRemoveProductForm(),
    newRestaurant: () => ManagerApp.handleNewRestaurantForm(),
    AsDsMenu: () => ManagerApp.handleAsDsMenuForm(),
    login: () => ManagerApp.handleLoginForm()
};

window.addEventListener('popstate', (event) => {
    if (event.state) {
        console.log(event)
        historyActions[event.state.action](event);
    }
});



history.replaceState({ action: 'init' }, null);

