var mgsName = localStorage.getItem("name");
$(document).ready(function () {
  firebase
    .database()
    .ref(`bingo/rooms/${localStorage.getItem("roomId")}/chats`)
    .on("value", function (snapshot) {
      if (snapshot.val()) {
        let chats = snapshot.val();
        $(".chats").html("");
        Object.keys(chats).forEach((chatId) => {
          $(".chats")
            .append(`<div class="card"><div class="card-body"><h5 class="card-subtitle">${chats[chatId].user}</h5>
            <p class="card-text">${chats[chatId].msg}</p></div></div>`);
        });
      }
    });
});

function send() {
  firebase
    .database()
    .ref(`bingo/rooms/${localStorage.getItem("roomId")}/chats/${+new Date()}/`)
    .set({
      user: mgsName,
      msg: $("#paperInputs1").val().trim(),
    });
}
