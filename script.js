const apiKey = 'c31f7ad4-e7f2-4d0d-8a26-24f0a1b8e89f';
const endpoint = 'https://content.guardianapis.com/search';

const articlesContainer = document.querySelector('.articles-container');
const articlesList = document.getElementById('articles-list');

let lastFetchedDate = new Date();
let lastFetchedArticles = new Set();
let error = false;
let fetching = false;
let loaded = 0;
const maxLoadingAllowed = 10; 

async function fetchArticles(initialLoad = false) {
    if (fetching) {
        console.log('Already fetching articles, skipping request.');
        return;
    }
    fetching = true;

    if (loaded >= maxLoadingAllowed) {
        
        console.warn('Maximum article load limit reached. Displaying error message.');
        if(!error){
            displayErrorMessage();
            error = true;

        }
        fetching = false;
        return;
    }

    try {
        let fetchedArticles = [];

        while (fetchedArticles.length < (initialLoad ? 5 : 1)) {
            let formattedDate = lastFetchedDate.toISOString().split('T')[0];
            console.log(`Attempting to fetch articles for date: ${formattedDate}`);

            const params = new URLSearchParams({
                'api-key': apiKey,
                'section': 'technology',
                'page-size': 1,
                'from-date': formattedDate,
                'to-date': formattedDate,
                'show-fields': 'thumbnail',
                'order-by': 'newest'
            });

            const response = await fetch(`${endpoint}?${params}`);
            console.log(`API Response Status: ${response.status}`);

            if (response.ok) {
                const data = await response.json();
                let articles = data.response.results;
                console.log(`Fetched ${articles.length} articles for ${formattedDate}.`);

                if (articles.length > 0) {
                    const newArticles = articles.filter(article => !lastFetchedArticles.has(article.id));
                    console.log(`New articles found: ${newArticles.length}`);

                    if (newArticles.length > 0) {
                        fetchedArticles.push(...newArticles);
                        newArticles.forEach(article => lastFetchedArticles.add(article.id));
                    }
                } else {
                    console.log(`No articles found for ${formattedDate}. Moving to the previous day.`);
                }

                lastFetchedDate.setDate(lastFetchedDate.getDate() - 1);
            } else {
                console.error('Error fetching articles:', response.status, response.statusText);
                break;
            }
        }

        if (fetchedArticles.length > 0) {
            console.log(`Displaying ${fetchedArticles.length} articles.`);
            loaded += fetchedArticles.length;
            displayArticles(fetchedArticles);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        fetching = false;
        console.log('Fetching process completed. Ready for next request.');
    }
}

function displayArticles(articles) {
    console.log(`Displaying ${articles.length} articles.`);
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

function displayErrorMessage() {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');

    articleDiv.innerHTML = `
        <h2>Error 404: Rate Limit Reached</h2>
        <p>You have reached the maximum number of articles that can be loaded at the moment.</p>
    `;

    articlesList.appendChild(articleDiv);
}


fetchArticles(true);

articlesContainer.addEventListener('scroll', () => {
    const scrollLeft = articlesContainer.scrollLeft;
    const maxScrollLeft = articlesContainer.scrollWidth - articlesContainer.clientWidth; 
    const scrollPercentage = (scrollLeft / maxScrollLeft) * 100; 


    if (scrollPercentage >= 50 && !fetching && !error) {
        fetchArticles();
    }
});
