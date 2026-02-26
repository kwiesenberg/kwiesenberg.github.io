fetch("/blog/posts.json")
  .then(r => r.json())
  .then(posts => {

    if (!posts.length) return;

    const latest = posts
      .slice()
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    const container = document.getElementById("latest-post");
    if (!container) return;

    container.innerHTML = `
      <a href="/blog/${latest.slug}/" class="latest-post-box">

        <img src="${latest.image}" alt="${latest.title}">

        <h3>${latest.title}</h3>

        <p class="latest-excerpt">
          ${latest.excerpt}
          <span class="read-more">Read more →</span>
        </p>

      </a>
    `;
  });
