const EXCECUTE_HANDLER = Symbol("excecuteHandler");
import { Category } from "./restaurante.js";
import {
  newCategoryValidation,
  newProductValidation,
  newRestaurantValidation,
  newAsDsMenuValidation,
  removeDishMenuValidation,
  modifyCatValidation,
} from "./validation.js";
import { setCookie } from "./util.js";

class RestaurantView {
  constructor() {
    this.main = document.getElementsByTagName("main")[0];
    this.categories = document.getElementById("categorias_principal");
    this.menu = document.querySelector(".barra__navegacion");
    this.platos = document.querySelector(".platos");
    this.categorias = document.querySelector(".categories");
    this.migas = document.querySelector(".breadcrumb");
 
  }

  [EXCECUTE_HANDLER](
    handler,
    handlerArguments,
    scrollElement,
    data,
    url,
    event
  ) {
    handler(...handlerArguments);
    const scroll = document.querySelector(scrollElement);
    if (scroll) scroll.scrollIntoView();
    history.pushState(data, null, url);
    event.preventDefault();
  }

  bindInit(handler) {
    document.getElementById("init").addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        handler,
        [],
        "body",
        { action: "init" },
        "#",
        event
      );
    });
    document.getElementById("logo").addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        handler,
        [],
        "body",
        { action: "init" },
        "#",
        event
      );
    });
  }

  showCategories(categories) {
    this.categorias.replaceChildren();
    if (this.categorias.children.length > 1)
      this.categorias.children[1].remove();
    const container = document.createElement("div");
    container.id = "categorylist";
    container.classList.add("category");
    for (const category of categories) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="category__container">
                    <a data-category="${category.category.name}" href="#categorylist">
                        <div class="cat-list-image category__photo"><img alt="${category.category.name}"
                            src="./Imagenes/${category.category.name}.jpg" />
                        </div>
                        <div class="cat-list-text category_info">
                            <h3>${category.category.name}</h3>
                            <p>${category.category.description}</p>
                        </div>
                    </a>
                </div>`
      );
    }
    this.categorias.append(container);
  }

  showCategoriesInMenu(categories) {
    const navCats = document.getElementById("navCats");
    const container = navCats.nextElementSibling;
    container.replaceChildren();
    for (const category of categories) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-category="${category.category.name}" class="dropdown-item" href="#categorylist">${category.category.name}</a></li>`
      );
    }
  }

  showAllergensInMenu(allergens) {
    const div = document.createElement("div");
    div.id = "allergen-list";
    div.classList.add("nav-item");
    div.classList.add("dropdown");
    div.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle"
            href="#allergenlist" id="navAlls" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            Alergenos</a>`
    );
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu");
    for (const allergen of allergens) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div><a data-allergen="${allergen.allergen.name}" 
            class="dropdown-item" href="#allergen">${allergen.allergen.name}</a></div>`
      );
    }
    div.append(container);
    this.menu.append(div);
  }

  showMenusInMenu(menus) {
    const div = document.createElement("div");
    div.id = "menu-list";
    div.classList.add("nav-item");
    div.classList.add("dropdown");
    div.insertAdjacentHTML(
      "beforeend",
      `<a class="nav-link dropdown-toggle"
            href="#menulist" id="navMen" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            Menus</a>`
    );
    const container = document.createElement("ul");
    container.classList.add("dropdown-menu");
    for (const menu of menus) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div><a data-menu="${menu.menu.name}" 
            class="dropdown-item" href="#menu">${menu.menu.name}</a></div>`
      );
    }
    div.append(container);
    this.menu.append(div);
  }

  showRestaurantsInMenu(restaurants) {
    const navRes = document.getElementById("navRes");
    const container = navRes.nextElementSibling;
    container.replaceChildren();
    for (const restaurant of restaurants) {
      container.insertAdjacentHTML(
        "beforeend",
        `<li><a data-restaurant="${restaurant.name}" class="dropdown-item" href="#restaurantlist">${restaurant.name}</a></li>`
      );
    }
  }

  showDishes(dishes) {
    this.platos.replaceChildren();
    if (this.platos.children.length > 1) this.platos.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("category");
    for (const dish of dishes) {
      let aleatorio = Math.floor(Math.random() * dish.dishes.length);
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="category__container">
                <a data-category="${dish.dishes[aleatorio].name}" href="#disheslist">
                <div class="cat-list-image category__photo"><img alt="${dish.dishes[aleatorio].name}"
                src="./Imagenes/${dish.dishes[aleatorio].name}.jpg" />
                </div>
                <div class="cat-list-text category_info">
                <h3>${dish.dishes[aleatorio].name}</h3>
                <p>${dish.dishes[aleatorio].description}</p>
                </div>
                </a>
                </div>`
      );
    }
    this.platos.append(container);
  }

  // Estas son las imagenes del inicio
  bindDishesCategoryList(handler) {
    const categoryList = document.getElementById("categorylist");
    const links = categoryList.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const { category } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [category],
          "#dish-list",
          { action: "CategoryList", category },
          "#categorylist",
          event
        );
      });
    }
  }

  // Este es el desplegable de las categorias
  bindDishesCategoryListInMenu(handler) {
    const navCats = document.getElementById("navCats");
    const links = navCats.nextElementSibling.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const { category } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [category],
          "#dish-list",
          { action: "CategoryList", category },
          "#categorylist",
          event
        );
      });
    }
  }

  // Este es el desplegable de los alergenos
  bindDishesAllergenListInMenu(handler) {
    const navAlls = document.getElementById("navAlls");
    const links = navAlls.nextSibling.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const { allergen } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [allergen],
          "#dish-list",
          { action: "AllergenListInMenu", allergen },
          "#allergenlist",
          event
        );
      });
    }
  }

  bindDishesMenuListInMenu(handler) {
    const navMen = document.getElementById("navMen");
    const links = navMen.nextSibling.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const { menu } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [menu],
          "#dish-list",
          { action: "MenuListInMenu", menu },
          "#menulist",
          event
        );
      });
    }
  }

  bindRestaurantListInMenu(handler) {
    const navRes = document.getElementById("navRes");

    const links = navRes.nextElementSibling.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const { restaurant } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [restaurant],
          "#dish-list",
          { action: "RestaurantListInMenu", restaurant },
          "#restaurantlist",
          event
        );
      });
    }
  }

  bindShowDetailsDishes(handler) {
    const productList = document.getElementById("dish-list");
    const links = productList.querySelectorAll("a");
    for (const link of links) {
      link.addEventListener("click", (event) => {
        const { category } = event.currentTarget.dataset;
        this[EXCECUTE_HANDLER](
          handler,
          [category],
          "#dish-details",
          { action: "showProduct", category },
          "#detailsDish",
          event
        );
      });
    }
  }

  listCategories(categories, title) {
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.id = "dish-list";
    container.classList.add("dishes");

    for (const dish of categories) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="category__container">
                    <a data-category="${dish.name}">
                        <div class="cat-list-image category__photo"><img alt="${dish.name}"
                            src="./Imagenes/${dish.name}.jpg" />
                        </div>
                        <div class="cat-list-text category_info">
                            <h3>${dish.name}</h3>
                            <p>${dish.description}</p>
                        </div>
                    </a>
                </div>`
      );
    }

    this.platos.append(container);
  }

  listAllergens(allergens, title) {
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.id = "dish-list";
    container.classList.add("dishes");

    for (const dish of allergens) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="category__container">
                    <a data-category="${dish.name}">
                        <div class="cat-list-image category__photo"><img alt="${dish.name}"
                            src="./Imagenes/${dish.name}.jpg" />
                        </div>
                        <div class="cat-list-text category_info">
                            <h3>${dish.name}</h3>
                            <p>${dish.description}</p>
                        </div>
                    </a>
                </div>`
      );
    }

    this.platos.append(container);
  }

  listMenus(menus, title) {
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.id = "dish-list";
    container.classList.add("dishes");

    for (const dish of menus) {
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="category__container">
                    <a data-category="${dish.name}">
                        <div class="cat-list-image category__photo"><img alt="${dish.name}"
                            src="./Imagenes/${dish.name}.jpg" />
                        </div>
                        <div class="cat-list-text category_info">
                            <h3>${dish.name}</h3>
                            <p>${dish.description}</p>
                        </div>
                    </a>
                </div>`
      );
    }

    this.platos.append(container);
  }

  listRestaurant(restaurants, name) {
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.id = "dish-list";
    container.classList.add("ficha");

    container.insertAdjacentHTML(
      "beforeend",
      `<div class="rest__container">
        <div class="cat-list-text category_info">
            <h3>${restaurants.name}</h3>
            <p>${restaurants.description}</p>
        </div>   
        <br>   
        <div class="cat-list-text category_info">
        <h1>Puedes encontrarnos en:</h1>
        <h3>${restaurants.location}</h3>
        </div>
        <div class="rest-foto">
                  <img id="res" alt="${restaurants.name}"
                      src="../Imagenes/${restaurants.name}.jpg" />
             </div>
          </div>`
    );

    this.platos.append(container);
  }

  showDetailsDishes(dish, message) {
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("mt-5");
    container.classList.add("mb-5");

    if (dish) {
      container.id = "dish-details";
      container.classList.add(`${dish.name}-style`);
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="row d-flex
        justify-content-center">
                    <div class="col-md-10">
                        <div class="card">
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="images p-3">
                                        <div class="text-center p-4"> <img id="main-image"
                                            src="./Imagenes/${dish.name}.jpg" /> </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="product p-4">
                                        <div class="mt-4 mb-3"><a href="#detailsDish"><span class="text-uppercasebrand">${dish.name}</span></a>
                                            <h5 class="text-uppercase">${dish.description}</h5>
                                            <div class="price d-flex flex-row align-items-center">


                                            </div>
                                        </div>
                                        <h6 class="text-uppercase">Descripcion</h6>
                                        <p class="about">${dish.description}</p>
                                        <div class="sizes mt-5">
                                        <h6 class="text-uppercase">Ingredientes</h6>
                                            <p class="text-uppercase">${dish.ingredients}</p>
                                        </div>
                                        <div class="cart mt-4 align-items-center">
                                            <button id="b-buy" data-category="${dish.name}" class="btn btn-info text-uppercase mr-2 px-4">Añadir A Pedido</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
      );
    } else {
      container.insertAdjacentHTML(
        "beforeend",
        `<div class="row d-flex justify-content-center">
                    ${message}
                </div>`
      );
    }
    this.platos.append(container);
  }

  showAdminMenu() {
    const menuOption = document.createElement("div");
    menuOption.classList.add("nav-item");
    menuOption.classList.add("dropdown");
    menuOption.insertAdjacentHTML(
      "afterbegin",
      `<a class="nav-link dropdown-toggle" href="#" id="navServices" role = "button" data-bs-toggle="dropdown" aria-expanded="false" > GESTOR DEL RESTAURANTE</a > `
    );
    const suboptions = document.createElement("ul");
    suboptions.classList.add("dropdown-menu");
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lnewCategory" class="dropdown-item" href ="#new-category" > Crear categoría</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="ldelCategory" class="dropdown-item" href ="#del-category" > Eliminar categoría</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lnewProduct" class="dropdown-item" href ="#new-product" > Crear producto</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="ldelProduct" class="dropdown-item" href ="#del-product" > Eliminar producto</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lnewRestaurant" class="dropdown-item" href ="#new-restaurant" > Crear restaurante</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lAsMenu" class="dropdown-item" href ="#asds-menu" >Asignar Platos al Menú</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lRemoveMenu" class="dropdown-item" href ="#remove-menu" >Desasignar Platos al Menú</a ></li > `
    );
    suboptions.insertAdjacentHTML(
      "beforeend",
      `<li><a id="lModCat" class="dropdown-item" href ="#mod-cat" >Modificar Categoría</a ></li > `
    );
    menuOption.append(suboptions);
    this.menu.append(menuOption);
  }

  showNewCategoryForm() {
    // Crear categoría
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "new-category";
    container.insertAdjacentHTML(
      "afterbegin",
      `<h1 class="display-5">Nueva categoría</h1>`
    );
    container.insertAdjacentHTML(
      "beforeend",
      `<form name="fNewCategory" role="form" class="row g-3" novalidate>
				<div class="col-md-6 mb-3">
					<label class="form-label" for="ncTitle">Título</label>
					<div class="input-group">
						<span class="input-group-text"><i class="bi bi-type"></i></span>
						<input type="text" class="form-control" id="ncTitle"
							name="ncTitle"
							placeholder="Título de categoría" value="" required>
							<div class="invalid-feedback">El título es obligatorio.</div>
							<div class="valid-feedback">Correcto.</div>
					</div>
				</div>
				<div class="col-md-6 mb-3">
					<label class="form-label" for="ncUrl">Ruta o Url de la imagen</label>
					<div class="input-group">
						<span class="input-group-text"><i class="bi bi-fileimage"></i></span>
						<input type="text" class="form-control" id="ncUrl" name="ncUrl"
							placeholder="./Imagenes/platos.jpg"
							value="" required>
							<div class="invalid-feedback">La Url no es válida.</div>
							<div class="valid-feedback">Correcto.</div>
					</div>
				</div>
				<div class="col-md-12 mb-3">
					<label class="form-label" for="ncDescription">Descripción</label>
					<div class="input-group">
						<span class="input-group-text"><i class="bi bi-bodytext"></i></span>
						<input type="text" class="form-control" id="ncDescription"
							name="ncDescription" value="">
							<div class="invalid-feedback"></div>
							<div class="valid-feedback">Correcto.</div>
					</div>
				</div>
				<div class="mb-12">
					<button class="btn btn-info" type="submit">Crear</button>
					<button class="btn btn-warning" type="reset">Cancelar</button>
				</div>
			</form>`
    );
    this.platos.append(container);
  }

  bindAdminMenu(
    hNewCategory,
    hRemoveCategory,
    hNewProductForm,
    hRemoveProduct,
    hNewRestaurantForm,
    hAsDsMenu,
    hRemoveMenu,
    hModCat
  ) {
    const newCategoryLink = document.getElementById("lnewCategory");
    newCategoryLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hNewCategory,
        [],
        "#new-category",
        {
          action: "newCategory",
        },
        "#",
        event
      );
    });

    const delCategoryLink = document.getElementById("ldelCategory");
    delCategoryLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hRemoveCategory,
        [],
        "#remove-category",
        {
          action: "removeCategory",
        },
        "#",
        event
      );
    });

    const newProductLink = document.getElementById("lnewProduct");
    newProductLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hNewProductForm,
        [],
        "#new-product",
        { action: "newProduct" },
        "#",
        event
      );
    });

    const delProductLink = document.getElementById("ldelProduct");
    delProductLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hRemoveProduct,
        [],
        "#remove-product",
        { action: "removeProduct" },
        "#",
        event
      );
    });

    const newRestaurantLink = document.getElementById("lnewRestaurant");
    newRestaurantLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hNewRestaurantForm,
        [],
        "#new-restaurant",
        { action: "fNewRestaurant" },
        "#",
        event
      );
    });

    const asMenuLink = document.getElementById("lAsMenu");
    asMenuLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hAsDsMenu,
        [],
        "#asds-menu",
        { action: "fAsMenu" },
        "#",
        event
      );
    });

    const removeMenuLink = document.getElementById("lRemoveMenu");
    removeMenuLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hRemoveMenu,
        [],
        "#remove-menu",
        { action: "fRemoveMenu" },
        "#",
        event
      );
    });

    const modCatLink = document.getElementById("lModCat");
    modCatLink.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        hModCat,
        [],
        "#mod-cat",
        { action: "fModifyCat" },
        "#",
        event
      );
    });
  }

  showNewCategoryModal(done, cat, error) {
    //Modal de nueva categoría
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");
    const name = document.getElementById("messageModalTitle");
    name.innerHTML = "Nueva Categoría";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">La categoría
		<strong>${cat.name}</strong> ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamationtriangle"></i> La categoría <strong>${cat.name}</strong> ya está
		creada.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewCategory.reset();
      }
      document.fNewCategory.ncTitle.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  bindNewCategoryForm(handler) {
    newCategoryValidation(handler);
  }

  showRemoveCategoryForm(categories) {
    //Eliminar categoría
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "remove-category";
    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5 text-center">Eliminar una categoría</h1>'
    );
    const row = document.createElement("div");
    row.classList.add("category");
    for (const category of categories) {
      row.insertAdjacentHTML(
        "beforeend",
        `
                <div class="category__container">
                    <a data-category="${category.category.name}" href="#product-list">
                        <div class="cat-list-image category__photo"><img alt="${category.category.name}"
                            src="./Imagenes/${category.category.name}.jpg" />
                        </div>
                        <div class="cat-list-text category_info">
                            <h3>${category.category.name}</h3>
                            <p>${category.category.description}</p>
                        </div>
                        <div class="btn_elim"><button class="btn btn-info" data-category="${category.category.name}" type='button'>Eliminar</button></div>
                    </a>
                </div>`
      );
    }
    container.append(row);
    this.platos.append(container);
  }

  showRemoveCategoryModal(done, cat, error) {
    //Modal de eliminación de categoría
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");
    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Borrado de categoría";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">La categoría
		<strong>${cat.category.name}</strong> ha sido eliminada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3">
                    <i class="bi bi-exclamation-triangle"></i>
                    La categoría <strong>${cat.category.name}</strong> no se ha podido
                    borrar.</div>`
      );
    }
    messageModal.show();
  }

  bindRemoveCategoryForm(handler) {
    const removeContainer = document.getElementById("remove-category");
    const buttons = removeContainer.getElementsByTagName("button");
    for (const button of buttons) {
      button.addEventListener("click", function (event) {
        handler(this.dataset.category);
      });
    }
  }

  showNewProductForm(categories, allergens) {
    // Crear producto
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "new-product";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Nuevo Plato</h1>'
    );

    const form = document.createElement("form");
    form.name = "fNewProduct";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                    <label class="form-label" for="npSerial">Nombre</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-key"></i></span>
                        <input type="text" class="form-control" id="npSerial" name="npSerial" value="" required>
                        <div class="invalid-feedback">El número de serie es obligatorio. Debe ser un entero.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );
    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                    <label class="form-label" for="npUrl">Ruta o Url de la imagen</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-card-image"></i></span>
                        <input type="text" class="form-control" id="npUrl" name="npUrl"
                            placeholder="./Imagenes/platos.jpg" value="" min="0" step="1" required>
                        <div class="invalid-feedback">La Url no es válida.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );
    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                    <label class="form-label" for="npCategories">Categorías</label>
                    <div class="input-group">
                        <label class="input-group-text" for="npCategories"><i class="bi bi-card-checklist"></i></label>
                        <select class="form-select" name="npCategories" id="npCategories" multiple required>
                        </select>
                        <div class="invalid-feedback">El producto debe pertenecer al menos a una categoría.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    const npCategories = form.querySelector("#npCategories");
    for (const category of categories) {
      npCategories.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.category.name}">${category.category.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                    <label class="form-label" for="npAllergen">Alergenos</label>
                    <div class="input-group">
                        <label class="input-group-text" for="npAllergen"><i class="bi bi-card-checklist"></i></label>
                        <select class="form-select" name="npAllergen" id="npAllergen" multiple required>
                        </select>
                        <div class="invalid-feedback">El producto debe pertenecer al menos a una categoría.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    const npAllergen = form.querySelector("#npAllergen");
    for (const allergen of allergens) {
      npAllergen.insertAdjacentHTML(
        "beforeend",
        `<option value="${allergen.allergen.name}">${allergen.allergen.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-4 mb-0">
                    <label class="form-label" for="npDescription">Descripción</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-text-paragraph"></i></span>
                        <textarea class="form-control" id="npDescription" name="npDescription" rows="4">
                        </textarea>
                        <div class="invalid-feedback"></div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );
    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-3 mb-0">
                    <label class="form-label" for="npIngredients">Ingredientes</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-text-paragraph"></i></span>
                        <textarea class="form-control" id="npIngredients" name="npIngredients" rows="4">
                        </textarea>
                        <div class="invalid-feedback"></div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );
    form.insertAdjacentHTML(
      "beforeend",
      `<div class="mb-12">
                    <button class="btn btn-info" type="submit">Crear</button>
                    <button class="btn btn-warning" type="reset">Cancelar</button>
                </div>`
    );

    container.append(form);
    this.platos.append(container);
  }

  showNewProductModal(done, dish, error) {
    //Modal de nuevo producto
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Nuevo Plato";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no ha podido crearse correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewProduct.reset();
      }
      document.fNewProduct.npSerial.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  bindNewProductForm(handler) {
    newProductValidation(handler);
  }

  showRemoveProductForm(categories) {
    //Eliminar producto
    this.platos.replaceChildren();
    if (this.categories.children.length > 1)
      this.categories.children[1].remove();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "remove-product";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Eliminar un plato</h1>'
    );

    const form = document.createElement("form");
    form.name = "fNewProduct";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-6 mb-3">
                    <label class="form-label" for="npCategories">Categorías del producto</label>
                    <div class="input-group">
                        <label class="input-group-text" for="rpCategories"><i class="bi bi-card-checklist"></i></label>
                        <select class="form-select" name="rpCategories" id="rpCategories">
                            <option disabled selected>Selecciona una categoría</option>
                        </select>
                    </div>
                </div>`
    );
    const rpCategories = form.querySelector("#rpCategories");
    for (const category of categories) {
      rpCategories.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.category.name}">${category.category.name}</option>`
      );
    }

    container.append(form);
    container.insertAdjacentHTML(
      "beforeend",
      '<div id="product-list" class="container my-3"><div class="row"></div></div>'
    );

    this.platos.append(container);
  }

  bindRemoveProductSelects(hCategories) {
    const rpCategories = document.getElementById("rpCategories");
    rpCategories.addEventListener("change", (event) => {
      this[EXCECUTE_HANDLER](
        hCategories,
        [event.currentTarget.value],
        "#remove-product",
        {
          action: "removeProductByCategory",
          category: event.currentTarget.value,
        },
        "#remove-product",
        event
      );
    });
  }

  showRemoveProductList(categories) {
    //Lista de productos a eliminar
    const listContainer = document
      .getElementById("product-list")
      .querySelector("div.row");
    listContainer.replaceChildren();

    let exist = false;
    for (const category of categories) {
      exist = true;
      listContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="col-md-4 rProduct">
                    <figure class="card card-product-grid card-lg"> <a data-serial="${category.name}" href="#single-product" class="img-wrap"><img class="${category.name}-style" src="./Imagenes/${category.name}.jpg"></a>
                        <figcaption class="info-wrap">
                            <div class="row">
                                <div class="col-md-8"> <a data-serial="${category.name}" href="#single-product" class="title">${category.name} - ${category.name}</a> </div>
                                <div class="col-md-4">
                                    <div class="rating text-right"> <i class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i> </div>
                                </div>
                            </div>
                        </figcaption>
                        <div class="bottom-wrap"> <a href="#" data-serial="${category.name}" class="btn btn-info float-right"> Eliminar </a>
                            <div class="price-wrap"> <span class="price h5">${category.name}</span> <br> <small class="text-success">Free shipping</small> </div>
                        </div>
                    </figure>
                </div>`
      );
    }
    if (!exist) {
      listContainer.insertAdjacentHTML(
        "beforeend",
        '<p class="text-danger"><i class="bi bi-exclamation-triangle"></i> No existen productos para esta categoría o tipo.</p>'
      );
    }
  }

  bindRemoveProduct(handler) {
    const productList = document.getElementById("product-list");
    const buttons = productList.querySelectorAll("a.btn");
    for (const button of buttons) {
      button.addEventListener("click", function (event) {
        handler(this.dataset.serial);
        event.preventDefault();
      });
    }
  }

  showRemoveProductModal(done, product, error) {
    //Modal de eliminación de producto
    const productList = document.getElementById("product-list");
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Producto eliminado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${product.name}</strong> ha sido eliminado correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        '<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${product.name}</strong> no existe en el manager.</div>'
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        const button = productList.querySelector(
          `a.btn[data-serial="${product.name}"]`
        );
        button.parentElement.parentElement.parentElement.remove();
      }
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  // Visualizacion de la creación de restaurantes
  showNewRestaurantForm() {
    this.platos.replaceChildren();

    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "new-restaurant";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Nuevo restaurante</h1>'
    );

    const form = document.createElement("form");
    form.name = "fNewRestaurant";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                    <label class="form-label" for="nrName">Nombre</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-key"></i></span>
                        <input type="text" class="form-control" id="nrName" name="nrName" value="" required>
                        <div class="invalid-feedback">El número de serie es obligatorio. Debe ser un entero.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                    <label class="form-label" for="nrLocation">Localización</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-key"></i></span>
                        <input type="text" class="form-control" id="nrLocation" name="nrLocation" value="" required>
                        <div class="invalid-feedback">El número de serie es obligatorio. Debe ser un entero.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-4 mb-0">
                    <label class="form-label" for="nrDescription">Descripción</label>
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-text-paragraph"></i></span>
                        <textarea class="form-control" id="nrDescription" name="nrDescription" rows="4">
                        </textarea>
                        <div class="invalid-feedback"></div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="mb-12">
                    <button class="btn btn-info" type="submit">Crear</button>
                    <button class="btn btn-warning" type="reset">Cancelar</button>
                </div>`
    );

    container.append(form);
    this.platos.append(container);
  }

  // Modal que nos indicaraque todo fue bien creado

  showNewRestaurantModal(done, restaurant, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");

    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Nuevo Restaurante";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El restaurante <strong>${restaurant.name}</strong> ha sido creada correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El restaurante <strong>${restaurant.name}</strong> no ha podido crearse correctamente.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fNewRestaurant.reset();
      }
      document.fNewRestaurant.nrName.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  // Con esto enlazamos la validación
  bindNewRestaurantForm(handler) {
    newRestaurantValidation(handler);
  }

  showAsMenuForm(menus, dishes) {
    this.platos.replaceChildren();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "asds-menu";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Asignación de platos</h1>'
    );

    const form = document.createElement("form");
    form.name = "fAsMenu";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-12 mb-3 input-group">
                    <label class="input-group-text" for="asDish"><i class="bi bi-card-checklist"></i>PLATOS</label>
                    <select class="form-select" name="asDish" id="asDish" multiple required>
                    <option selected>Elige Un Plato</option>
                    </select>
                    <div class="invalid-feedback">El tipo es obligatorio.</div>
                    <div class="valid-feedback">Correcto.</div>
                </div>`
    );

    const asDish = form.querySelector("#asDish");
    for (const dish of dishes) {
      asDish.insertAdjacentHTML(
        "beforeend",
        `<option value="${dish.name}">${dish.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-8 mb-3">
                    <div class="input-group">
                        <label class="input-group-text" for="asMenu"><i class="bi bi-card-checklist"></i>MENUS</label>
                        <select class="form-select" name="asMenu" id="asMenu" required>
                        <option selected>Selecciona Un Menú</option>
                        </select>
                        <div class="invalid-feedback">El producto debe pertenecer al menos a una categoría.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    const asMenu = form.querySelector("#asMenu");
    for (const menu of menus) {
      asMenu.insertAdjacentHTML(
        "beforeend",
        `<option value="${menu.menu.name}">${menu.menu.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="mb-12">
                    <button class="btn btn-info" type="submit">Asignar Plato</button>
                    <button class="btn btn-warning" type="reset">Cancelar</button>
                </div>`
    );

    container.append(form);
    this.platos.append(container);
  }

  showNewAsMenuModal(done, menu, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");
    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato asignado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> se agrego correctamente al menu <strong>${menu.menu.name}</strong> </div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i>El plato <strong>${dish}</strong> no pudo agregarse correctamente al menu <strong>${menu}</strong> debido al error: ${error}  </div>`
      );
    }

    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fAsMenu.reset();
      }
      document.fAsMenu.asMenu.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  // Mandamos la informacion a validar
  bindNewAsDsMenuForm(handler) {
    newAsDsMenuValidation(handler);
  }

  showRemoveDishMenuForm(menus, dishes) {
    this.platos.replaceChildren();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "remove-menu";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Desasignación de platos</h1>'
    );

    const form = document.createElement("form");
    form.name = "fRemoveMenu";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-8 mb-3">
                    <div class="input-group">
                        <label class="input-group-text" for="rmMenu"><i class="bi bi-card-checklist"></i>MENUS</label>
                        <select class="form-select" name="rmMenu" id="rmMenu" required>
                        <option selected>Selecciona Un Menú</option>
                        </select>
                        <div class="invalid-feedback">Debe elegir al menos un menú para modificar sus platos.</div>
                        <div class="valid-feedback">Correcto.</div>
                    </div>
                </div>`
    );

    const rmMenu = form.querySelector("#rmMenu");
    for (const menu of menus) {
      rmMenu.insertAdjacentHTML(
        "beforeend",
        `<option value="${menu.menu.name}">${menu.menu.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-12 mb-3 input-group">
              <label class="input-group-text" for="rmDish" style="color: #c93737"><i class="bi bi-card-checklist"></i>PLATOS</label>
              <select class="form-select" name="rmDish" id="rmDish" multiple required>
                  <option selected>Selecciona un plato</option>
              </select>
              <div class="invalid-feedback">El plato es obligatorio.</div>
              <div class="valid-feedback">Correcto.</div>
          </div>`
    );

    const rmDish = form.querySelector("#rmDish");
    for (const dish of dishes) {
      rmDish.insertAdjacentHTML(
        "beforeend",
        `<option value="${dish.name}">${dish.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="mb-12">
                    <button class="btn btn-info" type="submit">Desasignar Plato</button>          
                    <button class="btn btn-warning" type="reset">Cancelar</button>
                </div>`
    );

    container.append(form);
    this.platos.append(container);
  }

  showRemoveDishMenuModal(done, menu, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");
    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Plato Desasignado";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3">El plato <strong>${dish.name}</strong> se ha desasignado correctamente del menú <strong>${menu.menu.name}</strong>.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no ha podido desasignarse correctamente del menú <strong>${menu.menu.name}</strong> debido al error: ${error}.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fRemoveMenu.reset();
      }
      document.fRemoveMenu.rmMenu.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  bindRemoveDishMenuForm(handler) {
    removeDishMenuValidation(handler);
  }

  //Modificar categorías de un plato
  showModifyCatForm(categories, dishes) {
    this.platos.replaceChildren();
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("my-3");
    container.id = "mod-cat";

    container.insertAdjacentHTML(
      "afterbegin",
      '<h1 class="display-5">Modificar categorías de un plato</h1>'
    );

    const form = document.createElement("form");
    form.name = "fModifyCategory";
    form.setAttribute("role", "form");
    form.setAttribute("novalidate", "");
    form.classList.add("row");
    form.classList.add("g-3");

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-12 mb-3 input-group">
                  <label class="input-group-text" for="mcDish" style="color: #c93737"><i class="bi bi-card-checklist"></i>PLATOS</label>
                  <select class="form-select" name="mcDish" id="mcDish" multiple required>
                      <option selected>Plato A Modificar</option>
                  </select>
                  <div class="invalid-feedback">El tipo es obligatorio.</div>
                  <div class="valid-feedback">Correcto.</div>
              </div>`
    );
    const mcDish = form.querySelector("#mcDish");
    for (const dish of dishes) {
      mcDish.insertAdjacentHTML(
        "beforeend",
        `<option value="${dish.name}">${dish.name}</option>`
      );
    }
    form.insertAdjacentHTML(
      "beforeend",
      `<div class="col-md-5 mb-3">
                <div class="input-group">
                    <label class="input-group-text" for="mcCat"><i class="bi bi-card-checklist"></i>CATEGORÍAS</label>
                    <select class="form-select" name="mcCat" id="mcCat" required>
                    <option selected>Selecciona Una Categoría</option>
                    </select>
                    <div class="invalid-feedback">El producto debe pertenecer al menos a una categoría.</div>
                    <div class="valid-feedback">Correcto.</div>
                </div>
            </div>`
    );
    const mcCategories = form.querySelector("#mcCat");
    for (const category of categories) {
      mcCategories.insertAdjacentHTML(
        "beforeend",
        `<option value="${category.category.name}">${category.category.name}</option>`
      );
    }

    form.insertAdjacentHTML(
      "beforeend",
      `<div class="mb-12">
                <button class="btn btn-info" type="submit">Modificar</button>
                <button class="btn btn-warning" type="reset">Cancelar</button>
            </div>`
    );
    container.append(form);
    this.platos.append(container);
  }

  //Modal de modificación de categorías

  showModifyCatModal(done, category, dish, error) {
    const messageModalContainer = document.getElementById("messageModal");
    const messageModal = new bootstrap.Modal("#messageModal");
    const title = document.getElementById("messageModalTitle");
    title.innerHTML = "Modificación de categorías";
    const body = messageModalContainer.querySelector(".modal-body");
    body.replaceChildren();
    if (done) {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="p-3"> El plato <strong>${dish.name}</strong> han sido añadido a la categoría: ${category.category.name} correctamente.</div>`
      );
    } else {
      body.insertAdjacentHTML(
        "afterbegin",
        `<div class="error text-danger p-3"><i class="bi bi-exclamation-triangle"></i> El plato <strong>${dish.name}</strong> no han podido añadirse correctamente a la categoría: ${category.category.name} debido al error: ${error}.</div>`
      );
    }
    messageModal.show();
    const listener = (event) => {
      if (done) {
        document.fModifyCategory.reset();
      }
      document.fModifyCategory.mcDish.focus();
    };
    messageModalContainer.addEventListener("hidden.bs.modal", listener, {
      once: true,
    });
  }

  //Enlazar la validación

  bindModifyCatForm(handler) {
    modifyCatValidation(handler);
  }

  modifyBreadcrumb(category) {
    const breadcrumb = document.getElementById("breadcrumb");
    breadcrumb.innerHTML = "";
    breadcrumb.insertAdjacentHTML(
      "beforeend",
      `<li class="breadcrumb-item"><a href="../index.html">Inicio</a></li>`
    );
    // Si hay más de un elemento en el breadcrumb, se borra el segundo
    if (breadcrumb.children[1] !== undefined) {
      breadcrumb.removeChild(breadcrumb.children[1]);
    }
    if (category !== null) {
      breadcrumb.insertAdjacentHTML(
        "beforeend",
        `
        <li class="breadcrumb-item active" aria-current="page">${category}</li>

         `
      );
    }
  }

  showCookiesMessage() {
    const toast = `<div class="fixed-top p-5 mt-5">
          <div id="cookies-message" class="toast fade show" role="alert" aria-live="assertive" aria-atomic="true">
              <div class="toast-header">
                  <h4 class="me-auto">Aviso de uso de cookies</h4>
                  <button type="button" class="btn-close" data-bs-dismiss="toast"
                      aria-label="Close" id="btnDismissCookie"></button>
              </div>
              <div class="toast-body p-4 d-flex flex-column">
                  <p>
                      Este sitio web utiliza cookies para mejorar la experiencia de usuario. Al
                      aceptar, se da por supuesto que está de acuerdo con el uso de cookies en
                      este sitio.
                  </p>
                  <div class="ml-auto">
                      <button type="button" class="btn btn-warning mr-3 deny"
                          id="btnDenyCookie" data-bs-dismiss="toast">
                          Denegar
                      </button>
                      <button type="button" class="btn btn-info accept"
                          id="btnAcceptCookie" data-bs-dismiss="toast">
                          Aceptar
                      </button>
                  </div>
              </div>
          </div>
      </div>`;
    document.body.insertAdjacentHTML("afterbegin", toast);

    const cookiesMessage = document.getElementById("cookies-message");
    cookiesMessage.addEventListener("hidden.bs.toast", (event) => {
      event.currentTarget.parentElement.remove();
    });

    const denyCookieFunction = (event) => {
      this.platos.replaceChildren();
      this.platos.insertAdjacentHTML(
        "afterbegin",
        `<div class="container my3"><div class="alert alert-info" role="alert">
          <strong>
              Para seguir navegando por este sitio web, debe aceptar el uso de cookies. Refresque la página para
              volver a mostrar el mensaje.
          </strong>
          </div></div>`
      );
      this.categories.remove();
      this.menu.remove();
    };
    const btnDenyCookie = document.getElementById("btnDenyCookie");
    btnDenyCookie.addEventListener("click", denyCookieFunction);
    const btnDismissCookie = document.getElementById("btnDismissCookie");
    btnDismissCookie.addEventListener("click", denyCookieFunction);

    const btnAcceptCookie = document.getElementById("btnAcceptCookie");
    btnAcceptCookie.addEventListener("click", (event) => {
      setCookie("accetedCookieMessage", "true", 1);
    });
  }

  showIdentificationLink() {
    // Accede al área de usuario
    const userArea = document.getElementById("userArea");
    // Limpia el área
    userArea.replaceChildren();
    userArea.insertAdjacentHTML(
      "afterbegin",
      `<a id="login" href="#"><i class="fa-solid fa-user"></i>&nbsp; Acceder</a>`
    );
  }

  bindIdentificationLink(handler) {
    const login = document.getElementById("login");
    login.addEventListener("click", (event) => {
      this[EXCECUTE_HANDLER](
        handler,
        [],
        "platos",
        { action: "login" },
        "#",
        event
      );
    });
  }

  showLogin() {
    this.platos.replaceChildren();
    this.categorias.replaceChildren();

    const login = `
    <div class="container my3">
    <h2 class="display-5">Acceso Usuario</h2>
    <form name="fLogin" class="row g-3" id="fLogin">
    <div class="col-md-6">
    <label for="username" class="form-label">Usuario</label>
    <input type="text" class="form-control" id="username" name="username" required>
    </div>
    <div class="col-md-6">
    <label for="password" class="form-label">Contraseña</label>
    <input type="password" class="form-control" id="password" name="password" required>
    </div>
    <div class="col-md-6">
    <div class="form-check">
    <input class="form-check-input" type="checkbox" id="remember" name="remember">
    <label class="form-check-label" for="remember">Recordar usuario</label>
    </div>
    </div>
    <div class="col-md-6">
    <button type="submit" class="btn btn-primary">Acceder</button>
    </div>
    </form>
    `;
    this.platos.insertAdjacentHTML("afterbegin", login);
  }

  bindLogin(handler) {
    const form = document.forms.fLogin;
    form.addEventListener("submit", (event) => {
      handler(form.username.value, form.password.value, form.remember.checked);
      event.preventDefault();
    });
  }

  showInvalidUserMessage() {
    this.platos.insertAdjacentHTML(
      "beforeend",
      `<div class="alert alert-danger" role="alert">
      <strong>Usuario o contraseña incorrectos.</strong>
      </div>`
    );
    document.forms.fLogin.reset();
    document.forms.fLogin.username.focus();
  }

  initHistory() {
    history.replaceState({ action: "init" }, null);
  }

  showAuthUserProfile(user) {
    const userArea = document.getElementById("userArea");
    userArea.replaceChildren();
    userArea.insertAdjacentHTML(
      "afterbegin",
      `<div class="account"">
     <a id="profile" href="#"><i class="fa-solid fa-user"></i> ${user.username}</a>
      <a id="aCloseSession" href="#">Cerrar sesión</a>
      </div>`
    );
    alert("Bienvenido " + user.username);
  }

  setUserCookie(user) {
    setCookie("activeUser", user.username, 1);
  }

  deleteUserCookie() {
    setCookie("activeUser", "", 0);
  }

  removeAdminMenu() {
    const adminMenu = document.getElementById("navServices");
    if (adminMenu) adminMenu.parentElement.remove();
  }

  bindCloseSession(handler) {
    document
      .getElementById("aCloseSession")
      .addEventListener("click", (event) => {
        handler();
        event.preventDefault();
      });
  }

  bindLanguageSelection(handler) {
    const lFlags = document
      .getElementById("language")
      .querySelectorAll("ul.dropdown-menu a");
    for (const link of lFlags) {
      link.addEventListener("click", (event) => {
        const { language } = event.currentTarget.dataset;
        handler(language);
        localStorage.setItem("language", language);
        event.preventDefault();
      });
    }
  }
}

export default RestaurantView;
