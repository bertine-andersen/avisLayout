const apiKey = 'c31f7ad4-e7f2-4d0d-8a26-24f0a1b8e89f'; 
const endpoint = 'https://content.guardianapis.com/search';

const articlesContainer = document.querySelector('.articles-container');
const articlesList = document.getElementById('articles-list');

let lastFetchedDate = new Date();
let lastFetchedArticles = new Set(); 
let fetching = false; 

async function fetchArticles() {
    if (fetching) return; 
    fetching = true;

    try {
        
        let formattedDate = lastFetchedDate.toISOString().split('T')[0];

        const params = new URLSearchParams({
            'api-key': apiKey,
            'section': 'technology', 
            'page-size': 5, 
            'from-date': formattedDate, 
            'to-date': formattedDate, 
            'show-fields': 'thumbnail',
            'order-by': 'newest' 
        });

        const response = await fetch(`${endpoint}?${params}`);

        if (response.ok) {
            const data = await response.json();
            let articles = data.response.results;

            if (articles.length > 0) {
                // Remove duplicates
                const newArticles = articles.filter(article => !lastFetchedArticles.has(article.id));

                if (newArticles.length > 0) {
                    displayArticles(newArticles);
                    newArticles.forEach(article => lastFetchedArticles.add(article.id));
                }
            } else {
                console.log(`No articles found for ${formattedDate}. Moving to the previous day.`);
            }

            lastFetchedDate.setDate(lastFetchedDate.getDate() - 1);
        } else {
            console.error('Error fetching articles:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        fetching = false;
    }
}

function displayArticles(articles) {
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


lastFetchedDate.setDate(lastFetchedDate.getDate() - 1);
fetchArticles();


articlesContainer.addEventListener('scroll', () => {
    const scrollLeft = articlesContainer.scrollLeft;
    const maxScrollLeft = articlesContainer.scrollWidth - articlesContainer.clientWidth; 
    const scrollPercentage = (scrollLeft / maxScrollLeft) * 100; 

    console.log('Scroll Percentage:', scrollPercentage);


    if (scrollPercentage >= 90 && !fetching) {
        fetchArticles();
    }
});
