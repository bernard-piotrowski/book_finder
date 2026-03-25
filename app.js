//to toggle the loading spinner
function toggleLoadingSpinner(show) {
    const spinner = document.getElementById('loadingSpinner');
    if(show) {
        spinner.classList.remove('d-none');
    }
    else {
        spinner.classList.add('d-none');
    }
}

//to validate query
function validateQuery(query) {
    const emptyTextAlert = document.getElementById('emptyTextAlert')
    if(query.trim()==""){
        emptyTextAlert.classList.remove('d-none');
    }
    else {
        emptyTextAlert.classList.add('d-none');
    }
}
//to create html for each search result item
function searchResultItem(book){
    const card = document.createElement('div');
    card.className = 'col-12 mb-4';
    card.innerHTML = `
    <div class="card">
        <div class="card-body">
          <h5 class="card-title">${book.title}</h5>
          <p class="card-text">Author: ${book.author_name?.join(', ') || 'Unknown Author'}</p>
          <button class="btn btn-primary btn-sm">View Details</button>
        </div>
      </div>
    `;
    return card;
}

//perform search
function performSearch() {
    const query = document.getElementById('searchInput').value;
    //validates query
    validateQuery(query);
    if(!query){
        return;
    }
    //show the spinner while searching
    toggleLoadingSpinner(true);

    //Fetch
    fetch(`https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&fields=title,cover_i,author_name,first_publish_year,subject,author_key`)
    .then(response => response.json())
    .then(data => {
        const searchResult = document.getElementById('resultsList');
        searchResult.innerHTML = '';
        if(!data.docs || data.docs.length === 0) {
            searchResult.innerHTML = `
            <div class="col-12">
            <p class="text-center">No results found</p>
            </div>
            `;
        } 
        else{
            data.docs.forEach(book => {
                const bookCard = searchResultItem(book);
                searchResult.appendChild(bookCard);

                const viewDetailsButton = bookCard.querySelector('.btn');
                viewDetailsButton.addEventListener('click', () => {
                    const bookDetails = document.getElementById('bookDetails');
                    bookDetails.innerHTML = `
                    <div class="card p-3" >
                        <img class="responsive" src="https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg" alt="${book.title}"/>
                        <h3>${book.title}</h3>
                        <p><strong>Author:</strong> ${book.author_name?.join(', ') || 'Unknown Author'}</p>
                        <p><strong>First Published:</strong> ${book.first_publish_year || 'N/A'}</p>
                        <p class="d-inline-block text-truncate"><strong>Subjects:</strong> ${book.subject?.join(', ') || 'N/A'}</p>
                    </div>
     `
                })
            })
        }

    })
    .catch(() =>{
        const searchResult = document.getElementById('resultsList');
        searchResult.innerHTML = `
      <div class="col-12">
      <p class="text-center text-danger">Error fetching data</p>
      </div>
      `;
    })
    .finally(() => {
        toggleLoadingSpinner(false);
    });
}
//eventListeners for search 
const performSearchButton = document.getElementById('searchButton');
performSearchButton.addEventListener("click", performSearch);
const searchWithEnter = document.getElementById('searchInput');
searchWithEnter.addEventListener("keydown", (event) => {
    if(event.key === "Enter") {
        performSearch();
    }
})
//dark modus
const html = document.documentElement;
const themeSwitch = document.getElementById("modusSwitch")
const savedTheme = localStorage.getItem("theme")

if (savedTheme === "dark"){
    html.setAttribute("data-bs-theme", "dark");
    themeSwitch.checked = true;
} else {
    html.setAttribute("data-bs-theme", "light");
    themeSwitch.checked = false;
}
themeSwitch.addEventListener("change", () => {
    if(themeSwitch.checked){
        html.setAttribute("data-bs-theme", "dark");
    } else {
        html.setAttribute("data-bs-theme", "light");
        localStorage.setItem("theme", "light");
    }
})


