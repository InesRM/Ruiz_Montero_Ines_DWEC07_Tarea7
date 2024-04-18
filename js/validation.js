function showFeedBack(input, valid, message) {
    const validClass = (valid) ? 'is-valid' : 'is-invalid';
    const messageDiv = (valid) ?
        input.parentElement.querySelector('div.valid-feedback') :
        input.parentElement.querySelector('div.invalid-feedback');
    for (const div of input.parentElement.getElementsByTagName('div')) {
        div.classList.remove('d-block');
    }
    messageDiv.classList.remove('d-none');
    messageDiv.classList.add('d-block');
    input.classList.remove('is-valid');
    input.classList.remove('is-invalid');
    input.classList.add(validClass);
    if (message) {
        messageDiv.innerHTML = message;
    }
}

function defaultCheckElement(event) {
    this.value = this.value.trim();
    if (!this.checkValidity()) {
        showFeedBack(this, false);
    } else {
        showFeedBack(this, true);
    }
}

function newCategoryValidation(handler) {
    const form = document.forms.fNewCategory;
    form.setAttribute('novalidate', true);
    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        this.ncDescription.value = this.ncDescription.value.trim();
        showFeedBack(this.ncDescription, true);

        if (!this.ncUrl.checkValidity()) {
            isValid = false;
            showFeedBack(this.ncUrl, false);
            firstInvalidElement = this.ncUrl;
        } else {
            showFeedBack(this.ncUrl, true);
        }
        if (!this.ncTitle.checkValidity()) {
            isValid = false;
            showFeedBack(this.ncTitle, false);
            firstInvalidElement = this.ncTitle;
        } else {
            showFeedBack(this.ncTitle, true);
        }
        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            handler(this.ncTitle.value, this.ncUrl.value,
                this.ncDescription.value);
        }
        event.preventDefault();
        event.stopPropagation();
    });
    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        this.ncTitle.focus();
    }));
    form.ncTitle.addEventListener('change', defaultCheckElement);
    form.ncUrl.addEventListener('change', defaultCheckElement);
}

function newAsDsMenuValidation(handler) {
    const form = document.forms.fAsMenu;
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        if (!this.asMenu.checkValidity()) {
            isValid = false;
            showFeedBack(this.asMenu, false);
            firstInvalidElement = this.asMenu;
        } else {
            showFeedBack(this.asMenu, true);
        }

        if (!this.asDish.checkValidity()) {
            isValid = false;
            showFeedBack(this.asDish, false);
            firstInvalidElement = this.cType;
        } else {
            showFeedBack(this.asDish, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            const asMenu = this.asMenu.value;
            handler(
                asMenu,
                this.asDish.value,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
    }));

    form.asDish.addEventListener('change', defaultCheckElement);

}

function newProductValidation(handler) {
    const form = document.forms.fNewProduct;
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        this.npDescription.value = this.npDescription.value.trim();
        showFeedBack(this.npDescription, true);

        this.npIngredients.value = this.npIngredients.value.trim();
        showFeedBack(this.npIngredients, true);

        if (!this.npCategories.checkValidity()) {
            isValid = false;
            showFeedBack(this.npCategories, false);
            firstInvalidElement = this.npCategories;
        } else {
            showFeedBack(this.npCategories, true);
        }

        if (!this.npAllergen.checkValidity()) {
            isValid = false;
            showFeedBack(this.npAllergen, false);
            firstInvalidElement = this.npAllergen;
        } else {
            showFeedBack(this.npAllergen, true);
        }


        if (!this.npUrl.checkValidity()) {
            isValid = false;
            showFeedBack(this.npUrl, false);
            firstInvalidElement = this.npUrl;
        } else {
            showFeedBack(this.npUrl, true);
        }

        if (!this.npSerial.checkValidity()) {
            isValid = false;
            showFeedBack(this.npSerial, false);
            firstInvalidElement = this.npSerial;
        } else {
            showFeedBack(this.npSerial, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            const categories = [...this.npCategories.selectedOptions].map((option) => option.value);
            const allergens = [...this.npAllergen.selectedOptions].map((option) => option.value);
            console.log(categories)
            handler(
                this.npSerial.value,
                this.npUrl.value,
                this.npDescription.value,
                this.npIngredients.value,
                categories,
                allergens,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        this.npSerial.focus();
    }));

    form.npSerial.addEventListener('change', defaultCheckElement);
    form.npUrl.addEventListener('change', defaultCheckElement);
}


function newRestaurantValidation(handler) {
    const form = document.forms.fNewRestaurant;
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        this.nrDescription.value = this.nrDescription.value.trim();
        showFeedBack(this.nrDescription, true);

        this.nrLocation.value = this.nrLocation.value.trim();
        showFeedBack(this.nrLocation, true);

        if (!this.nrName.checkValidity()) {
            isValid = false;
            showFeedBack(this.nrName, false);
            firstInvalidElement = this.nrName;
        } else {
            showFeedBack(this.nrName, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            handler(
                this.nrName.value,
                this.nrLocation.value,
                this.nrDescription.value,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
        this.nrName.focus();
    }));

    form.nrName.addEventListener('change', defaultCheckElement);
    form.nrLocation.addEventListener('change', defaultCheckElement);
}
function modifyCatValidation(handler) {
    const form = document.forms.fModifyCategory;
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        if (!this.mcCat.checkValidity()) {
            isValid = false;
            showFeedBack(this.mcCat, false);
            firstInvalidElement = this.mcCat;
        } else {
            showFeedBack(this.mcCat, true);
        }

        if (!this.mcDish.checkValidity()) {
            isValid = false;
            showFeedBack(this.mcDish, false);
            firstInvalidElement = this.cType;
        } else {
            showFeedBack(this.mcDish, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            const mcCat = this.mcCat.value;
            handler(
                mcCat,
                this.mcDish.value,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
    }));

    form.mcDish.addEventListener('change', defaultCheckElement);
}

   function removeDishMenuValidation(handler) {

    const form = document.forms.fRemoveMenu;
    form.setAttribute('novalidate', '');

    form.addEventListener('submit', function (event) {
        let isValid = true;
        let firstInvalidElement = null;

        if (!this.rmDish.checkValidity()) {
            isValid = false;
            showFeedBack(this.rmDish, false);
            firstInvalidElement = this.rmDish;
        } else {
            showFeedBack(this.rmDish, true);
        }

        if (!isValid) {
            firstInvalidElement.focus();
        } else {
            const rmMenu = this.rmMenu.value;
            const rmDish = this.rmDish.value;
            handler(
                rmMenu,
                rmDish,
            );
        }

        event.preventDefault();
        event.stopPropagation();
    });

    form.addEventListener('reset', (function (event) {
        for (const div of this.querySelectorAll('div.valid-feedback, div.invalid-feedback')) {
            div.classList.remove('d-block');
            div.classList.add('d-none');
        }
        for (const input of this.querySelectorAll('input')) {
            input.classList.remove('is-valid');
            input.classList.remove('is-invalid');
        }
    }));

    form.rmDish.addEventListener('change', defaultCheckElement);
   }



export { newCategoryValidation, newProductValidation, newRestaurantValidation, newAsDsMenuValidation,modifyCatValidation,removeDishMenuValidation};
