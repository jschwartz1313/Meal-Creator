// Data Storage
class DataStore {
    constructor() {
        this.meals = this.loadData('meals') || [];
        this.recipes = this.loadData('recipes') || [];
        this.ingredients = this.loadData('ingredients') || [];
    }

    loadData(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    addMeal(meal) {
        meal.id = Date.now();
        this.meals.push(meal);
        this.saveData('meals', this.meals);
    }

    updateMeal(id, updatedMeal) {
        const index = this.meals.findIndex(m => m.id === id);
        if (index !== -1) {
            this.meals[index] = { ...this.meals[index], ...updatedMeal };
            this.saveData('meals', this.meals);
        }
    }

    deleteMeal(id) {
        this.meals = this.meals.filter(m => m.id !== id);
        this.saveData('meals', this.meals);
    }

    addRecipe(recipe) {
        recipe.id = Date.now();
        this.recipes.push(recipe);
        this.saveData('recipes', this.recipes);
    }

    updateRecipe(id, updatedRecipe) {
        const index = this.recipes.findIndex(r => r.id === id);
        if (index !== -1) {
            this.recipes[index] = { ...this.recipes[index], ...updatedRecipe };
            this.saveData('recipes', this.recipes);
        }
    }

    deleteRecipe(id) {
        this.recipes = this.recipes.filter(r => r.id !== id);
        this.saveData('recipes', this.recipes);
    }

    addIngredient(ingredient) {
        ingredient.id = Date.now();
        this.ingredients.push(ingredient);
        this.saveData('ingredients', this.ingredients);
    }

    updateIngredient(id, updatedIngredient) {
        const index = this.ingredients.findIndex(i => i.id === id);
        if (index !== -1) {
            this.ingredients[index] = { ...this.ingredients[index], ...updatedIngredient };
            this.saveData('ingredients', this.ingredients);
        }
    }

    deleteIngredient(id) {
        this.ingredients = this.ingredients.filter(i => i.id !== id);
        this.saveData('ingredients', this.ingredients);
    }
}

// Initialize
const store = new DataStore();
let currentEditId = null;
let currentEditType = null;

// Tab Navigation
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active tab content
        tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Meals Functionality
const mealModal = document.getElementById('meal-modal');
const mealForm = document.getElementById('meal-form');
const addMealBtn = document.getElementById('add-meal-btn');
const mealsList = document.getElementById('meals-list');

addMealBtn.addEventListener('click', () => {
    currentEditId = null;
    currentEditType = 'meal';
    document.getElementById('meal-modal-title').textContent = 'Add Meal';
    mealForm.reset();
    document.getElementById('meal-rating').value = '0';
    updateStarRating(0);
    openModal(mealModal);
});

// Star Rating
const stars = document.querySelectorAll('.rating-input .star');
stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        document.getElementById('meal-rating').value = rating;
        updateStarRating(rating);
    });
});

function updateStarRating(rating) {
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
            star.textContent = '★';
        } else {
            star.classList.remove('active');
            star.textContent = '☆';
        }
    });
}

mealForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const mealData = {
        name: document.getElementById('meal-name').value,
        category: document.getElementById('meal-category').value,
        rating: parseInt(document.getElementById('meal-rating').value),
        notes: document.getElementById('meal-notes').value
    };

    if (currentEditId) {
        store.updateMeal(currentEditId, mealData);
    } else {
        store.addMeal(mealData);
    }

    closeModal(mealModal);
    renderMeals();
});

