import {
  Category,
  Allergen,
  Menu,
  Coordinate,
  Dish,
  Restaurant,
} from "./restaurante.js";
import { getCookie } from "./util.js";

const MODEL = Symbol("restaurant");
const VIEW = Symbol("restaurantView");
const AUTH = Symbol("AUTH");
const USER = Symbol("USER");
const LOAD_RESTAURANT = Symbol("Load Manager Objects");

class RestaurantController {
  constructor(model, view, auth) {
    this[MODEL] = model;
    this[VIEW] = view;
    this[AUTH] = auth;
    this[USER] = null;
    this.onLoad();

    this.onInit();
    this[VIEW].bindInit(this.handleInit);
  }

  [LOAD_RESTAURANT]() {
    // Creamos las instancias de las clases que vamos a utilizar y los ejemplos a falta de base de datos

    // Creamos los 4 platos de Hamburguesas
    let pollo = new Dish(
      "Pollo",
      "Hamburguesas de pollo",
      ["Pollo", " Lechuga", " Tomate"],
      "Imagenes/Pollo.jpg"
    );

    let ternera = new Dish(
      "Ternera",
      "Hamburguesa de ternera",
      ["Ternera", " Tomate", " Lechuga"],
      "Imagenes/Ternera.jpg"
    );

    let vegetariana = new Dish(
      "Vegetariana",
      "Hamburguesa vegetal",
      ["Vegetales", " Tomate", " Lechuga"],
      "Imagenes/Vegetariana.jpg"
    );

    let barbacoa = new Dish(
      "Barbacoa",
      "Hamburguesa barbacoa",
      ["Salsa Barbacoa ", " Tomate", " Lechuga"],
      "Imagenes/Barbacoa.jpg"
    );

    // Creamos los 4 platos de Postres
    let chocolate = new Dish(
      "Chocolate",
      "Tarta de Chocolate",
      ["Cacao", "Salsa", "Nata", "Galleta"],
      "Imagenes/Chocolate.jpg"
    );

    let helado = new Dish(
      "Helado",
      "Helados caseros de frutas",
      ["Helado", "Salsa", "Galleta", "Frutas"],
      "Imagenes/Helado.jpg"
    );

    let fruta = new Dish(
      "Fruta",
      "Frutas frescas de temporada",
      ["Arándanos", "Fresas", "Moras"],
      "Imagenes/Fruta.jpg"
    );

    let tiramisu = new Dish(
      "Tiramisu",
      "Pastel de Tiramisu",
      ["Tiramisu", "Salsa", "Nata", "Galleta"],
      "Imagenes/Tiramisu.jpg"
    );

    // Creamos los 4 platos de ensaladas
    let cesar = new Dish(
      "Cesar",
      "Ensalada cesar",
      ["Lechuga", "Pollo", "Salsa", "Tomate"],
      "Imagenes/Cesar.jpg"
    );

    let pasta = new Dish(
      "Pasta",
      "Ensalada de pasta",
      ["Pasta", "Salsa", "Tomate", "Lechuga"],
      "Imagenes/Pasta.jpg"
    );

    let vegetal = new Dish(
      "Vegana",
      "Ensalada vegetal",
      ["Vegetales", "Salsa", "Tomate", "Lechuga"],
      "Imagenes/Vegana.jpg"
    );

    let pescado = new Dish(
      "Pescado",
      "Ensalada de pescado",
      ["Pescado de temporada", "Tomate", "Lechuga"],
      "Imagenes/Pescado.jpg"
    );

    // Crear un objeto de la clase Category
    let ensaladas = new Category(
      "Ensaladas",
      "Frescas y variadas ensaladas y entrantes"
    );
    let hamburguesas = new Category(
      "Hamburguesas",
      "Hamburguesas de pollo, ternera y tofu"
    );
    let postres = new Category("Postres", "Postres caseros y variados");

    // Crear un objeto de la clase Allergen
    let gluten = new Allergen("Gluten", "Las hamburguesas contiene gluten");
    let lactosa = new Allergen("Lactosa", "La salsa contiene leche");
    let frutosSecos = new Allergen(
      "Frutos Secos",
      "La brochetas contiene trazas de frutos secos"
    );
    let fructosa = new Allergen(
      "Fructosa",
      "La salsa puede contener trazas de fructosa"
    );

    // Crear un objeto de la clase Menu
    let menuVegetariano = new Menu(
      "Menu Vegetariano",
      "Menu diario del restaurante"
    );
    let menuContinental = new Menu(
      "Menu Continental",
      "Menu de platos internacionales"
    );
    let menuPollo = new Menu("Menu Pollo", "Menu diario del restaurante");

    // Crear un objeto de la clase Coordinate
    let coord1 = new Coordinate(37.7128, -54.006);
    let coord2 = new Coordinate(38.7128, -64.006);
    let coord3 = new Coordinate(39.7128, -84.006);

    // Crear un objeto de la clase Restaurante
    let cocina1 = new Restaurant(
      "Central",
      "Restaurante De Alta Cocina, Especialidad en Pescados",
      coord1
    );
    let cocina2 = new Restaurant(
      "Bistro",
      "Restaurante De Cocina Tradicional Española",
      coord2
    );
    let cocina3 = new Restaurant(
      "Gourmet",
      "Restaurante De Cocina Internacional",
      coord3
    );

    this[MODEL].addRestaurant(cocina1, cocina2, cocina3);

    // Asignamos los platos a las categorías
    this[MODEL].assignCategoryToDish(
      hamburguesas,
      pollo,
      ternera,
      vegetariana,
      barbacoa
    );

    this[MODEL].assignCategoryToDish(ensaladas, pescado, cesar, vegetal, pasta);

    this[MODEL].assignCategoryToDish(
      postres,
      fruta,
      tiramisu,
      helado,
      chocolate
    );

    //Asignamos los platos a los alergenos
    this[MODEL].assignAllergenToDish(
      gluten,
      pollo,
      ternera,
      vegetariana,
      barbacoa
    );
    this[MODEL].assignAllergenToDish(lactosa, chocolate, helado, tiramisu);
    this[MODEL].assignAllergenToDish(frutosSecos, chocolate, tiramisu);
    this[MODEL].assignAllergenToDish(fructosa, helado, fruta);

    // Asignamos los platos a los menus
    this[MODEL].assignMenuToDish(menuVegetariano, vegetariana, vegetal, fruta);
    this[MODEL].assignMenuToDish(menuPollo, pollo, cesar, chocolate);
    this[MODEL].assignMenuToDish(menuContinental, barbacoa, pasta, helado);
  }
  onLoad = () => {
    if (getCookie('accetedCookieMessage') !== 'true') {
      this[VIEW].showCookiesMessage();
  }

  if (getCookie('activeUser')) {
  } else {
      this[VIEW].showIdentificationLink();
      this[VIEW].bindIdentificationLink(this.handleLoginForm);
  }

  const userCookie = getCookie('activeUser');
  if (userCookie) {
      const user = this[AUTH].getUser(userCookie);
      // Asigna el usuario y abre una sesión con ese usuario
      if (user) {
          this[USER] = user;
          this.onOpenSession();
      }
  } else {
      this.onCloseSession();
  }

    this[LOAD_RESTAURANT]();
    this.onAddCategory();
    this.onAddAllergens();
    this.onAddMenus();
    this.onAddRestaurant();
    // this[VIEW].showAdminMenu();
    // this[VIEW].bindAdminMenu(
    //   this.handleNewCategoryForm,
    //   this.handleRemoveCategoryForm,
    //   this.handleNewProductForm,
    //   this.handleRemoveProductForm,
    //   this.handleNewRestaurantForm,
    //   this.handleNewAsMenuForm,
    //   this.handleNewDeassignMenuForm,
    //   this.handleModifyCatForm
    // );

  };

