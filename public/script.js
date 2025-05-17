const hostApi = "http://localhost:3000";
const socket = io("http://localhost:3000");
// const hostApi = "http://192.168.119.218:3000";
// const socket = io("http://192.168.119.218:3000");
// const hostApi = "https://buck-well-kingfish.ngrok-free.app";
// const socket = io("https://buck-well-kingfish.ngrok-free.app");
// const hostApi = "https://keno-impressed-several-pocket.trycloudflare.com";
// const socket = io("https://keno-impressed-several-pocket.trycloudflare.com");
// let hostApi;
// let socket;
// (async () => {
// hostApi = localStorage.getItem("customHost");
// socket = io(localStorage.getItem("customHost"));
// })()

// document.addEventListener('deviceready', async () => {
//   console.log("Device ready");
//   await mainLogic();
// }, false);

let focusInMsgWa = "chats";

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
        socket.emit("loadGroupAuth", { quid: localStorage.getItem("QUID") });
      }
    })
    .catch((err) => {
      console.log("mungkin hanya auth error, err: ", err);
    });

  if (statusLogin) {
    // fetch all friends
    mainLogic();
  }
};
async function mainLogic() {
  await loadFriendsWa();
  await loadGroupWa();
}
function loadGroupWa() {
  return new Promise((resolve, reject) => {
    fetch(
      `${hostApi}/api/chat/getgroup?QUID_player=${localStorage.getItem(
        "QUID"
      )}`,
      {
        method: "GET",
        // headers: {
        //   Authorization: "Bearer " + localStorage.getItem("token"),
        // },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("group-wa-list");
        data.forEach((eld) => {
          const ac = document.createElement("a");
          ac.className = "conversation";
          container.appendChild(ac);

          const divIP = document.createElement("div");
          divIP.className = "conversation-avatar";
          divIP.textContent = getSmartCode(eld.group_name);
          divIP.onclick = () =>
            alert(`membuka profile group ${eld.group_name}`);
          ac.appendChild(divIP);

          const divInfo = document.createElement("div");
          divInfo.className = "conversation-info";
          divInfo.onclick = () => {
            // startChat(friend.QUID_friend); // ganti dari friend.id
            startChatGroupWa(eld.group_xid);
            document.getElementById("sidebar-toggle").checked = false;
            // alert("membuka chat mode")
          };
          ac.appendChild(divInfo);

          const divUN = document.createElement("div");
          divUN.className = "conversation-name";
          divUN.textContent = eld.group_name;
          divInfo.appendChild(divUN);
        });
        resolve(true);
      })
      .catch((e) => {
        console.error("something wrong: ", e);
        reject(e);
      });
  });
}
function loadFriendsWa() {
  return new Promise((resolve, reject) => {
    fetch(`${hostApi}/api/friends/${localStorage.getItem("QUID")}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const container = document.getElementById("friends-list");
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
          divInfo.onclick = () => {
            startChat(friend.QUID_friend); // ganti dari friend.id
            document.getElementById("sidebar-toggle").checked = false;
            // alert("membuka chat mode")
          };
          ac.appendChild(divInfo);

          const divUN = document.createElement("div");
          divUN.className = "conversation-name";
          divUN.textContent = friend.username;
          divInfo.appendChild(divUN);
        });
        return resolve(true);
      })
      .catch((e) => {
        console.error("something wrong: ", e);
        reject(e);
      });
  });
}

// function getNativeItem(key) {
//   return new Promise((resolve, reject) => {
//     NativeStorage.getItem(key, resolve, reject);
//   });
// }

// function setNativeItem(key, value) {
//   return new Promise((resolve, reject) => {
//     NativeStorage.setItem(key, value, resolve, reject);
//   });
// }
function getSmartCode(text) {
  // 1. Ambil semua huruf besar
  const capitals = text.match(/[A-Z]/g);
  if (capitals && capitals.length >= 2) {
    return capitals[0] + capitals[1];
  }

  // 2. Cek jika ada spasi
  const parts = text.trim().split(" ");
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }

  // 3. Fallback: ambil 2 huruf pertama
  return text.slice(0, 2);
}

async function startChatGroupWa(groupId) {
  let groupData = null;
  await fetch(
    `${hostApi}/api/chat/getgroup?QUID_player=${localStorage.getItem("QUID")}`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  )
    .then((res) => res.json())
    .then((data) => {
      groupData = data.find((quid) => quid.group_xid === groupId);
      const chatFocusH = document.getElementById("chat-header-focus");
      // const divIP = document.createElement('div');
      const divIP = document.querySelector(".avatar");
      divIP.className = "avatar";
      divIP.textContent = getSmartCode(groupData.group_name);
      chatFocusH.appendChild(divIP);

      const divInfo = document.querySelector(".user-info");
      divInfo.className = "user-info";
      chatFocusH.appendChild(divInfo);

      const divUN = document.querySelector(".user-name");
      divUN.className = "user-name";
      divUN.textContent = groupData.group_name;
      divInfo.appendChild(divUN);

      localStorage.setItem("chatGroupFocusId", groupData?.group_xid);
      loadMessagesGroupWa(localStorage.getItem("QUID"), groupData?.group_xid);
      // focusInMsgWa = "groups"
    });
}
async function startChat(friendId) {
  let friendData = null;
  await fetch(`${hostApi}/api/friends/${localStorage.getItem("QUID")}`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      friendData = data.playerFriends.find(
        (quid) => quid.QUID_friend === friendId
      );
    });

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

  localStorage.setItem("chatFocusFID", friendData?.QUID_friend);
  await loadMessages(localStorage.getItem("QUID"), friendData?.QUID_friend);
  // focusInMsgWa = "chats"
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
    })
    .catch((err) => {
      console.log(err);
    });
}

function addFriend_popup() {
  document.querySelector(".popup-add-fr-overlay").style.display = "flex";
}
async function addFriend_add() {
  const emailQnotelp = document.getElementById("input-mail-noTelp").value;
  await fetch(
    `${hostApi}/api/friend/addfriend?playerQuid=${localStorage.getItem(
      "QUID"
    )}&emailQnotelp=${emailQnotelp}`,
    {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    }
  );
  // alert("hell nah")
  document.getElementById("input-mail-noTelp").value = "";
  document.querySelector(".popup-add-fr-overlay").style.display = "none";
  location.reload();
}

function showDashboard(username) {
  // document.querySelector(".login-container").style.display = "none";
  document.querySelector(".container-center-form").style.display = "none";
  document.querySelector(".dev-mode-button-csv-class").style.display = "none";
  document.querySelector(".dashboard-chat").style.display = "flex";
}

function logout() {
  fetch(`${hostApi}/api/logout`, {
    method: "DELETE",
  }).then(() => {
    localStorage.clear();
    location.reload();
  });
}

// async function sendMessageGroup() {
//   const sender_id = localStorage.getItem("QUID");
//   const receiver_id = localStorage.getItem("chatFocusFID");

//   const message = document.getElementById("input-message-chat").value;
//   socket.emit("send_message", { sender_id, receiver_id, message });
//   document.getElementById("input-message-chat").value = "";
// }

async function sendMessage() {
  switch (focusInMsgWa) {
    case "chats": {
      const sender_id = localStorage.getItem("QUID");
      const receiver_id = localStorage.getItem("chatFocusFID");

      const message = document.getElementById("input-message-chat").value;
      socket.emit("send_message", { sender_id, receiver_id, message });
      document.getElementById("input-message-chat").value = "";
      break;
    }
    case "groups": {
      const sender_id = localStorage.getItem("QUID");
      const group_id = localStorage.getItem("chatGroupFocusId");

      const message = document.getElementById("input-message-chat").value;
      socket.emit("sendMessageGroup", {
        quid: sender_id,
        groupId: group_id,
        message,
      });
      document.getElementById("input-message-chat").value = "";
      break;
    }
    case "servers": {
      break;
    }
    default: {
      console.error("err switch, code in line ?");
      return;
    }
  }
}

async function loadMessages(sender_id, receiver_id) {
  const res = await fetch(
    `${hostApi}/api/chat/history?sender_id=${sender_id}&receiver_id=${receiver_id}`
  )
    .then((res) => res.json())
    .then((data) => {
      renderMessages(sender_id, receiver_id, data);
    });
}
async function loadMessagesGroupWa(sender_id, groupId) {
  let nameOfMGRP = "";
  await fetch(`${hostApi}/api/chat/historygroupwa?group_xid=${groupId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => {
      const chatBox = document.getElementById("chatBox");
      chatBox.innerHTML = "";

      data.forEach(async (msg) => {
        const divMsg = document.createElement("div");
        divMsg.className = `message ${
          msg.QUID == sender_id ? "sent" : "received"
        }`;
        divMsg.textContent = msg.group_message;
        chatBox.appendChild(divMsg);

        await fetch(`${hostApi}/api/friend/friendData?QUID_fr=${msg?.QUID}`, {
          method: "GET",
        })
          .then((res) => res.json())
          .then((data) => {
            // nameOfMGRP = data[0]?.username;

            const divName = document.createElement("div");
            divName.className = `message-name-sender`;
            divName.textContent = data[0]?.username;
            divMsg.appendChild(divName);
          });
        const divTime = document.createElement("div");
        divTime.className = "message-timestamp";
        divTime.textContent = msg.timestamp;
        divMsg.appendChild(divTime);
      });
    });
}

// Render chat ke tampilan
function renderMessages(sender_id, receiver_id, messages) {
  const chatBox = document.getElementById("chatBox");

  chatBox.innerHTML = "";

  messages.forEach((msg) => {
    const divMsg = document.createElement("div");
    divMsg.className = `message ${
      msg.sender_id == sender_id ? "sent" : "received"
    }`;
    divMsg.textContent = msg.message;
    chatBox.appendChild(divMsg);

    const divTime = document.createElement("div");
    divTime.className = "message-timestamp";
    divTime.textContent = msg.timestamp;
    divMsg.appendChild(divTime);
  });
}

// Dapat pesan baru dari socket
socket.on("new_message", (data) => {
  const chatBox = document.getElementById("chatBox");
  const divMsg = document.createElement("div");
  divMsg.className = `message ${
    data?.sender_id == localStorage.getItem("QUID") ? "sent" : "received"
  }`;
  divMsg.textContent = data?.message;
  chatBox.appendChild(divMsg);

  const divTime = document.createElement("div");
  divTime.className = "message-timestamp";
  divTime.textContent = data.timestamp;
  divMsg.appendChild(divTime);
});
socket.on("receiveMessage", async (data) => {
  const chatBox = document.getElementById("chatBox");
  const divMsg = document.createElement("div");
  divMsg.className = `message ${
    data?.from == localStorage.getItem("QUID") ? "sent" : "received"
  }`;
  divMsg.textContent = data?.message;
  chatBox.appendChild(divMsg);

  await fetch(`${hostApi}/api/friend/friendData?QUID_fr=${data.from}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((datas) => {
      // nameOfMGRP = data[0]?.username;

      const divName = document.createElement("div");
      divName.className = `message-name-sender`;
      divName.textContent = datas[0]?.username;
      divMsg.appendChild(divName);
    });

  // const divName = document.createElement("div");
  // divName.className = `message-name-sender`;
  // divName.textContent = data.from;
  // divMsg.appendChild(divName);

  const divTime = document.createElement("div");
  divTime.className = "message-timestamp";
  divTime.textContent = data.timestamp;
  divMsg.appendChild(divTime);
});

function submitForm() {
  const data = {
    user: document.getElementById("emailOrPhone").value,
    password: document.getElementById("password").value,
  };
  
  fetch(`${hostApi}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((response) => {
      alert(response.message);
      if (response?.status) {
        formContainer.style.transform = "translateX(0)";
        document.getElementById("emailOrPhone").value = '';
        document.getElementById("password").value = '';
      }
    })
    .catch((err) => {
      alert("Gagal koneksi ke server!");
      document.getElementById("password").value = '';
      console.error(err);
    });
}

// document.querySelectorAll("a[data-href]").forEach((link) => {
//   // hanya sebagai perpindahan tab reg to log dan sebaliknya
//   link.addEventListener("click", function (e) {
//     e.preventDefault();
//     // alert('hell nah,', e.currentTarget.getAttribute('data-href')) // wrong tipe of check debug
//     const directroute = e.currentTarget.getAttribute("data-href");
//     if (directroute === "/register") {
//       document.querySelector(".login-container").style.display = "none";
//       document.querySelector(".middle-form").style.display = "flex";
//     } else if (directroute === "/login") {
//       document.querySelector(".middle-form").style.display = "none";
//       document.querySelector(".login-container").style.display = "flex";
//     }
//   });
// });

function isLoginUI() {
  const isLogin =
    document.querySelector(".login-container").style.display === "block"
      ? true
      : false;
  console.log(isLogin);
}

function devModePopup() {
  document.querySelector(".popup-dev-mode-overlay").style.display = "flex";
}

function newHost_DevMode() {
  const customhost = document.getElementById("newHost").value;
  localStorage.setItem("customHost", customhost);
  document.getElementById("newHost").value = "";
  document.querySelector(".popup-dev-mode-overlay").style.display = "none";
}

function changeMenuWaMode(menu) {
  var elm = document.getElementById("waControlMenu");
  let isValid = true;
  const isMobile = (window.innerWidth <= 576) ? true : false 
  const tabActF = document.querySelectorAll(".tab");
  tabActF.forEach((elm) => {
    elm.classList.remove("active");
  });

  switch (menu) {
    case "chat": {
      focusInMsgWa = "chats";
      elm.style.transform = "translateX(0)";
      break;
    }
    case "group": {
      focusInMsgWa = "groups";
      if (isMobile) {
        elm.style.transform = `translateX(-${85}vw)`;
        return
      }
      
      // elm.style.transform = "translateX(-280px)";
      elm.style.transform = "translateX(-280px)";
      break;
    }
    case "server": {
      if (isMobile) {
        elm.style.transform = `translateX(-${2*window.innerWidth}px)`;
        return
      }
      // elm.style.transform = "translateX(-560px)";
      elm.style.transform = "translateX(-560px)";
      break;
    }
    default: {
      console.error("menggunakan kondisi diluar fungsi err 1");
      isValid = false;
      break;
    }
  }
  if (isValid) {
    document.getElementById(`tab-${menu}-wa`).classList.add("active");
  }
}

const toRegister = document.getElementById("toRegister");
const toLogin = document.getElementById("toLogin");
const formContainer = document.getElementById("formContainer");

toRegister.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.style.transform = "translateX(-300px)";
});

toLogin.addEventListener("click", (e) => {
  e.preventDefault();
  formContainer.style.transform = "translateX(0)";
});
