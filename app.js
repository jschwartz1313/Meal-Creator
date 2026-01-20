// Data Storage
class DataStore {
    constructor() {
        this.meals = this.loadData('meals') || [];
        this.recipes = this.loadData('recipes') || [];
        this.ingredients = this.loadData('ingredients') || [];
        this.mealPlan = this.loadData('mealPlan') || {};
        this.shoppingList = this.loadData('shoppingList') || [];
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

    // Meal Plan methods
    addToMealPlan(date, mealType, item) {
        const key = `${date}-${mealType}`;
        this.mealPlan[key] = item;
        this.saveData('mealPlan', this.mealPlan);
    }

    removeFromMealPlan(date, mealType) {
        const key = `${date}-${mealType}`;
        delete this.mealPlan[key];
        this.saveData('mealPlan', this.mealPlan);
    }

    getMealPlanForDate(date) {
        const meals = {};
        ['breakfast', 'lunch', 'dinner'].forEach(type => {
            const key = `${date}-${type}`;
            if (this.mealPlan[key]) {
                meals[type] = this.mealPlan[key];
            }
        });
        return meals;
    }

    // Shopping List methods
    updateShoppingList(items) {
        this.shoppingList = items;
        this.saveData('shoppingList', this.shoppingList);
    }

    // Export/Import
    exportData() {
        return JSON.stringify({
            meals: this.meals,
            recipes: this.recipes,
            ingredients: this.ingredients,
            mealPlan: this.mealPlan,
            shoppingList: this.shoppingList,
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            this.meals = data.meals || [];
            this.recipes = data.recipes || [];
            this.ingredients = data.ingredients || [];
            this.mealPlan = data.mealPlan || {};
            this.shoppingList = data.shoppingList || [];

            this.saveData('meals', this.meals);
            this.saveData('recipes', this.recipes);
            this.saveData('ingredients', this.ingredients);
            this.saveData('mealPlan', this.mealPlan);
            this.saveData('shoppingList', this.shoppingList);

            return true;
        } catch (error) {
            console.error('Import error:', error);
            return false;
        }
    }
}

// Initialize
const store = new DataStore();
let currentEditId = null;
let currentEditType = null;
let mealIngredients = [];

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
const mealIngredientsList = document.getElementById('meal-ingredients-list');
const addMealIngredientBtn = document.getElementById('add-meal-ingredient-btn');

addMealBtn.addEventListener('click', () => {
    currentEditId = null;
    currentEditType = 'meal';
    mealIngredients = [];
    document.getElementById('meal-modal-title').textContent = 'Add Meal';
    mealForm.reset();
    document.getElementById('meal-rating').value = '0';
    updateStarRating(0);
    renderMealIngredients();
    openModal(mealModal);
});

addMealIngredientBtn.addEventListener('click', () => {
    mealIngredients.push({ name: '', required: 'required' });
    renderMealIngredients();
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

function renderMealIngredients() {
    mealIngredientsList.innerHTML = '';

    mealIngredients.forEach((ingredient, index) => {
        const row = document.createElement('div');
        row.className = 'meal-ingredient-row';
        const ingredientName = typeof ingredient === 'string' ? ingredient : ingredient.name;
        const ingredientRequired = typeof ingredient === 'string' ? 'required' : ingredient.required;

        row.innerHTML = `
            <input type="text" placeholder="Ingredient name" value="${ingredientName}" data-index="${index}" class="meal-ingredient-input">
            <select data-index="${index}" class="meal-ingredient-required">
                <option value="required" ${ingredientRequired === 'required' ? 'selected' : ''}>Required</option>
                <option value="optional" ${ingredientRequired === 'optional' ? 'selected' : ''}>Optional</option>
            </select>
            <button type="button" class="remove-ingredient-btn" data-index="${index}">×</button>
        `;
        mealIngredientsList.appendChild(row);
    });

    // Add event listeners
    document.querySelectorAll('.meal-ingredient-input').forEach(input => {
        input.addEventListener('input', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (typeof mealIngredients[index] === 'string') {
                mealIngredients[index] = { name: e.target.value, required: 'required' };
            } else {
                mealIngredients[index].name = e.target.value;
            }
        });
    });

    document.querySelectorAll('.meal-ingredient-required').forEach(select => {
        select.addEventListener('change', (e) => {
            const index = parseInt(e.target.dataset.index);
            if (typeof mealIngredients[index] === 'string') {
                mealIngredients[index] = { name: mealIngredients[index], required: e.target.value };
            } else {
                mealIngredients[index].required = e.target.value;
            }
        });
    });

    document.querySelectorAll('.meal-ingredient-row .remove-ingredient-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = parseInt(e.target.dataset.index);
            mealIngredients.splice(index, 1);
            renderMealIngredients();
        });
    });
}

mealForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const photoInput = document.getElementById('meal-photo');
    const photo = photoInput.files[0] ? await handlePhotoUpload(photoInput, 'meal-photo-preview') : (currentEditId ? store.meals.find(m => m.id === currentEditId)?.photo : null);

    const tags = document.getElementById('meal-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

    const nutrition = {
        calories: parseInt(document.getElementById('meal-calories').value) || null,
        protein: parseFloat(document.getElementById('meal-protein').value) || null,
        carbs: parseFloat(document.getElementById('meal-carbs').value) || null,
        fat: parseFloat(document.getElementById('meal-fat').value) || null
    };

    const mealData = {
        name: document.getElementById('meal-name').value,
        category: document.getElementById('meal-category').value,
        rating: parseInt(document.getElementById('meal-rating').value),
        ingredients: mealIngredients.filter(ing => {
            const name = typeof ing === 'string' ? ing : ing.name;
            return name.trim() !== '';
        }),
        photo: photo,
        tags: tags,
        nutrition: nutrition,
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

    // Apply filters
    let filteredMeals = store.meals.filter(meal => {
        const matchesSearch = !mealFilters.search ||
            meal.name.toLowerCase().includes(mealFilters.search) ||
            (meal.tags && meal.tags.some(tag => tag.toLowerCase().includes(mealFilters.search)));

        const matchesCategory = !mealFilters.category || meal.category === mealFilters.category;

        const matchesRating = !mealFilters.rating || meal.rating >= parseInt(mealFilters.rating);

        return matchesSearch && matchesCategory && matchesRating;
    });

    if (filteredMeals.length === 0) {
        mealsList.innerHTML = `
            <div class="empty-state">
                <p>No meals found!</p>
                <p>${store.meals.length === 0 ? 'Click "Add Meal" to start tracking your favorite meals.' : 'Try adjusting your filters.'}</p>
            </div>
        `;
        return;
    }

    filteredMeals.forEach(meal => {
        const card = document.createElement('div');
        card.className = 'card';

        const stars = '★'.repeat(meal.rating) + '☆'.repeat(5 - meal.rating);

        const ingredientsHTML = meal.ingredients && meal.ingredients.length > 0 ? `
            <div class="recipe-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                    ${meal.ingredients.map(ing => {
                        const name = typeof ing === 'string' ? ing : ing.name;
                        const required = typeof ing === 'string' ? 'required' : ing.required;
                        const badge = required === 'optional' ? ' <span class="optional-badge">(optional)</span>' : '';
                        return `<li>${name}${badge}</li>`;
                    }).join('')}
                </ul>
            </div>
        ` : '';

        const tagsHTML = meal.tags && meal.tags.length > 0 ? `
            <div class="tags-container">
                ${meal.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        ` : '';

        const nutritionHTML = meal.nutrition && (meal.nutrition.calories || meal.nutrition.protein || meal.nutrition.carbs || meal.nutrition.fat) ? `
            <div class="nutrition-info">
                ${meal.nutrition.calories ? `<span>🔥 ${meal.nutrition.calories} cal</span>` : ''}
                ${meal.nutrition.protein ? `<span>💪 ${meal.nutrition.protein}g protein</span>` : ''}
                ${meal.nutrition.carbs ? `<span>🌾 ${meal.nutrition.carbs}g carbs</span>` : ''}
                ${meal.nutrition.fat ? `<span>🥑 ${meal.nutrition.fat}g fat</span>` : ''}
            </div>
        ` : '';

        card.innerHTML = `
            ${meal.photo ? `<img src="${meal.photo}" class="card-photo" alt="${meal.name}">` : ''}
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
            ${tagsHTML}
            ${nutritionHTML}
            ${ingredientsHTML}
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
    mealIngredients = meal.ingredients ? [...meal.ingredients] : [];

    document.getElementById('meal-modal-title').textContent = 'Edit Meal';
    document.getElementById('meal-name').value = meal.name;
    document.getElementById('meal-category').value = meal.category;
    document.getElementById('meal-rating').value = meal.rating;
    document.getElementById('meal-tags').value = meal.tags ? meal.tags.join(', ') : '';
    document.getElementById('meal-calories').value = meal.nutrition?.calories || '';
    document.getElementById('meal-protein').value = meal.nutrition?.protein || '';
    document.getElementById('meal-carbs').value = meal.nutrition?.carbs || '';
    document.getElementById('meal-fat').value = meal.nutrition?.fat || '';
    document.getElementById('meal-notes').value = meal.notes || '';

    if (meal.photo) {
        document.getElementById('meal-photo-preview').innerHTML = `<img src="${meal.photo}" alt="Preview">`;
    } else {
        document.getElementById('meal-photo-preview').innerHTML = '';
    }

    updateStarRating(meal.rating);
    renderMealIngredients();

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

recipeForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const photoInput = document.getElementById('recipe-photo');
    const photo = photoInput.files[0] ? await handlePhotoUpload(photoInput, 'recipe-photo-preview') : (currentEditId ? store.recipes.find(r => r.id === currentEditId)?.photo : null);

    const tags = document.getElementById('recipe-tags').value
        .split(',')
        .map(t => t.trim())
        .filter(t => t !== '');

    const nutrition = {
        calories: parseInt(document.getElementById('recipe-calories').value) || null,
        protein: parseFloat(document.getElementById('recipe-protein').value) || null,
        carbs: parseFloat(document.getElementById('recipe-carbs').value) || null,
        fat: parseFloat(document.getElementById('recipe-fat').value) || null
    };

    const recipeData = {
        name: document.getElementById('recipe-name').value,
        servings: parseInt(document.getElementById('recipe-servings').value),
        prepTime: parseInt(document.getElementById('recipe-prep-time').value),
        cookTime: parseInt(document.getElementById('recipe-cook-time').value),
        ingredients: recipeIngredients.filter(ing => ing.name.trim() !== ''),
        instructions: document.getElementById('recipe-instructions').value,
        photo: photo,
        tags: tags,
        nutrition: nutrition
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

// Export/Import Functionality
const exportDataBtn = document.getElementById('export-data-btn');
const importDataBtn = document.getElementById('import-data-btn');
const importFileInput = document.getElementById('import-file-input');

exportDataBtn.addEventListener('click', () => {
    const data = store.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-creator-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

importDataBtn.addEventListener('click', () => {
    importFileInput.click();
});

importFileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const success = store.importData(event.target.result);
            if (success) {
                alert('Data imported successfully!');
                renderMeals();
                renderRecipes();
                renderIngredients();
            } else {
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    }
});

// Search and Filter for Meals
const mealSearch = document.getElementById('meal-search');
const mealFilterCategory = document.getElementById('meal-filter-category');
const mealFilterRating = document.getElementById('meal-filter-rating');

let mealFilters = {
    search: '',
    category: '',
    rating: ''
};

mealSearch.addEventListener('input', (e) => {
    mealFilters.search = e.target.value.toLowerCase();
    renderMeals();
});

mealFilterCategory.addEventListener('change', (e) => {
    mealFilters.category = e.target.value;
    renderMeals();
});

mealFilterRating.addEventListener('change', (e) => {
    mealFilters.rating = e.target.value;
    renderMeals();
});

// Photo Upload Handling
function handlePhotoUpload(input, previewId) {
    return new Promise((resolve) => {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const preview = document.getElementById(previewId);
                preview.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
                resolve(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            resolve(null);
        }
    });
}

document.getElementById('meal-photo').addEventListener('change', (e) => {
    handlePhotoUpload(e.target, 'meal-photo-preview');
});

document.getElementById('recipe-photo').addEventListener('change', (e) => {
    handlePhotoUpload(e.target, 'recipe-photo-preview');
});

// Meal Planner
let currentPlannerWeek = new Date();

function renderMealPlanner() {
    const plannerGrid = document.getElementById('meal-planner-grid');
    const weekDisplay = document.getElementById('current-week-display');

    const startOfWeek = new Date(currentPlannerWeek);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    weekDisplay.textContent = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;

    plannerGrid.innerHTML = '';

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(currentDay.getDate() + i);
        const dateStr = currentDay.toISOString().split('T')[0];

        const dayDiv = document.createElement('div');
        dayDiv.className = 'planner-day';

        const meals = store.getMealPlanForDate(dateStr);

        dayDiv.innerHTML = `
            <div class="planner-day-header">
                ${days[i]}
                <span class="planner-day-date">${currentDay.getDate()}</span>
            </div>
            ${['breakfast', 'lunch', 'dinner'].map(type => `
                <div class="planner-meal-slot ${meals[type] ? '' : 'empty'}" data-date="${dateStr}" data-type="${type}">
                    ${meals[type] ? `
                        <div class="planner-meal-name">${meals[type].name}</div>
                        <div class="planner-meal-type">${type}</div>
                    ` : `+ Add ${type}`}
                </div>
            `).join('')}
        `;

        plannerGrid.appendChild(dayDiv);
    }

    // Add click listeners to meal slots
    document.querySelectorAll('.planner-meal-slot').forEach(slot => {
        slot.addEventListener('click', (e) => {
            const date = e.currentTarget.dataset.date;
            const type = e.currentTarget.dataset.type;
            showPlannerModal(date, type);
        });
    });
}

function showPlannerModal(date, mealType) {
    const modal = document.getElementById('planner-modal');
    const content = document.getElementById('planner-meal-select');

    const allItems = [
        ...store.meals.map(m => ({ ...m, type: 'meal' })),
        ...store.recipes.map(r => ({ ...r, type: 'recipe' }))
    ];

    content.innerHTML = `
        <div class="planner-modal-list">
            ${allItems.map(item => `
                <div class="planner-modal-item" data-id="${item.id}" data-type="${item.type}">
                    ${item.name}
                </div>
            `).join('')}
            <div class="planner-modal-item remove" data-remove="true">❌ Remove meal</div>
        </div>
    `;

    document.querySelectorAll('.planner-modal-item').forEach(item => {
        item.addEventListener('click', () => {
            if (item.dataset.remove) {
                store.removeFromMealPlan(date, mealType);
            } else {
                const itemData = allItems.find(i => i.id == item.dataset.id);
                store.addToMealPlan(date, mealType, itemData);
            }
            renderMealPlanner();
            closeModal(modal);
        });
    });

    openModal(modal);
}

document.getElementById('prev-week-btn').addEventListener('click', () => {
    currentPlannerWeek.setDate(currentPlannerWeek.getDate() - 7);
    renderMealPlanner();
});

document.getElementById('next-week-btn').addEventListener('click', () => {
    currentPlannerWeek.setDate(currentPlannerWeek.getDate() + 7);
    renderMealPlanner();
});

// Shopping List
function generateShoppingList() {
    const ingredients = {};

    Object.entries(store.mealPlan).forEach(([key, item]) => {
        if (item.ingredients && Array.isArray(item.ingredients)) {
            item.ingredients.forEach(ing => {
                const name = typeof ing === 'string' ? ing : ing.name;
                if (name && name.trim()) {
                    if (!ingredients[name]) {
                        ingredients[name] = { name, count: 1, checked: false };
                    } else {
                        ingredients[name].count++;
                    }
                }
            });
        }
    });

    const shoppingList = Object.values(ingredients);
    store.updateShoppingList(shoppingList);
    renderShoppingList();
}

function renderShoppingList() {
    const container = document.getElementById('shopping-list-container');

    if (store.shoppingList.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No items in shopping list</p>
                <p>Click "Generate from Planner" to create a shopping list from your meal plan.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="shopping-category">
            <h3>Shopping List</h3>
            ${store.shoppingList.map((item, index) => `
                <div class="shopping-item ${item.checked ? 'checked' : ''}">
                    <input type="checkbox" id="shop-${index}" ${item.checked ? 'checked' : ''} onchange="toggleShoppingItem(${index})">
                    <label for="shop-${index}">${item.name}${item.count > 1 ? ` (×${item.count})` : ''}</label>
                </div>
            `).join('')}
        </div>
    `;
}

window.toggleShoppingItem = function(index) {
    store.shoppingList[index].checked = !store.shoppingList[index].checked;
    store.updateShoppingList(store.shoppingList);
    renderShoppingList();
};

document.getElementById('generate-shopping-list-btn').addEventListener('click', generateShoppingList);

document.getElementById('clear-shopping-list-btn').addEventListener('click', () => {
    if (confirm('Clear entire shopping list?')) {
        store.updateShoppingList([]);
        renderShoppingList();
    }
});

// Initial Render
renderMeals();
renderRecipes();
renderIngredients();
renderMealPlanner();
renderShoppingList();