  onOpenSession() {
    this.onInit();
    // ShoppingCartApp.onInit();
    this[VIEW].initHistory();
    this[VIEW].showAuthUserProfile(this[USER]);
    this[VIEW].bindCloseSession(this.handleCloseSession);
    this[VIEW].showAdminMenu();
    this[VIEW].bindAdminMenu(
        this.handleNewCategoryForm,
        this.handleRemoveCategoryForm,
        this.handleNewProductForm,
        this.handleRemoveProductForm,
        this.handleNewRestaurantForm,
        this.handleNewAsMenuForm);
}
// Manejador para cerrar la sesión
handleCloseSession = () => {
  // Realiza determinadas acciones
  this.onCloseSession();
  this.onInit();
  this[VIEW].initHistory();
};

onCloseSession() {
  // Desasigna el usuario
  this[USER] = null;
  // Borra la cookie
  this[VIEW].deleteUserCookie();
  this[VIEW].showIdentificationLink();
  this[VIEW].bindIdentificationLink(this.handleLoginForm);
  // Borra el menú de administración
  this[VIEW].removeAdminMenu();
}

handleLoginForm = () => {
  this[VIEW].showLogin();
  this[VIEW].bindLogin(this.handleLogin);
};

// El argumento remember es para mantener la sesión si el usuario ha clickeado "Recuérdame"
handleLogin = (username, password, remember) => {
  // Lo valida, y si es correcto, tendremos un objeto usuario
  if (this[AUTH].validateUser(username, password)) {
      // Lo guardamos para poder reutilizarlo cuando queramos
      this[USER] = this[AUTH].getUser(username);
      this.onOpenSession();

      if (remember) {
          this[VIEW].setUserCookie(this[USER]);
      }
      // SI no existe, mostramos un mensaje de que el usuario es incorrecto
  } else {
      this[VIEW].showInvalidUserMessage();
  }
};

