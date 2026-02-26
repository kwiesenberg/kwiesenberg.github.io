const POSTS_PER_PAGE = 9;

let allPosts = [];
let filteredPosts = [];
let currentPage = 1;

fetch("/blog/posts.json")
  .then(r => r.json())
  .then(data => {
    allPosts = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    filteredPosts = allPosts;
    render();
    buildFeatured();
    buildArchive();
  });

function render() {
  const grid = document.getElementById("post-grid");
  if (!grid) return;
  grid.innerHTML = "";

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  pagePosts.forEach(post => {
    const card = document.createElement("a");
    card.className = "post-card";
    card.href = `/blog/${post.slug}/`;

    card.innerHTML = `
      <img src="${post.image}" alt="">
      <h3>${post.title}</h3>
    `;

    grid.appendChild(card);
  });

const pageInfo = document.getElementById("page-info");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");

const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

if (pageInfo) {
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

if (prevBtn && nextBtn) {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");

if (prevBtn && nextBtn) {

  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      render();
    }
  };

  nextBtn.onclick = () => {
    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    if (currentPage < totalPages) {
      currentPage++;
      render();
    }
  };

}

function buildFeatured() {
  const ul = document.getElementById("featured-list");
  ul.innerHTML = "";

  allPosts.filter(p => p.featured).forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="/blog/${p.slug}/">${p.title}</a>`;
    ul.appendChild(li);
  });
}

function buildArchive() {
  const container = document.getElementById("archive");
  container.innerHTML = "";

  const groups = {};

  allPosts.forEach(p => {
    const year = new Date(p.date).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(p);
  });

  Object.keys(groups)
    .sort((a, b) => b - a)
    .forEach(year => {
      const details = document.createElement("details");
      const summary = document.createElement("summary");

      summary.textContent = `${year} (${groups[year].length})`;
      details.appendChild(summary);

      const ul = document.createElement("ul");

      groups[year].forEach(p => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="/blog/${p.slug}/">${p.title}</a>`;
        ul.appendChild(li);
      });

      details.appendChild(ul);
      container.appendChild(details);
    });
}
