const API_SEARCH = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
const API_LOOKUP = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=';

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const recipesContainer = document.getElementById('recipesContainer');
const recipeModal = document.getElementById('recipeModal');
const modalContent = document.getElementById('modalContent');
const closeModalBtn = document.getElementById('closeModal');

// Fetch default recipes on page load
window.addEventListener('DOMContentLoaded', () => {
  fetchRecipes('');
});

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  fetchRecipes(query);
});

async function fetchRecipes(query) {
  const res = await fetch(`${API_SEARCH}${query}`);
  const data = await res.json();
  recipesContainer.innerHTML = '';

  if (data.meals) {
    data.meals.forEach(meal => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <div class="overflow-hidden rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 bg-white flex flex-col h-full">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="h-48 w-full object-cover"/>
          <div class="p-4 flex-1 flex flex-col">
            <h3 class="text-xl font-semibold text-gray-800 mb-2 line-clamp-1">${meal.strMeal}</h3>
            <p class="text-gray-600 text-sm mb-4 line-clamp-3">${meal.strInstructions.slice(0, 150)}...</p>
            <button 
              class="mt-auto inline-block bg-emerald-500 text-white text-sm px-4 py-2 rounded-md hover:bg-emerald-600 transition"
              onclick="showDetails('${meal.idMeal}')">
              🍽️ View Recipe
            </button>
          </div>
        </div>
      `;
      recipesContainer.appendChild(card);
    });
  } else {
    recipesContainer.innerHTML = `<p class="text-center text-gray-600 col-span-full">No recipes found.</p>`;
  }
}

async function showDetails(id) {
  const res = await fetch(`${API_LOOKUP}${id}`);
  const data = await res.json();
  const meal = data.meals[0];

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push(` ${ingredient.trim()} ${measure?.trim() || ''}`);
    }
  }

  const youtube = meal.strYoutube ? `
    <p><strong>YouTube:</strong> 
      <a href="${meal.strYoutube}" target="_blank" class="text-blue-600 underline">Watch Video</a>
    </p>` : '';

  const source = meal.strSource ? `
    <p><strong>Source:</strong> 
      <a href="${meal.strSource}" target="_blank" class="text-blue-600 underline">Recipe Source</a>
    </p>` : '';

  const tags = meal.strTags ? `
    <p><strong>Tags:</strong> ${meal.strTags}</p>` : '';

  modalContent.innerHTML = `
    <h2 class="text-2xl font-bold text-gray-800 mb-4">${meal.strMeal}</h2>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class=" h-64  rounded-lg mb-6" />
    <div class="text-gray-700 space-y-4 text-sm leading-relaxed">
      <p><strong class="text-gray-800">Category:</strong> ${meal.strCategory}</p>
      <p><strong class="text-gray-800">Origin Area:</strong> ${meal.strArea}</p>
      <p><strong class="text-gray-800">Ingredients:</strong> ${ingredients}</p>
      <p><strong class="text-gray-800">Instructions: </strong>${meal.strInstructions}</p>
      
      <p> ${youtube}</p>
      <p> ${source}</p>
      
      
    </div>
  `;

  recipeModal.classList.remove('hidden');
  recipeModal.classList.add('flex');
}

function closeModal() {
  recipeModal.classList.add('hidden');
  recipeModal.classList.remove('flex');
}

closeModalBtn.addEventListener('click', closeModal);

// Optional: Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === recipeModal) {
    closeModal();
  }
});

// Optional: Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
