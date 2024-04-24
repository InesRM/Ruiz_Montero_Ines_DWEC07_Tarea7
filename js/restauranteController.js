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
const DISHES = Symbol("DISHES");
const LOAD_RESTAURANT_OBJECTS = Symbol("Load Manager Objects");

class RestaurantController {
  constructor(model, view, auth) {
    this[MODEL] = model;
    this[VIEW] = view;
    this[AUTH] = auth;
    this[USER] = null;
    this[DISHES] = [];
    this.onLoad();

  }

  [LOAD_RESTAURANT_OBJECTS](data) {
    const categories = data.categories;
    const allergens = data.allergens;
    const menus = data.menus;
    const restaurants = data.restaurants;
    const dishes = data.dishes;

    for (const category of categories) {
      const cat = new Category(category.name, category.description);
      cat.image = category.image;
      this[MODEL].addCategory(cat);
    }
    for (const allergen of allergens) {
      const al = new Allergen(allergen.name, allergen.description);
      this[MODEL].addAllergen(al);
    }
    for (const menu of menus) {
      const me = new Menu(menu.name, menu.description);
      this[MODEL].addMenu(me);
    }

    for (const restaurant of restaurants) {
      const res = new Restaurant(
        restaurant.name,
        new Coordinate(
          restaurant.location.latitude,
          restaurant.location.longitude
        ),
        restaurant.description
      );
      this[MODEL].addRestaurant(res);
    }

    for (const dish of dishes) {
      const di = new Dish(
        dish.name,
        dish.description,
        dish.ingredients,
        dish.image
      );
      this[MODEL].addDish(di);
      //allergens
      const allergens = dish.allergens;
      for (const allergen of allergens) {
        const al = this[MODEL].getAllergen(allergen);
        this[MODEL].assignAllergenToDish(al.allergen, di);
      }
      //categories
      const categories = dish.categories;
      const dishObject = this[MODEL].getDish(di.name);
      for (const category of categories) {
        const cat = this[MODEL].getCategory(category);
        this[MODEL].assignCategoryToDish(cat.category, dishObject);
      }
      //menus
      const menus = dish.menus;
      for (const menu of menus) {
        const me = this[MODEL].getMenu(menu);
        this[MODEL].assignMenuToDish(me.menu, dishObject);
      }
    }
  }
  onLoad = () => {
    fetch("./js/datos.json", {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        this[LOAD_RESTAURANT_OBJECTS](data);
      })
      .then(() => {
        this.onAddCategory();
        this.onAddAllergens();
        this.onAddMenus();
        this.onAddRestaurant();

        if (getCookie("accetedCookieMessage") !== "true") {
          this[VIEW].showCookiesMessage();
        }

        if (getCookie("activeUser")) {
        } else {
          this[VIEW].showIdentificationLink();
          this[VIEW].bindIdentificationLink(this.handleLoginForm);
        }

        const userCookie = getCookie("activeUser");
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
        this.onInit();
        this[VIEW].bindInit(this.handleInit);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    const favDishes = JSON.parse(this[VIEW].getDishes());
    if (favDishes) {
      this[DISHES] = favDishes;
    }
  };

  onOpenSession() {
    this.onInit();
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
      this.handleNewAsMenuForm,
      this.handleNewDeassignMenuForm,
      this.handleModifyCatForm,
      this.handleNewBackup
    );
    this[VIEW].showDishesMenu();
    this[VIEW].bindDishesMenu(this.handleShowDishes, this.handleShowFavDishes);
  }
  // Manejador para cerrar la sesión
  handleCloseSession = () => {
    // Realiza determinadas acciones
    this.onCloseSession();
    this.onInit();
    this[VIEW].initHistory();
  };

  onCloseSession() {
    // Borra el usuario
    this[USER] = null;
    // Borra la cookie
    this[VIEW].deleteUserCookie();
    this[VIEW].showIdentificationLink();
    this[VIEW].bindIdentificationLink(this.handleLoginForm);
    // Borra el menú de administración
    this[VIEW].removeAdminMenu();
    this[VIEW].removeDishesMenu();
  }

  handleShowDishes = () => {
    const dishes = this[MODEL].getDishes();
    this[VIEW].showAllDishes(dishes);
    this[VIEW].bindShowAllDishes(this.handleFavDishes);
    
    this[VIEW].modifyBreadcrumb("Platos / Todos los platos");
  };
  handleFavDishes = (dishName) => {
    const index = this[DISHES].findIndex((name) => name === dishName);
    if (index === -1) {
      this[DISHES].push(dishName);
      localStorage.setItem("dishes", JSON.stringify(this[DISHES]));
      this[VIEW].showFavDishModal(true, dishName);
    } else {
      this[VIEW].showFavDishModal(false, dishName);
    }
  };

  handleShowFavDishes = () => {
    const dishes = [];
    for (const dishName of this[DISHES]) {
      const dishCreated = this[MODEL].createDish(dishName);
      dishes.push(dishCreated);
    }
    this[VIEW].showFavDishes(dishes);
    this[VIEW].bindShowAllDishes(this.handleFavDishes);
    //extraer el nombre para poder ir a la vista de detalles
    
    this[VIEW].modifyBreadcrumb("Platos / Platos favoritos");
  };

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
      // Si no existe, mostramos un mensaje de que el usuario es incorrecto
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
  };

