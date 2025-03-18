const apiKey = 'c31f7ad4-e7f2-4d0d-8a26-24f0a1b8e89f'; 
const endpoint = 'https://content.guardianapis.com/search';

async function fetchArticles() {
    try {
        const params = new URLSearchParams({
            'api-key': apiKey,
            'section': 'technology', 
            'page-size': 5, 
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
    const articlesList = document.getElementById('container');

    

    articles.forEach(article => {
        const articleDiv = document.createElement('div');
        articleDiv.classList.add('article'); 
        
        articleDiv.innerHTML = `
            <h2><a href="${article.webUrl}" target="_blank">${article.webTitle}</a></h2>
            <p>Published on: ${new Date(article.webPublicationDate).toLocaleDateString()}</p>
        `;
        

        articlesList.appendChild(articleDiv);
    });
}

fetchArticles();