  onInit = () => {
    this[VIEW].showCategories(this[MODEL].getCategories());
    this[VIEW].showDishes(this[MODEL].getCategories());
    // Categorias
    this[VIEW].bindDishesCategoryList(this.handleDishesCategoryList);
    this[VIEW].bindDishesCategoryListInMenu(this.handleDishesCategoryList);

    // Alergenos
    this[VIEW].bindDishesAllergenListInMenu(this.handleDishesAllergenList);

    // Menus
    this[VIEW].bindDishesMenuListInMenu(this.handleDishesMenuList);

    // Restaurant
    this[VIEW].bindRestaurantListInMenu(this.handleRestaurantList);
  };

  handleInit = () => {
    this.onInit();
  };

  onAddCategory = () => {
    this[VIEW].showCategoriesInMenu(this[MODEL].getCategories());
  };

  onAddAllergens = () => {
    this[VIEW].showAllergensInMenu(this[MODEL].getAllergens());
  };

  onAddMenus = () => {
    this[VIEW].showMenusInMenu(this[MODEL].getMenus());
  };

  onAddRestaurant = () => {
    this[VIEW].showRestaurantsInMenu(this[MODEL].getRestaurants());
  };

  handleDishesCategoryList = (title) => {
    const category = this[MODEL].getCategory(title);
    this[VIEW].listCategories(
      this[MODEL].getCategoryProducts(category),
      category.name
    );
    this[VIEW].bindShowDetailsDishes(this.handleShowDetailsDishes);
    this[VIEW].modifyBreadcrumb("Categorias / " + category.category.name);
  };

  handleDishesAllergenList = (title) => {
    const allergen = this[MODEL].getAllergen(title);
    this[VIEW].listAllergens(
      this[MODEL].getAllergenProducts(allergen),
      allergen.name
    );
    this[VIEW].bindShowDetailsDishes(this.handleShowDetailsDishes);
    this[VIEW].modifyBreadcrumb("Alergenos / " + allergen.allergen.name);
  };

  handleDishesMenuList = (title) => {
    const menu = this[MODEL].getMenu(title);
    this[VIEW].listMenus(this[MODEL].getMenuProducts(menu), menu.name);
    this[VIEW].bindShowDetailsDishes(this.handleShowDetailsDishes);
    this[VIEW].modifyBreadcrumb("Menus / " + menu.menu.name);
  };

