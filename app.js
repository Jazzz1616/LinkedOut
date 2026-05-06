const profileDiv = document.getElementById("profile");
const postsDiv = document.getElementById("posts");

async function searchUser() {
  const username = document.getElementById("searchInput").value;

  if (!username) {
    alert("Please enter a username");
    return;
  }

  // Loading state
  profileDiv.innerHTML = "<p>Loading profile...</p>";
  postsDiv.innerHTML = "<p>Loading posts...</p>";

  try {
    // Fetch GitHub User
    const userRes = await fetch(`https://api.github.com/users/${username}`);

    if (!userRes.ok) {
      throw new Error("User not found");
    }

    const user = await userRes.json();
    displayProfile(user);

    // Fetch Posts (still using API but customizing content)
    const postRes = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=5");
    const posts = await postRes.json();

    displayPosts(posts, user);

  } catch (error) {
    profileDiv.innerHTML = `<p style="color:red;">❌ ${error.message}</p>`;
    postsDiv.innerHTML = "";
  }
}

function displayProfile(user) {
  profileDiv.innerHTML = `
    <div class="card">
      <img src="${user.avatar_url}" width="100">
      <h2>${user.name || user.login}</h2>
      <p>${user.bio || "Passionate developer building JavaScript projects 🚀"}</p>
      <p>Followers: ${user.followers}</p>
      <button onclick="saveUser('${user.login}')">⭐ Save</button>
    </div>
  `;
}

function displayPosts(posts, user) {
  postsDiv.innerHTML = posts.map((post, index) => `
    <div class="card">
      <h3>${user.login}'s Update #${index + 1} 🚀</h3>
      <p>
        Working on exciting projects using JavaScript and APIs.
        Learning how to build real-world applications and improve frontend skills.
      </p>
    </div>
  `).join('');
}

// Save user to localStorage (no duplicates)
function saveUser(username) {
  let saved = JSON.parse(localStorage.getItem("savedUsers")) || [];

  if (!saved.includes(username)) {
    saved.push(username);
    localStorage.setItem("savedUsers", JSON.stringify(saved));
    alert("User saved!");
  } else {
    alert("User already saved!");
  }
}
