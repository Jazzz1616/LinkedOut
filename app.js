const profileDiv = document.getElementById("profile");
const postsDiv = document.getElementById("posts");

async function searchUser() {
  const username = document.getElementById("searchInput").value;

  try {
    // Fetch GitHub User
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    const user = await userRes.json();

    displayProfile(user);

    // Fetch Posts
    const postRes = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const posts = await postRes.json();

    displayPosts(posts);

  } catch (error) {
    console.log(error);
  }
}

function displayProfile(user) {
  profileDiv.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" width="100">
      <h2>${user.name}</h2>
      <p>${user.bio}</p>
      <p>Followers: ${user.followers}</p>
      <button onclick="saveUser('${user.login}')">⭐ Save</button>
    </div>
  `;
}

function displayPosts(posts) {
  postsDiv.innerHTML = posts.map(post => `
    <div class="card">
      <h3>${post.title}</h3>
      <p>${post.body}</p>
    </div>
  `).join('');
}

// Save user to localStorage
function saveUser(username) {
  let saved = JSON.parse(localStorage.getItem("savedUsers")) || [];
  saved.push(username);
  localStorage.setItem("savedUsers", JSON.stringify(saved));
  alert("User saved!");
}
