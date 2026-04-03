module.exports = function(eleventyConfig) {
  // Kopiowanie plików statycznych
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/CNAME");

  // Kolekcja postów na blogu
  eleventyConfig.addCollection("posts", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
      return b.date - a.date;
    });
  });

  // Filtr formatowania daty
  eleventyConfig.addFilter("dateDisplay", (date) => {
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  });

  // Filtr formatowania daty ISO dla meta tagów
  eleventyConfig.addFilter("isoDate", (date) => {
    if (!date) return '';
    try {
      const d = date instanceof Date ? date : new Date(date);
      if (isNaN(d.getTime())) return '';
      return d.toISOString();
    } catch (e) {
      return '';
    }
  });

  // Filtr limitujący liczbę elementów
  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  // Filtr szacujący czas czytania (średnio 200 słów na minutę)
  eleventyConfig.addFilter("readingTime", (content) => {
    const wordsPerMinute = 200;
    const textOnly = content.replace(/<[^>]*>/g, '');
    const wordCount = textOnly.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  });

  // Filtr pobierający losowe wpisy (dla powiązanych)
  eleventyConfig.addFilter("shuffle", (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Filtr wyciągający wspólne tagi
  eleventyConfig.addFilter("hasCommonTags", (posts, currentTags, currentUrl) => {
    if (!currentTags) return [];
    return posts.filter(post => {
      if (post.url === currentUrl) return false;
      const postTags = post.data.tags || [];
      const commonTags = postTags.filter(tag => currentTags.includes(tag) && tag !== "posts");
      return commonTags.length > 0;
    });
  });

  // Filtr grupujący wpisy po roku
  eleventyConfig.addFilter("groupByYear", (posts) => {
    const grouped = {};
    posts.forEach(post => {
      const year = post.date.getFullYear();
      if (!grouped[year]) grouped[year] = [];
      grouped[year].push(post);
    });
    return grouped;
  });

  // Filtr obcinający tekst do określonej długości (dla meta description)
  eleventyConfig.addFilter("truncate", (text, length = 160) => {
    if (!text || text.length <= length) return text;
    return text.substring(0, length).replace(/\s+\S*$/, '') + '...';
  });

  // Generate Table of Contents from HTML content
  eleventyConfig.addFilter("toc", (content) => {
    if (!content) return [];
    
    const headings = [];
    const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
    let match;
    
    while ((match = regex.exec(content)) !== null) {
      const level = parseInt(match[1]);
      // Strip HTML tags from heading text
      const text = match[2].replace(/<[^>]*>/g, '');
      // Generate ID from text (slugify)
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      
      headings.push({ level, text, id });
    }
    
    return headings;
  });
  
  // Add IDs to headings in content for TOC links
  eleventyConfig.addTransform("addHeadingIds", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) return content;
    
    let counter = {};
    return content.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
      // Strip HTML from text
      const cleanText = text.replace(/<[^>]*>/g, '');
      // Generate base ID
      let baseId = cleanText.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50);
      
      // Handle duplicates
      if (counter[baseId]) {
        counter[baseId]++;
        baseId = `${baseId}-${counter[baseId]}`;
      } else {
        counter[baseId] = 1;
      }
      
      return `<h${level}${attrs} id="${baseId}">${text}</h${level}>`;
    });
  });

  // Transformacja HTML - lazy loading dla obrazków
  eleventyConfig.addTransform("lazyImages", function(content, outputPath) {
    if (!outputPath || !outputPath.endsWith(".html")) {
      return content;
    }

    // Dodaj loading="lazy" dla obrazków bez tego atrybutu
    content = content.replace(/<img(?![^>]*loading=)([^>]*)>/gi, '<img$1 loading="lazy" decoding="async">');
    
    // Dodaj fetchpriority="high" dla pierwszego obrazka powyżej foldu (hero/featured)
    content = content.replace(/<img([^>]*)class="([^"]*)hero([^"]*)"([^>]*)>/i, '<img$1class="$2hero$3"$4 fetchpriority="high">');
    
    return content;
  });

  // Minifikacja HTML w produkcji
  if (process.env.NODE_ENV === 'production') {
    const htmlmin = require("html-minifier");
    eleventyConfig.addTransform("htmlmin", function(content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true,
          minifyJS: true
        });
        return minified;
      }
      return content;
    });
  }

  // Generate search index after build
  const fs = require('fs');
  const path = require('path');
  
  eleventyConfig.on('eleventy.after', async ({ dir, results }) => {
    const documents = [];
    
    // Get all posts from results
    results.forEach(result => {
      if (result.url && result.url.includes('/posts/') && !result.url.endsWith('/posts/')) {
        const content = result.content || '';
        // Extract text content (remove HTML tags, JSON-LD, etc.)
        let textContent = content
          .replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        
        // Try to extract title from HTML content
        let title = '';
        const titleMatch = content.match(/<h1[^>]*class="post-title"[^>]*>(.*?)<\/h1>/i);
        if (titleMatch) {
          title = titleMatch[1].replace(/<[^>]*>/g, '').trim();
        } else {
          // Fallback: extract from title tag
          const pageTitleMatch = content.match(/<title>(.*?)<\/title>/i);
          if (pageTitleMatch) {
            title = pageTitleMatch[1].replace(/\s*\|\s*koryto\.net$/i, '').trim();
          }
        }
        
        // Try to extract date from meta tag or time element
        let date = '';
        const dateMatch = content.match(/<meta[^>]*property="article:published_time"[^>]*content="([^"]*)/i);
        if (dateMatch) {
          date = dateMatch[1];
        }
        
        // Try to extract tags from post-tags links
        let tags = [];
        const tagMatches = content.match(/<a[^>]*class="tag"[^>]*>([^<]+)<\/a>/gi);
        if (tagMatches) {
          tags = tagMatches.map(t => t.replace(/<[^>]*>/g, '').trim());
        }
        
        documents.push({
          id: result.url,
          url: result.url,
          title: title,
          content: textContent,
          excerpt: textContent.substring(0, 200).trim() + (textContent.length > 200 ? '...' : ''),
          date: date,
          tags: tags
        });
      }
    });
    
    // Generate the search index JS file
    const outputDir = dir.output;
    const jsDir = path.join(outputDir, 'assets', 'js');
    
    // Ensure directory exists
    if (!fs.existsSync(jsDir)) {
      fs.mkdirSync(jsDir, { recursive: true });
    }
    
    const searchIndexContent = `// Auto-generated search index
const searchIndexData = ${JSON.stringify({ documents }, null, 2)};`;
    
    fs.writeFileSync(path.join(jsDir, 'search-index.js'), searchIndexContent);
    console.log(`Generated search index with ${documents.length} documents`);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    pathPrefix: "/"
  };
};
