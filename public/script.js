window.onload = () => {
  // localStorage.clear()
  fetch("/api/authentication", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        showDashboard(localStorage.getItem("username"));

        const container = document.getElementById("friends-list");

        data.playerFriends.forEach((friend) => {
            const div = document.createElement("div");
            div.className = "friend-button";
            div.textContent = friend.username; // ganti dari friend.name
            div.onclick = () => startChat(friend.QUID_friend); // ganti dari friend.id
            container.appendChild(div);
        });
      }
    });
};

function login() {
  const username = document.getElementById("userN").value;
  const password = document.getElementById("userP").value;

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.error) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.username);
        localStorage.setItem("QUID", data.QUID);
        showDashboard(data.username);
        location.reload();
      }
      //   fetch('/api/authentication')
      //   .then(res => res.json())
      //   .then(data => {
      // if (data.loggedIn) {
      //   showDashboard(data.username);
      // }
    })
    .catch((err) => {
      console.log(err);
    });
}

function startChat(friendId) {
  alert("Mulai chat dengan teman ID: " + friendId);
  // bisa redirect ke halaman chat nanti
}

function showDashboard(username) {
  document.querySelector(".log-container").style.display = "none";
  document.querySelector(".dashboard-qq").style.display = "block";
  document.getElementById("user-name").innerText = username;
}

function logout() {
  fetch("/api/logout", {
    method: "DELETE",
  }).then(() => {
    localStorage.clear();
    location.reload();
  });
}
