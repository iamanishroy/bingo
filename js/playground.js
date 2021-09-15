var users = new Array();
var winner = new Array();
$(document).ready(function () {
  var post = 1;
  var timer;
  name = localStorage.getItem("name");
  const pos = ["st", "nd", "rd", "th", "th"];
  maize = JSON.parse(localStorage.getItem("maize"));
  var maizeStatus = [
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
    true,
  ];
  checkedValue = new Array();
  var boxes = document.querySelectorAll(".box");
  i = 0;
  boxes.forEach((b) => {
    $(b).text(maize[i++]);
  });
  var room =
    localStorage.getItem("roomId").substr(0, 3) +
    "-" +
    localStorage.getItem("roomId").substr(3, 6);
  $("#room_code").html(
    `${room}&nbsp;&nbsp;<span class="badge success"><label for="modal-2"><i class="far fa-comment-dots"></i></label></span>`
  );
  firebase
    .database()
    .ref(`bingo/rooms/${localStorage.getItem("roomId")}/`)
    .on("value", function (snapshot) {
      if (snapshot.val()) {
        snap = snapshot.toJSON();
        var html = "";
        c = 0;
        currentUser = snap.currentUser;
        time = 30000;
        users = [];
        Object.keys(snap.users).forEach((user) => {
          c++;
          users.push(user);
          if (user == currentUser) {
            html += `<input id="tab${c}" type="radio" name="tabs" checked><label for="tab${c}">${user}</label>`;
          } else {
            html += `<input id="tab${c}" type="radio" name="tabs"><label for="tab${c}">${user}</label>`;
          }
        });
        winner = [];
        if (Object.keys(snap).includes("winner")) {
          Object.keys(snap.winner).forEach((pos) => {
            winner.push(snap.winner[pos].name);
          });
        }
        rec = 0;
        $("#players").html(html);
        if (Object.keys(snap).includes("checkedValue")) {
          Object.keys(snap.checkedValue).forEach((num) => {
            rec = num;
            checkedValue.push(num);
            var boxes = document.querySelectorAll(".box");
            boxes.forEach((b) => {
              if ($(b).text() == num) {
                $(b).attr(
                  "style",
                  `background: ${snap.checkedValue[num].color};`
                );
                maizeStatus[parseInt($(b).attr("data-box"))] = false;
              }
            });
            check(maizeStatus);
          });
          $("#rec").html(
            `<span style="font-size: 1.5rem;">Recent:- </span><span class="badge secondary">${snap.recent}</span>`
          );
        }
        myColor = snap.users[name].color;
        clearInterval(timer);
        timer = setInterval(() => {
          per = Math.floor((time / 30000) * 100);
          $("#time").html(
            `<div class="bar warning w-${per}">${time / 1000}</div>`
          );
          time -= 1000;
          if (time < 0) {
            clearInterval(timer);
            next();
          }
        }, 1000);
      }
      if (winner.includes(name) && currentUser == name) {
        next();
      }
      if (winner.length == post) {
        pop(
          "Bingo!!",
          post + pos[post - 1] + " Position",
          winner[post - 1] + " completed the Bingo!!"
        );
        post++;
      }
    });
  $(document).on("click", ".box", function () {
    if (
      maizeStatus[parseInt($(this).attr("data-box"))] &&
      name == currentUser &&
      !winner.includes(name)
    ) {
      maizeStatus[parseInt($(this).attr("data-box"))] = false;
      $(this).attr("style", `background: ${myColor};`);
      checkedValue.push(parseInt($(this).text()));
      checked = $(this).text();
      firebase
        .database()
        .ref(
          `bingo/rooms/${localStorage.getItem(
            "roomId"
          )}/checkedValue/${checked}`
        )
        .update({
          color: myColor,
          time: +new Date(),
        })
        .then(() => {
          firebase
            .database()
            .ref(`bingo/rooms/${localStorage.getItem("roomId")}`)
            .update({
              recent: checked,
            })
            .then(next());
        });
    } else {
      window.navigator.vibrate(600);
    }
  });
  function next() {
    var nxt, ni;
    if (users.length - 1 != users.indexOf(currentUser)) {
      nxt = users[users.indexOf(currentUser) + 1];
      ni = users.indexOf(currentUser) + 1;
    } else {
      nxt = users[0];
      ni = 0;
    }
    while (winner.includes(users[ni])) {
      if (users.length - 1 != ni) {
        nxt = users[ni + 1];
        ni++;
      } else {
        nxt = users[0];
        ni = 0;
      }
    }
    over = false;
    if (nxt == currentUser) {
      over = true;
    }
    firebase
      .database()
      .ref(`bingo/rooms/${localStorage.getItem("roomId")}`)
      .update({
        currentUser: nxt,
        over: over,
      });
  }
  function check(cms) {
    var bingo = 0;
    if (!cms[0] && !cms[6] && !cms[12] && !cms[18] && !cms[24]) {
      bingo++;
      changeBox(45, 0);
      changeBox(45, 6);
      changeBox(45, 12);
      changeBox(45, 18);
      changeBox(45, 24);
    }
    if (!cms[4] && !cms[8] && !cms[12] && !cms[16] && !cms[20]) {
      bingo++;
      changeBox(135, 4);
      changeBox(135, 8);
      changeBox(135, 12);
      changeBox(135, 16);
      changeBox(135, 20);
    }
    if (!cms[0] && !cms[5] && !cms[10] && !cms[15] && !cms[20]) {
      bingo++;
      changeBox(90, 0);
      changeBox(90, 5);
      changeBox(90, 10);
      changeBox(90, 15);
      changeBox(90, 20);
    }
    if (!cms[1] && !cms[6] && !cms[11] && !cms[16] && !cms[21]) {
      bingo++;
      changeBox(90, 1);
      changeBox(90, 6);
      changeBox(90, 11);
      changeBox(90, 16);
      changeBox(90, 21);
    }
    if (!cms[2] && !cms[7] && !cms[12] && !cms[17] && !cms[22]) {
      bingo++;
      changeBox(90, 2);
      changeBox(90, 7);
      changeBox(90, 12);
      changeBox(90, 17);
      changeBox(90, 22);
    }
    if (!cms[3] && !cms[8] && !cms[13] && !cms[18] && !cms[23]) {
      bingo++;
      changeBox(90, 3);
      changeBox(90, 8);
      changeBox(90, 13);
      changeBox(90, 18);
      changeBox(90, 23);
    }
    if (!cms[4] && !cms[9] && !cms[14] && !cms[19] && !cms[24]) {
      bingo++;
      changeBox(90, 4);
      changeBox(90, 9);
      changeBox(90, 14);
      changeBox(90, 19);
      changeBox(90, 24);
    }
    if (!cms[0] && !cms[1] && !cms[2] && !cms[3] && !cms[4]) {
      bingo++;
      changeBox(180, 0);
      changeBox(180, 1);
      changeBox(180, 2);
      changeBox(180, 3);
      changeBox(180, 4);
    }
    if (!cms[5] && !cms[6] && !cms[7] && !cms[8] && !cms[9]) {
      bingo++;
      changeBox(180, 5);
      changeBox(180, 6);
      changeBox(180, 7);
      changeBox(180, 8);
      changeBox(180, 9);
    }
    if (!cms[10] && !cms[11] && !cms[12] && !cms[13] && !cms[14]) {
      bingo++;
      changeBox(180, 10);
      changeBox(180, 11);
      changeBox(180, 12);
      changeBox(180, 13);
      changeBox(180, 14);
    }
    if (!cms[15] && !cms[16] && !cms[17] && !cms[18] && !cms[19]) {
      bingo++;
      changeBox(180, 15);
      changeBox(180, 16);
      changeBox(180, 17);
      changeBox(180, 18);
      changeBox(180, 19);
    }
    if (!cms[20] && !cms[21] && !cms[22] && !cms[23] && !cms[24]) {
      bingo++;
      changeBox(180, 20);
      changeBox(180, 21);
      changeBox(180, 22);
      changeBox(180, 23);
      changeBox(180, 24);
    }
    if (bingo >= 5) {
      if (!winner.includes(name)) {
        winner.push(name);
        n = winner.length;
        firebase
          .database()
          .ref(`bingo/rooms/${localStorage.getItem("roomId")}/winner/${n}`)
          .update({
            name: name,
          });
      }
    }
  }
  function changeBox(deg, i) {
    $('*[data-box="' + i + '"]').attr(
      "style",
      `background: linear-gradient(${deg}deg, #00f260, #0575e6);`
    );
  }
});
function end() {
  if (users.length - winner.length <= 1) {
    localStorage.clear();
    window.location.replace("index.html");
  }
}
