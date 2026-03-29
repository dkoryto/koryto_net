module.exports = function(eleventyConfig) {
  // Kopiowanie plików statycznych
  eleventyConfig.addPassthroughCopy("src/assets/css");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");

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
    return date.toISOString();
  });

  // Filtr limitujący liczbę elementów
  eleventyConfig.addFilter("limit", (array, limit) => {
    return array.slice(0, limit);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    pathPrefix: "/koryto_net/"
  };
};
