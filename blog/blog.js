const POSTS_PER_PAGE = 9;

let allPosts = [];
let filteredPosts = [];
let currentPage = 1;

const grid = document.getElementById("post-grid");
const pageInfo = document.getElementById("page-info");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const searchInput = document.getElementById("search-input");

fetch("posts.json")
  .then(r => r.json())
  .then(posts => {
    allPosts = posts.sort((a, b) => b.date.localeCompare(a.date));
    filteredPosts = allPosts;
    buildFeatured();
    buildArchive();
    render();
  });

function formatDate(str) {
  const [year, month] = str.split("-");
  const date = new Date(year, month - 1);
  return date.toLocaleString("en-US", { month: "long", year: "numeric" });
}

function render() {
  grid.innerHTML = "";

  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const pagePosts = filteredPosts.slice(start, start + POSTS_PER_PAGE);

  for (const post of pagePosts) {
    const card = document.createElement("a");
    card.href = post.url;
    card.className = "post-card";

    card.innerHTML = `
      <div class="post-thumb">
        <img src="${post.image}" alt="">
      </div>
      <h3>${post.title}</h3>
      <div class="post-date">${formatDate(post.date)}</div>
      <p>${post.excerpt}</p>
    `;

    grid.appendChild(card);
  }

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / POSTS_PER_PAGE));

  pageInfo.textContent = `${currentPage} / ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  if (searchInput.value.trim() !== "") {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    pageInfo.style.display = "none";
  } else {
    prevBtn.style.display = "";
    nextBtn.style.display = "";
    pageInfo.style.display = "";
  }
}

prevBtn.onclick = () => {
  currentPage--;
  render();
};

nextBtn.onclick = () => {
  currentPage++;
  render();
};

searchInput.addEventListener("input", () => {
  const q = searchInput.value.toLowerCase();

  filteredPosts = allPosts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q)
  );

  currentPage = 1;
  render();
});

function buildFeatured() {
  const list = document.getElementById("featured-list");

  allPosts
    .filter(p => p.featured)
    .forEach(p => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = p.url;
      a.textContent = p.title;
      li.appendChild(a);
      list.appendChild(li);
    });
}

function buildArchive() {
  const container = document.getElementById("archive");

  const groups = {};

  for (const post of allPosts) {
    const [year, month] = post.date.split("-");
    if (!groups[year]) groups[year] = [];
    groups[year].push(post);
  }

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
        const a = document.createElement("a");
        a.href = p.url;
        a.textContent = p.title;
        li.appendChild(a);
        ul.appendChild(li);
      });

      details.appendChild(ul);
      container.appendChild(details);
    });
}
