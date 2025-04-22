const hostApi = "http://localhost:3000";
const socket = io("http://localhost:3000");

window.onload = async () => {
  // localStorage.clear()
  let statusLogin = false;
  await fetch(`${hostApi}/api/authentication`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        statusLogin = true;
        showDashboard(localStorage.getItem("username"));
        // Daftarkan socket user
        socket.emit("register", localStorage.getItem("QUID"));
      }
    });

  if (statusLogin) {
    // fetch all friends
    const container = document.getElementById("friends-list");

    await fetch(`${hostApi}/api/friends/${localStorage.getItem("QUID")}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data)
        data.playerFriends.forEach((friend) => {
          const ac = document.createElement("a");
          ac.className = "conversation";
          container.appendChild(ac);

          const divIP = document.createElement("div");
          divIP.className = "conversation-avatar";
          divIP.textContent = friend.username.charAt(0).toUpperCase(); // ganti dari friend.name
          divIP.onclick = () => alert(`membuka profile ${friend.username}`);
          ac.appendChild(divIP);

          const divInfo = document.createElement("div");
          divInfo.className = "conversation-info";
          divInfo.onclick = () => startChat(friend.QUID_friend); // ganti dari friend.id
          ac.appendChild(divInfo);

          const divUN = document.createElement("div");
          divUN.className = "conversation-name";
          divUN.textContent = friend.username;
          divInfo.appendChild(divUN);
          // divUN.className =
          // const firstLetterName = friend.username || "@";
          // console.log(`ini test ${friend.username.charAt(0)}`)

          //   const div = document.createElement("div");
          //   div.className = "conversation-name";
          //   div.textContent = friend.username; // ganti dari friend.name
          //   div.onclick = () => startChat(friend.QUID_friend); // ganti dari friend.id
          //   container.appendChild(div);
        });
      });
    // const dataDecode = data.json();
    // console.log(dataDecode)
  }
};

async function startChat(friendId) {
  let friendData = null;
  await fetch(`${hostApi}/api/friends/${localStorage.getItem("QUID")}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      // data.playerFriends.map
      // console.log()
      friendData = data.playerFriends.find(
        (quid) => quid.QUID_friend === friendId
      );
    });
  // const cc = document.getElementById('chat-header-focus');
  // cc.className = 'mok'

  const chatFocusH = document.getElementById("chat-header-focus");
  // const divIP = document.createElement('div');
  const divIP = document.querySelector(".avatar");
  divIP.className = "avatar";
  divIP.textContent = friendData?.username.charAt(0).toUpperCase();
  chatFocusH.appendChild(divIP);

  const divInfo = document.querySelector(".user-info");
  divInfo.className = "user-info";
  chatFocusH.appendChild(divInfo);

  const divUN = document.querySelector(".user-name");
  divUN.className = "user-name";
  divUN.textContent = friendData?.username;
  divInfo.appendChild(divUN);

  localStorage.setItem('chatFocusFID', friendData?.QUID_friend)
  //load old message
  await loadMessages(localStorage.getItem("QUID"), friendData?.QUID_friend);
}

function login() {
  const username = document.getElementById("userN").value;
  const password = document.getElementById("userP").value;

  fetch(`${hostApi}/api/login`, {
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

// function startChat(friendId) {
//   alert("Mulai chat dengan teman ID: " + friendId);
//   // bisa redirect ke halaman chat nanti
// }

function showDashboard(username) {
  document.querySelector(".login-container").style.display = "none";
  document.querySelector(".dashboard-chat").style.display = "flex";
  //   document.getElementById("user-name").innerText = username;
}

function logout() {
  fetch(`${hostApi}/api/logout`, {
    method: "DELETE",
  }).then(() => {
    localStorage.clear();
    location.reload();
  });
}

//testing socket.client

// const sender_id = localStorage.getItem('QUID')
// let receiver_id = null;
// button / function send message
async function sendMessage () {
  const sender_id = localStorage.getItem('QUID');
  const receiver_id = localStorage.getItem('chatFocusFID');

  const message = document.getElementById('input-message-chat').value;
  socket.emit('send_message', { sender_id, receiver_id, message });
  document.getElementById('input-message-chat').value = '';

  // console.log(sender_id, receiver_id)
}

// Ambil riwayat pesan awal
async function loadMessages(sender_id, receiver_id) {
  const res = await fetch(
    `${hostApi}/api/chat/history?sender_id=${sender_id}&receiver_id=${receiver_id}`
  )
    .then((res) => res.json())
    .then((data) => {
      renderMessages(sender_id, receiver_id, data);
    });
  //   const messages = await res.json();
  //   renderMessages(sender_id, receiver_id, messages);
}

// Render chat ke tampilan
function renderMessages(sender_id, receiver_id, messages) {
  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    const divMsg = document.createElement('div');
    divMsg.className = `message ${msg.sender_id == sender_id ? "sent" : "received"}`;
    divMsg.textContent = msg.message;
    chatBox.appendChild(divMsg)
    
    const divTime = document.createElement('div');
    divTime.className = "message-timestamp";
    divTime.textContent = msg.timestamp;
    divMsg.appendChild(divTime)
  });
    // chatBox.innerHTML = messages
    //   .map(
    //     (m) => `
    //       <div className='message ${m.sender_id == sender_id ? "sent" : "received"}'>
    //           ${m.message}
    //       </div>

    //   `
    //   )
    //   .join("");
}

// Submit pesan ke socket
// document.getElementById("chatForm").addEventListener("submit", (e) => {
//   e.preventDefault();
//   const message = document.getElementById("message").value;
//   socket.emit("send_message", { sender_id, receiver_id, message });
//   document.getElementById("message").value = "";
// });

// Dapat pesan baru dari socket
socket.on("new_message", (data) => {
  const chatBox = document.getElementById("chatBox");
  const divMsg = document.createElement('div');
    divMsg.className = `message ${data?.sender_id == localStorage.getItem('QUID') ? "sent" : "received"}`;
    divMsg.textContent = data?.message;
    chatBox.appendChild(divMsg)
    
    const divTime = document.createElement('div');
    divTime.className = "message-timestamp";
    divTime.textContent = data.timestamp;
    divMsg.appendChild(divTime)
});

// loadMessages();
