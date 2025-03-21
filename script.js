const apiKey = 'c31f7ad4-e7f2-4d0d-8a26-24f0a1b8e89f'; 
const endpoint = 'https://content.guardianapis.com/search';

const articlesContainer = document.querySelector('.articles-container');


async function fetchArticles() {
    try {
        const params = new URLSearchParams({
            'api-key': apiKey,
            'section': 'technology', 
            'page-size': 1, 
            'show-fields': 'thumbnail'
        });

        const response = await fetch(`${endpoint}?${params}`);

        if (response.ok) {
            const data = await response.json();
            
            console.log('Articles:', data.response.results);

            if (data.response && data.response.results) {
                displayArticles(data.response.results);
            } else {
                console.error('No articles found');
            }
        } else {
            console.error('Error fetching articles:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayArticles(articles) {
    const articlesList = document.getElementById('articles-list');

    

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article'); 
        const imageUrl = article.fields?.thumbnail || 'https://via.placeholder.com/300';
        
        articleDiv.innerHTML = `
            <img src="${imageUrl}" alt="Article Image" class="article-image">
            <h2><a href="${article.webUrl}" target="_blank">${article.webTitle}</a></h2>
            <p>Published on: ${new Date(article.webPublicationDate).toLocaleDateString()}</p>
            
        `;
        
        

        articlesList.appendChild(articleDiv);
    });
}

articlesContainer.addEventListener('scroll', () => {
    const scrollLeft = articlesContainer.scrollLeft;
    const maxScrollLeft = articlesContainer.scrollWidth - articlesContainer.clientWidth; 
    const scrollPercentage = (scrollLeft / maxScrollLeft) * 100; 

    console.log('Scroll Percentage:', scrollPercentage);

    if (scrollPercentage === 100) {
        fetchArticles();
    }
});


for (let i = 0; i < 5; i++) {
    fetchArticles();
}
