document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  // Check if index data is loaded
  if (typeof searchIndexData === 'undefined') {
    searchResults.innerHTML = '<p class="search-error">Błąd ładowania indeksu wyszukiwania. Spróbuj odświeżyć stronę.</p>';
    return;
  }
  
  // Build Lunr index
  let idx;
  try {
    idx = lunr(function() {
      this.ref('id');
      this.field('title', { boost: 10 });
      this.field('content', { boost: 1 });
      this.field('tags', { boost: 5 });
      
      searchIndexData.documents.forEach(function(doc) {
        this.add(doc);
      }, this);
    });
  } catch (e) {
    console.error('Error building search index:', e);
    searchResults.innerHTML = '<p class="search-error">Błąd budowania indeksu wyszukiwania.</p>';
    return;
  }
  
  // Search function
  function performSearch(query) {
    if (!query || query.length < 3) {
      searchResults.innerHTML = '<p class="search-hint">Wpisz przynajmniej 3 znaki aby rozpocząć wyszukiwanie</p>';
      return;
    }
    
    searchResults.innerHTML = '<p class="search-loading">Wyszukiwanie...</p>';
    
    // Use setTimeout to allow UI to update
    setTimeout(function() {
      try {
        const results = idx.search(query);
        displayResults(results, query);
      } catch (e) {
        console.error('Search error:', e);
        searchResults.innerHTML = '<p class="search-error">Błąd podczas wyszukiwania. Spróbuj innej frazy.</p>';
      }
    }, 10);
  }
  
  // Display results
  function displayResults(results, query) {
    if (results.length === 0) {
      searchResults.innerHTML = `<p class="search-no-results">Nie znaleziono wyników dla "<strong>${escapeHtml(query)}</strong>"</p>`;
      return;
    }
    
    let html = `<p class="search-count">Znaleziono ${results.length} wynik${results.length === 1 ? '' : results.length < 5 ? 'y' : 'ów'} dla "<strong>${escapeHtml(query)}</strong>"</p>`;
    html += '<ul class="search-results-list">';
    
    results.forEach(function(result) {
      const doc = searchIndexData.documents.find(d => d.id === result.ref);
      if (!doc) return;
      
      const excerpt = doc.excerpt || doc.content.substring(0, 150).replace(/<[^>]*>/g, '') + '...';
      
      html += `
        <li class="search-result-item">
          <article class="search-result">
            <h2 class="search-result-title">
              <a href="${doc.url}">${highlightQuery(doc.title, query)}</a>
            </h2>
            <p class="search-result-excerpt">${escapeHtml(excerpt)}</p>
            <div class="search-result-meta">
              <time datetime="${doc.date}">${formatDate(doc.date)}</time>
              ${doc.tags ? `<span class="search-result-tags">${doc.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</span>` : ''}
            </div>
          </article>
        </li>
      `;
    });
    
    html += '</ul>';
    searchResults.innerHTML = html;
  }
  
  // Helper functions
  function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function highlightQuery(text, query) {
    if (!text || !query) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark>$1</mark>');
  }
  
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
  
  function formatDate(dateStr) {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  }
  
  // Event listeners
  let debounceTimer;
  searchInput.addEventListener('input', function(e) {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function() {
      performSearch(e.target.value.trim());
    }, 300);
  });
  
  // Check for query param on load
  const urlParams = new URLSearchParams(window.location.search);
  const queryParam = urlParams.get('q');
  if (queryParam) {
    searchInput.value = queryParam;
    performSearch(queryParam);
  }
  
  // Focus input
  searchInput.focus();
});