  handleInit = () => {
    this.onInit();
  };

  onAddCategory = () => {
    this[VIEW].showCategoriesInMenu(this[MODEL].getCategories());
  };

  onAddAllergens = () => {
    this[VIEW].showAllergensInMenu(this[MODEL].getAllergens());
    // Alergenos
    this[VIEW].bindDishesAllergenListInMenu(this.handleDishesAllergenList);
  };

  onAddMenus = () => {
    this[VIEW].showMenusInMenu(this[MODEL].getMenus());
    // Menus
    this[VIEW].bindDishesMenuListInMenu(this.handleDishesMenuList);
  };

  onAddRestaurant = () => {
    this[VIEW].showRestaurantsInMenu(this[MODEL].getRestaurants());
    // Restaurant
    this[VIEW].bindRestaurantListInMenu(this.handleRestaurantList);
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

  handleNewBackup = () => {
    this[VIEW].showBackup();
    this[VIEW].bindBackup(this.handleBackup);
    this[VIEW].modifyBreadcrumb("Gestor / Backup");
  };

  handleBackup = () => {
    let done;
    let ObjsJson;
    try {
      ObjsJson = this.createObjectsJson();
      console.log(ObjsJson);
      let formData = new FormData();
      let blob = new Blob([ObjsJson], { type: "application/json" });
      let this1 = this;
      formData.append("file", blob);
      fetch("http://localhost/tarea7backup/archivoBack.php", {
        method: "POST",
        body: formData,
      })
        .then(function (response) {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Error en la llamada");
        })
        .then(function (data) {
          console.log(data);
          done = true;
          this1[VIEW].showBackupResult(done, data);
        })
        .catch(function (error) {
          done = false;
          console.log(error);
        });
    } catch (error) {
      done = false;
      console.log(error);
    }
  };

  createObjectsJson = () => {
    let data = {
      categories: [],
      allergens: [],
      menus: [],
      restaurants: [],
      dishes: [],
    };
    const cat = this[MODEL].getCategories();
    for (const category of cat) {
      data.categories.push({
        name: category.category.name,
        description: category.category.description,
        image: category.category.image,
      });
    }
    const al = this[MODEL].getAllergens();
    for (const allergen of al) {
      data.allergens.push({
        name: allergen.allergen.name,
        description: allergen.allergen.description,
      });
    }

    const me = this[MODEL].getMenus();
    for (const menu of me) {
      data.menus.push({
        name: menu.menu.name,
        description: menu.menu.description,
      });
    }

    const res = this[MODEL].getRestaurants();
    for (const restaurant of res) {
      data.restaurants.push({
        name: restaurant.name,
        location: {
          latitude: restaurant.location.latitude,
          longitude: restaurant.location.longitude,
        },
        description: restaurant.description,
      });
    }

    const di = this[MODEL].getDishes();
    for (const dish of di) {
      data.dishes.push({
        name: dish.name,
        description: dish.description,
        ingredients: dish.ingredients,
        image: dish.image,
        allergens: dish.allergens,
        categories: dish.categories,
        menus: dish.menus,
      });
    }

    return JSON.stringify(data);
  };
}

export default RestaurantController;
