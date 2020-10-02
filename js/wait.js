var users = new Array();
firebase.database().ref(`rooms/${localStorage.getItem('roomId')}`).on('value', function (snapshot) {
    host = snapshot.val()['host'];
    if (snapshot.val()['start']) {
        location.replace('playground.html');
    }
    snap = Object.keys(snapshot.toJSON().users);
    tp = 0;
    html = '';
    users = [];
    snap.forEach(user => {
        tp++;
        html += '<div class="alert alert-primary">' + user + '</div>';
        if (host == localStorage.getItem('name')) {
            users.push(user);
        }
    })
    $('.flex-spaces').html(html);
    if (tp >= 2 && host == localStorage.getItem('name')) {
        $('#start').show();
    } else {
        $('#start').hide();
    }
});
function room() {
    var room = localStorage.getItem('roomId').substr(0, 3) + '-' + localStorage.getItem('roomId').substr(3, 6);
    $('#room_code').html(`${room}&nbsp;&nbsp;<span class="badge success"><label for="modal-2"><i class="far fa-comment-dots"></i></label></span>`);
    $('#share').attr('href', `whatsapp://send?text=Join our Bingo game by the link https://bingo.oldskool.ml/?room=${room} or By the code *${room}*`);
} function copyToClipboard() {
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val($('#room_code').text()).select();
    document.execCommand("copy");
    $temp.remove();
}
function start() {
    const colors = ['aquamarine', 'yellow', 'cornflowerblue', 'greenyellow', 'tomato'];
    var i = 0;
    users.forEach(user => {
        firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/users/${user}`).update({
            color: colors[i++]
        });
    });
    firebase.database().ref(`rooms/${localStorage.getItem('roomId')}`).update({
        start: true,
        currentUser: localStorage.getItem('name')
    });
}

