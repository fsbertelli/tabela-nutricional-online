const searchBtn = document.getElementById('search-btn');
const foodInput = document.getElementById('food-input');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', searchFood);

async function searchFood() {
    const food = foodInput.value;
    if (!food) return;

    resultsDiv.innerHTML = '<p>Carregando...</p>';

    try {
        const url = `https://world.openfoodfacts.net/api/v2/search?categories_tags_pt=${encodeURIComponent(food)}&fields=product_name,nutriments,nutrition_grades&json=true`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.count === 0) {
            resultsDiv.innerHTML = '<p>Nenhum resultado encontrado.</p>';
            return;
        }

        displayResults(data.products);
    } catch (error) {
        console.error('Erro ao buscar dados:', error);
        resultsDiv.innerHTML = `<p>Erro ao buscar informações: ${error.message}</p>`;
    }
}

function displayResults(products) {
    let html = '<h2>Resultados:</h2>';
    products.forEach(product => {
        html += `
            <div class="food-item">
                <h3>${product.product_name}</h3>
                <p><strong>Calorias:</strong> ${product.nutriments['energy-kcal_100g'] || 'N/A'} kcal/100g</p>
                <p><strong>Proteínas:</strong> ${product.nutriments.proteins_100g || 'N/A'} g/100g</p>
                <p><strong>Carboidratos:</strong> ${product.nutriments.carbohydrates_100g || 'N/A'} g/100g</p>
                <p><strong>Gorduras:</strong> ${product.nutriments.fat_100g || 'N/A'} g/100g</p>
                <p><strong>Nota Nutri-Score:</strong> ${product.nutrition_grades || 'N/A'}</p>
            </div>
        `;
    });

    resultsDiv.innerHTML = html;
}
