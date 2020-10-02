var mgsName = localStorage.getItem('name');
$(document).ready(function () {
    Pusher.logToConsole = false;
    var pusher = new Pusher('fe3a74428b31c6007138', {
        cluster: 'ap2'
    });
    var channel = pusher.subscribe('my-channel');
    channel.bind("bingo-" + localStorage.getItem('roomId'), function (data) {
        $('.chats').append(`<div class="card"><div class="card-body"><h5 class="card-subtitle">${data.user}</h5>
        <p class="card-text">${data.msg}</p></div></div>`);
    });
});
function send() {
    $.ajax({
        url: "https://gossipx-server-1.ml/pusher/bingo-pusher.php",
        type: "POST",
        data: { room: "bingo-" + localStorage.getItem('roomId'), user: mgsName, msg: $('#paperInputs1').val().trim() },
        success: function (data) {
            $('#paperInputs1').val('');
        }
    });
}