function renderMeals() {
    mealsList.innerHTML = '';

    if (store.meals.length === 0) {
        mealsList.innerHTML = `
            <div class="empty-state">
                <p>No meals tracked yet!</p>
                <p>Click "Add Meal" to start tracking your favorite meals.</p>
            </div>
        `;
        return;
    }

    store.meals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'card';

        const stars = '★'.repeat(meal.rating) + '☆'.repeat(5 - meal.rating);

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${meal.name}</div>
                    <span class="card-badge">${meal.category}</span>
                </div>
                <div class="card-actions">
                    <button class="icon-btn edit-meal" data-id="${meal.id}">✏️</button>
                    <button class="icon-btn delete-meal" data-id="${meal.id}">🗑️</button>
                </div>
            </div>
            <div class="rating">${stars}</div>
            ${meal.notes ? `<div class="card-notes">${meal.notes}</div>` : ''}
        `;

        mealsList.appendChild(card);
    });

    // Add event listeners
    document.querySelectorAll('.edit-meal').forEach(btn => {
        btn.addEventListener('click', () => editMeal(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.delete-meal').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this meal?')) {
                store.deleteMeal(parseInt(btn.dataset.id));
                renderMeals();
            }
        });
    });
}

function editMeal(id) {
    const meal = store.meals.find(m => m.id === id);
    if (!meal) return;

    currentEditId = id;
    currentEditType = 'meal';

    document.getElementById('meal-modal-title').textContent = 'Edit Meal';
    document.getElementById('meal-name').value = meal.name;
    document.getElementById('meal-category').value = meal.category;
    document.getElementById('meal-rating').value = meal.rating;
    document.getElementById('meal-notes').value = meal.notes || '';
    updateStarRating(meal.rating);

    openModal(mealModal);
}

// Recipes Functionality
const recipeModal = document.getElementById('recipe-modal');
const recipeForm = document.getElementById('recipe-form');
const addRecipeBtn = document.getElementById('add-recipe-btn');
const recipesList = document.getElementById('recipes-list');
const recipeIngredientsList = document.getElementById('recipe-ingredients-list');
const addRecipeIngredientBtn = document.getElementById('add-recipe-ingredient-btn');

let recipeIngredients = [];

addRecipeBtn.addEventListener('click', () => {
    currentEditId = null;
    currentEditType = 'recipe';
    recipeIngredients = [];
    document.getElementById('recipe-modal-title').textContent = 'Create Recipe';
    recipeForm.reset();
    renderRecipeIngredients();
    openModal(recipeModal);
});

addRecipeIngredientBtn.addEventListener('click', () => {
    recipeIngredients.push({ name: '', quantity: '' });
    renderRecipeIngredients();
});

function renderRecipeIngredients() {
    recipeIngredientsList.innerHTML = '';

    recipeIngredients.forEach((ingredient, index) => {
        const row = document.createElement('div');
        row.className = 'recipe-ingredient-row';
        row.innerHTML = `
            <input type="text" placeholder="Ingredient name" value="${ingredient.name}" data-index="${index}" class="ingredient-name-input">
            <input type="text" placeholder="Amount" value="${ingredient.quantity}" data-index="${index}" class="ingredient-quantity-input">
            <button type="button" class="remove-ingredient-btn" data-index="${index}">×</button>
        `;
        recipeIngredientsList.appendChild(row);
    });

    // Add event listeners
    document.querySelectorAll('.ingredient-name-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            recipeIngredients[index].name = e.target.value;
        });
    });

    document.querySelectorAll('.ingredient-quantity-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            recipeIngredients[index].quantity = e.target.value;
        });
    });

    document.querySelectorAll('.remove-ingredient-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            recipeIngredients.splice(index, 1);
            renderRecipeIngredients();
        });
    });
}

recipeForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const recipeData = {
        name: document.getElementById('recipe-name').value,
        servings: parseInt(document.getElementById('recipe-servings').value),
        prepTime: parseInt(document.getElementById('recipe-prep-time').value),
        cookTime: parseInt(document.getElementById('recipe-cook-time').value),
        ingredients: recipeIngredients.filter(ing => ing.name.trim() !== ''),
        instructions: document.getElementById('recipe-instructions').value
    };

    if (currentEditId) {
        store.updateRecipe(currentEditId, recipeData);
    } else {
        store.addRecipe(recipeData);
    }

    closeModal(recipeModal);
    renderRecipes();
});

function renderRecipes() {
    recipesList.innerHTML = '';

    if (store.recipes.length === 0) {
        recipesList.innerHTML = `
            <div class="empty-state">
                <p>No recipes created yet!</p>
                <p>Click "Create Recipe" to design your first recipe.</p>
            </div>
        `;
        return;
    }

    store.recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'card';

        const totalTime = recipe.prepTime + recipe.cookTime;

        card.innerHTML = `
            <div class="card-header">
                <div>
                    <div class="card-title">${recipe.name}</div>
                </div>
                <div class="card-actions">
                    <button class="icon-btn edit-recipe" data-id="${recipe.id}">✏️</button>
                    <button class="icon-btn delete-recipe" data-id="${recipe.id}">🗑️</button>
                </div>
            </div>
            <div class="recipe-meta">
                <div class="recipe-meta-item">⏱️ ${totalTime} min</div>
                <div class="recipe-meta-item">🍽️ ${recipe.servings} servings</div>
            </div>
            <div class="recipe-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                    ${recipe.ingredients.map(ing => `<li>${ing.quantity} ${ing.name}</li>`).join('')}
                </ul>
            </div>
            <div class="card-notes">${recipe.instructions.substring(0, 100)}${recipe.instructions.length > 100 ? '...' : ''}</div>
        `;

        recipesList.appendChild(card);
    });

    // Add event listeners
    document.querySelectorAll('.edit-recipe').forEach(btn => {
        btn.addEventListener('click', () => editRecipe(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.delete-recipe').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this recipe?')) {
                store.deleteRecipe(parseInt(btn.dataset.id));
                renderRecipes();
            }
        });
    });
}

function editRecipe(id) {
    const recipe = store.recipes.find(r => r.id === id);
    if (!recipe) return;

    currentEditId = id;
    currentEditType = 'recipe';
    recipeIngredients = [...recipe.ingredients];

    document.getElementById('recipe-modal-title').textContent = 'Edit Recipe';
    document.getElementById('recipe-name').value = recipe.name;
    document.getElementById('recipe-servings').value = recipe.servings;
    document.getElementById('recipe-prep-time').value = recipe.prepTime;
    document.getElementById('recipe-cook-time').value = recipe.cookTime;
    document.getElementById('recipe-instructions').value = recipe.instructions;

    renderRecipeIngredients();
    openModal(recipeModal);
}

// Ingredients Functionality
const ingredientModal = document.getElementById('ingredient-modal');
const ingredientForm = document.getElementById('ingredient-form');
const addIngredientBtn = document.getElementById('add-ingredient-btn');
const ingredientsList = document.getElementById('ingredients-list');
const ingredientSearch = document.getElementById('ingredient-search');

addIngredientBtn.addEventListener('click', () => {
    currentEditId = null;
    currentEditType = 'ingredient';
    document.getElementById('ingredient-modal-title').textContent = 'Add Ingredient';
    ingredientForm.reset();
    openModal(ingredientModal);
});

ingredientSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    renderIngredients(searchTerm);
});

ingredientForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const ingredientData = {
        name: document.getElementById('ingredient-name').value,
        category: document.getElementById('ingredient-category').value
    };

    if (currentEditId) {
        store.updateIngredient(currentEditId, ingredientData);
    } else {
        store.addIngredient(ingredientData);
    }

    closeModal(ingredientModal);
    renderIngredients();
});

function renderIngredients(searchTerm = '') {
    ingredientsList.innerHTML = '';

    const filteredIngredients = store.ingredients.filter(ing =>
        ing.name.toLowerCase().includes(searchTerm)
    );

    if (filteredIngredients.length === 0) {
        ingredientsList.innerHTML = `
            <div class="empty-state">
                ${searchTerm ?
                    '<p>No ingredients found matching your search.</p>' :
                    '<p>No ingredients added yet!</p><p>Click "Add Ingredient" to build your ingredients library.</p>'
                }
            </div>
        `;
        return;
    }

    filteredIngredients.forEach(ingredient => {
        const item = document.createElement('div');
        item.className = 'ingredient-item';

        item.innerHTML = `
            <div class="ingredient-info">
                <div class="ingredient-name">${ingredient.name}</div>
                <div class="ingredient-category">${ingredient.category}</div>
            </div>
            <div class="card-actions">
                <button class="icon-btn edit-ingredient" data-id="${ingredient.id}">✏️</button>
                <button class="icon-btn delete-ingredient" data-id="${ingredient.id}">🗑️</button>
            </div>
        `;

        ingredientsList.appendChild(item);
    });

    // Add event listeners
    document.querySelectorAll('.edit-ingredient').forEach(btn => {
        btn.addEventListener('click', () => editIngredient(parseInt(btn.dataset.id)));
    });

    document.querySelectorAll('.delete-ingredient').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this ingredient?')) {
                store.deleteIngredient(parseInt(btn.dataset.id));
                renderIngredients(searchTerm);
            }
        });
    });
}

function editIngredient(id) {
    const ingredient = store.ingredients.find(i => i.id === id);
    if (!ingredient) return;

    currentEditId = id;
    currentEditType = 'ingredient';

    document.getElementById('ingredient-modal-title').textContent = 'Edit Ingredient';
    document.getElementById('ingredient-name').value = ingredient.name;
    document.getElementById('ingredient-category').value = ingredient.category;

    openModal(ingredientModal);
}

// Modal Controls
function openModal(modal) {
    modal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Close modal on background click
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Close modal on close button click
document.querySelectorAll('.close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(btn.closest('.modal'));
    });
});

// Close modal on cancel button click
document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        closeModal(btn.closest('.modal'));
    });
});

// Initial Render
renderMeals();
renderRecipes();
renderIngredients();
