let allPosts = [];
let filteredPosts = [];
let currentPage = 1;
const postsPerPage = 6;

const grid = document.getElementById("post-grid");
const prevBtn = document.getElementById("prev-page");
const nextBtn = document.getElementById("next-page");
const pageInfo = document.getElementById("page-info");

const searchInput = document.getElementById("search-input");
const featuredList = document.getElementById("featured-list");
const archiveContainer = document.getElementById("archive");

fetch("/blog/posts.json")
  .then(res => res.json())
  .then(data => {
    allPosts = data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    filteredPosts = [...allPosts];

    renderFeatured();
    renderArchive();
    render();
  });

function render() {
  grid.innerHTML = "";

  const start = (currentPage - 1) * postsPerPage;
  const pagePosts = filteredPosts.slice(start, start + postsPerPage);

  pagePosts.forEach(post => {
    const card = document.createElement("article");
    card.className = "post-card";

    card.innerHTML = `
      <a href="/blog/posts/${post.slug}/">
        <img src="${post.image}" alt="">
        <h3>${post.title}</h3>
      </a>
      <div class="post-meta">${formatDate(post.date)}</div>
      <p>${post.excerpt}</p>
    `;

    grid.appendChild(card);
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / postsPerPage)
  );

  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    render();
  }
});

nextBtn.addEventListener("click", () => {
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    render();
  }
});

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase().trim();

  filteredPosts = allPosts.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q)
  );

  currentPage = 1;
  render();
});

function renderFeatured() {
  featuredList.innerHTML = "";

  allPosts
    .filter(p => p.featured)
    .forEach(post => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="/blog/posts/${post.slug}/">
          ${post.title}
        </a>
      `;
      featuredList.appendChild(li);
    });
}

function renderArchive() {
  archiveContainer.innerHTML = "";

  const groups = {};

  allPosts.forEach(post => {
    const d = new Date(post.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    if (!groups[key]) {
      groups[key] = {
        year: d.getFullYear(),
        month: d.getMonth(),
        posts: []
      };
    }

    groups[key].posts.push(post);
  });

  const sortedGroups = Object.values(groups).sort((a, b) => {
    const da = new Date(a.year, a.month);
    const db = new Date(b.year, b.month);
    return db - da;
  });

  sortedGroups.forEach(group => {
    const section = document.createElement("div");
    section.className = "archive-group";

    const heading = document.createElement("h4");
    heading.textContent =
      `${monthName(group.month)} ${group.year}`;

    section.appendChild(heading);

    const ul = document.createElement("ul");

    group.posts.forEach(post => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a href="/blog/posts/${post.slug}/">
          ${post.title}
        </a>
      `;
      ul.appendChild(li);
    });

    section.appendChild(ul);
    archiveContainer.appendChild(section);
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long"
  });
}

function monthName(i) {
  return new Date(2000, i).toLocaleString(undefined, {
    month: "long"
  });
}
