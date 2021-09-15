const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var snap;
function startGameDisplay() {
  $(".intro").hide();
  $("#start").show();
}
function joinGameDisplay() {
  $(".intro").hide();
  $("#join").show();
}
function checkNameAndCreate() {
  if ($("#paperInputs1").val().trim() != "") {
    $("#btn_create").text("Creating Room...");
    var result = "";
    var charactersLength = characters.length;
    for (var i = 0; i < 6; i++)
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    firebase
      .database()
      .ref("bingo/rooms/" + result)
      .once("value", function (snapshot) {
        if (!snapshot.val()) {
          firebase
            .database()
            .ref("bingo/rooms/" + result)
            .set({
              roomId: result,
              host: $("#paperInputs1").val().trim(),
              start: false,
              users: [],
            })
            .then(() => {
              localStorage.clear();
              localStorage.setItem("name", $("#paperInputs1").val().trim());
              localStorage.setItem("roomId", result);
              window.location.replace("prepare.html");
            });
        } else {
          checkNameAndCreate();
        }
      });
  } else {
    pop("Oaa!!", "", "Enter Your Name!!");
  }
}
function checkRoomAndEnter() {
  if ($("#paperInputs2").val().trim() != "") {
    $("#btn_enter").text("Entering Room...");
    firebase
      .database()
      .ref(
        "bingo/rooms/" +
          $("#paperInputs2").val().trim().replace("-", "").toUpperCase()
      )
      .once("value", function (snapshot) {
        if (snapshot.val()) {
          snap = snapshot.toJSON();
          localStorage.clear();
          if (!Object.keys(snap).includes("users")) {
            localStorage.setItem(
              "roomId",
              $("#paperInputs2").val().trim().replace("-", "").toUpperCase()
            );
            $("#enter_room").hide();
            $("#enter_name").show();
          } else if (Object.keys(snap.users).length < 5) {
            localStorage.setItem(
              "roomId",
              $("#paperInputs2").val().trim().replace("-", "").toUpperCase()
            );
            $("#enter_room").hide();
            $("#enter_name").show();
          } else {
            pop("Sorry!!", "", "No Space Available!!");
          }
        } else {
          pop("Hello!!", "", "The Room ID has expired or does not exist!!");
        }
      })
      .then(() => {
        $("#btn_enter").text("Enter Room");
      });
  } else {
    pop("Oaa!!", "", "Enter the Room Code!!");
  }
}
function checkNameAndJoin() {
  if ($("#paperInputs3").val().trim() != "") {
    $("#btn_join").text("Joining...");
    if (!Object.keys(snap).includes("users")) {
      localStorage.setItem("name", $("#paperInputs3").val().trim());
      window.location.replace("prepare.html");
    } else if (
      !Object.keys(snap.users).includes($("#paperInputs3").val().trim())
    ) {
      localStorage.setItem("name", $("#paperInputs3").val().trim());
      window.location.replace("prepare.html");
    } else {
      pop(
        "Sorry!!",
        "",
        "There is someone with your name.. Please change it!!"
      );
    }
    $("#btn_join").text("Join");
  } else {
    pop("Oaa!!", "", "Enter Your Name!!");
  }
}
$(document).ready(function () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  if (urlParams != "") {
    roomCode = urlParams.get("room");
    joinGameDisplay();
    $("#paperInputs2").val(roomCode);
    checkRoomAndEnter();
  }
});
