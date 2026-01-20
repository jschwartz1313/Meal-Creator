# Meal Creator

A beautiful, interactive web application for tracking your favorite meals, designing custom recipes, and managing ingredients.

**🌐 Live Site:** [https://jschwartz1313.github.io/Meal-Creator/](https://jschwartz1313.github.io/Meal-Creator/)

## Features

### 🍽️ Meal Tracking
- Add and track your favorite meals
- Rate meals with a 5-star system
- Categorize meals (Breakfast, Lunch, Dinner, Snack, Dessert)
- Mark meals as favorites with star icon
- Duplicate meals with one click
- Filter by category, rating, and favorites
- Sort by name, rating, or date added
- Add personal notes, tags, and nutritional information
- Upload photos for meals
- Edit and delete meals

### 📝 Recipe Management
- Create detailed recipes with ingredients and instructions
- Track prep time and cook time
- Specify number of servings
- **Scale recipes**: Adjust servings and automatically recalculate ingredient quantities
- **Print recipes**: Print-friendly formatted view
- Mark recipes as favorites
- Duplicate recipes instantly
- Manage ingredient quantities for each recipe
- Add photos, tags, and nutritional information per serving
- Edit and delete recipes

### 🥕 Ingredients Library
- Build a comprehensive ingredients library
- Categorize ingredients (Produce, Protein, Dairy, Grains, Spices, Condiments, Other)
- Search through your ingredients
- Mark ingredients as required or optional in meals
- Edit and delete ingredients

### 📅 Meal Planning
- Weekly meal planner with calendar view
- Drag and drop meals/recipes to days
- Plan breakfast, lunch, and dinner for each day
- Navigate between weeks
- Generate shopping lists from meal plans

### 🛒 Shopping List
- Auto-generate shopping lists from meal planner
- Organize ingredients with quantity counts
- Check off items as you shop
- Clear list when done

### 🌙 Dark Mode
- Toggle between light and dark themes
- Smooth transitions
- Preference persists across sessions
- Easy-access toggle in header

### 💾 Data Management
- All data is saved automatically to your browser's local storage
- Export data as JSON backup
- Import data from backup files
- Your data persists between sessions
- No server or account required

## Getting Started

### Online (Recommended)
Visit the live site at [https://jschwartz1313.github.io/Meal-Creator/](https://jschwartz1313.github.io/Meal-Creator/)

### Local Development
1. Clone this repository
2. Open [index.html](index.html) in a web browser
3. Start tracking your meals, creating recipes, or adding ingredients
4. Your data will be automatically saved

## Usage

### Adding a Meal
1. Click the "Add Meal" button in the "My Meals" tab
2. Enter the meal name, select a category, rate it, and add notes
3. Click "Save Meal"

### Creating a Recipe
1. Navigate to the "Recipes" tab
2. Click "Create Recipe"
3. Fill in recipe details including name, servings, and timing
4. Add ingredients with quantities
5. Write the instructions
6. Click "Save Recipe"

### Managing Ingredients
1. Go to the "Ingredients" tab
2. Click "Add Ingredient"
3. Enter the ingredient name and category
4. Click "Save Ingredient"
5. Use the search box to filter ingredients

## Technologies Used

- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- LocalStorage API

## Browser Compatibility

Works on all modern browsers that support:
- ES6 JavaScript
- CSS Grid
- LocalStorage API

## File Structure

- `index.html` - Main HTML structure
- `styles.css` - All styling and responsive design
- `app.js` - Application logic and data management