  handleRestaurantList = (title) => {
    const restaurant = this[MODEL].getRestaurant(title);
    this[VIEW].listRestaurant(
      this[MODEL].getRestaurantsDetails(restaurant),
      restaurant.name
    );
    this[VIEW].modifyBreadcrumb("Restaurantes / " + restaurant.name);
  };

  handleShowDetailsDishes = (name) => {
    try {
      let dish = this[MODEL].getDish(name);

      this[VIEW].showDetailsDishes(dish);

      // this[VIEW].bindShowProductInNewWindow(this.handleShowProductInNewWindow);
    } catch (error) {
      this[VIEW].showDetailsDishes(
        null,
        "No existe este producto en la página."
      );
    }
  };

  handleNewCategoryForm = () => {
    this[VIEW].showNewCategoryForm();
    this[VIEW].bindNewCategoryForm(this.handleCreateCategory);
    this[VIEW].modifyBreadcrumb("Gestor / Nueva-Categoria");
  };

  handleCreateCategory = (title, url, desc) => {
    const cat = this[MODEL].getCategorie(title);
    cat.description = desc;
    let done;
    let error;
    try {
      this[MODEL].addCategory(cat);
      this.onAddCategory();
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showNewCategoryModal(done, cat, error);
  };

  handleRemoveCategoryForm = () => {
    this[VIEW].showRemoveCategoryForm(this[MODEL].getCategories());
    this[VIEW].bindRemoveCategoryForm(this.handleRemoveCategory);
    this[VIEW].modifyBreadcrumb("Gestor / Eliminar-Categoria");
  };

  handleRemoveCategory = (title) => {
    let done;
    let error;
    let cat;
    try {
      cat = this[MODEL].getCategory(title);
      this[MODEL].removeCategory(cat);
      done = true;
      this.onAddCategory();
      this.handleRemoveCategoryForm();
    } catch (exception) {
      done = false;
      error = exception;
    }
    this[VIEW].showRemoveCategoryModal(done, cat, error);
  };

  handleNewProductForm = () => {
    this[VIEW].showNewProductForm(
      this[MODEL].getCategories(),
      this[MODEL].getAllergens()
    );
    this[VIEW].bindNewProductForm(this.handleCreateProduct);
    this[VIEW].modifyBreadcrumb("Gestor / Nuevo-Producto");
  };

  handleCreateProduct = (
    name,
    description,
    ingredients,
    image,
    categories,
    allergens
  ) => {
    let done;
    let error;
    let dish;

    try {
      dish = this[MODEL].getDishNT(name);
      dish.description = description;
      dish.ingredients = ingredients;
      dish.image = image;
      this[MODEL].addDish(dish);
      categories.forEach((title) => {
        const category = this[MODEL].getCategory(title);
        this[MODEL].assignCategoryToDish(category.category, dish);
      });
      allergens.forEach((title) => {
        const allergen = this[MODEL].getAllergen(title);
        this[MODEL].assignAllergenToDish(allergen.allergen, dish);
      });
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showNewProductModal(done, dish, error);
  };

  handleRemoveProductListByCategory = (title) => {
    console.log(title);
    const cat = this[MODEL].getCategory(title);
    console.log(cat);
    this[VIEW].showRemoveProductList(this[MODEL].getCategoryProducts(cat));
    this[VIEW].bindRemoveProduct(this.handleRemoveProduct);
  };

  handleRemoveProductForm = () => {
    this[VIEW].showRemoveProductForm(this[MODEL].getCategories());
    this[VIEW].bindRemoveProductSelects(this.handleRemoveProductListByCategory);
    this[VIEW].modifyBreadcrumb("Gestor / Eliminar-Producto");
  };

  handleRemoveProduct = (serial) => {
    let done;
    let error;
    let product;
    try {
      console.log(serial);
      product = this[MODEL].getDish(serial);
      console.log(product);
      this[MODEL].removeDish(product);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showRemoveProductModal(done, product, error);
  };

  // Invocación de los metodos de vista de nuevos restaurantes
  handleNewRestaurantForm = () => {
    this[VIEW].showNewRestaurantForm(this[MODEL].categories);
    this[VIEW].bindNewRestaurantForm(this.handleCreateRestaurant);
    this[VIEW].modifyBreadcrumb("Gestor / Nuevo-Restaurante");
  };

  // Handle de creacion del restaurante en el modelo
  handleCreateRestaurant = (name, location, description) => {
    let done;
    let error;
    let restaurant;

    try {
      restaurant = this[MODEL].getRestaurantCr(name);
      restaurant.location = location;
      restaurant.description = description;
      this[MODEL].addRestaurant(restaurant);
      this.onAddRestaurant();
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showNewRestaurantModal(done, restaurant, error);
  };

  handleNewAsMenuForm = () => {
    this[VIEW].showAsMenuForm(this[MODEL].getMenus(), this[MODEL].getDishes());
    this[VIEW].bindNewAsDsMenuForm(this.handleAsignMenu);
    this[VIEW].modifyBreadcrumb("Gestor / Asignar-Platos-Menu");
  };

  handleAsignMenu = (menu, dish) => {
    let done;
    let error;
    let menuName = this[MODEL].getMenu(menu);
    let menuDescription;
    let dishName = this[MODEL].getDish(dish);
    let description;
    let ingredients;
    let image;
    console.log(menu);
    console.log(dish);
    try {
      console.log(menuName);
      console.log(dishName);
      menuDescription = menuName.description;
      description = dishName.description;
      ingredients = dishName.ingredients;
      image = dishName.image;
      menu = this[MODEL].getMenu(menu);
      dish = this[MODEL].getDish(dish);

      this[MODEL].assignMenuToDish(menu.menu, dish);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showNewAsMenuModal(done, menu, dish, error);
  };

  handleNewDeassignMenuForm = () => {
    this[VIEW].showRemoveDishMenuForm(
      this[MODEL].getMenus(),
      this[MODEL].getDishes()
    );
    this[VIEW].bindRemoveDishMenuForm(this.hanleDeassignMenu);
    this[VIEW].modifyBreadcrumb("Gestor / Desasignar-Platos-Menu");
  };

  hanleDeassignMenu = (menu, dish) => {
    let done;
    let error;
    let menuName = this[MODEL].getMenu(menu);
    let menuDescription;
    let dishName = this[MODEL].getDish(dish);
    let description;
    let ingredients;
    let image;
    console.log(menu);
    console.log(dish);
    try {
      console.log(menuName);
      console.log(dishName);
      menuDescription = menuName.description;
      description = dishName.description;
      ingredients = dishName.ingredients;
      image = dishName.image;
      menu = this[MODEL].getMenu(menu);
      dish = this[MODEL].getDish(dish);

      this[MODEL].deassignMenuToDish(menu.menu, dish);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showRemoveDishMenuModal(done, menu, dish, error);
  };

  handleModifyCatForm = () => {
    this[VIEW].showModifyCatForm(
      this[MODEL].getCategories(),
      this[MODEL].getDishes()
    );
    this[VIEW].bindModifyCatForm(this.handleModifyCat);
    this[VIEW].modifyBreadcrumb("Gestor / Modificar-Categoria");
  };

  handleModifyCat = (category, dish) => {
    let done;
    let error;
    let categoryName = this[MODEL].getCategory(category);
    let categoryDescription;
    let catImage;
    let dishName = this[MODEL].getDish(dish);
    let description;
    let ingredients;
    let image;
    console.log(category);
    console.log(dish);

    try {
      console.log(categoryName);
      console.log(dishName);
      categoryDescription = categoryName.description;
      description = dishName.description;
      ingredients = dishName.ingredients;
      catImage = categoryName.image;
      image = dishName.image;

      category = this[MODEL].getCategory(category);
      dish = this[MODEL].getDish(dish);
      this[MODEL].assignCategoryToDish(category.category, dish);
      done = true;
    } catch (exception) {
      done = false;
      error = exception;
    }

    this[VIEW].showModifyCatModal(done, category, dish, error);
  };
}

export default RestaurantController;
