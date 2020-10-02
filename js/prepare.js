function room() {
    $('#room_code').text(localStorage.getItem('roomId').substr(0, 3) + '-' + localStorage.getItem('roomId').substr(3, 6));
}
var counter = 1;
var prepareMaize = [
    true, true, true, true, true,
    true, true, true, true, true,
    true, true, true, true, true,
    true, true, true, true, true,
    true, true, true, true, true
];
$(document).on('click', '.box', function () {
    if (prepareMaize[parseInt($(this).attr("data-box"))]) {
        $(this).text(counter++);
        prepareMaize[parseInt($(this).attr("data-box"))] = false;
        if (counter > 25) {
            $('#ready').show();
        }
    }
});
function reset() {
    prepareMaize = [
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
    ];
    $('.box').text('');
    counter = 1;
    $('#ready').hide();
}
function serialize() {
    $('#ready').hide();
    var boxes = document.querySelectorAll('.box');
    boxes.forEach((b) => {
        $(b).text(parseInt($(b).attr("data-box")) + 1);
    });
    prepareMaize = [
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false,
        false, false, false, false, false
    ];
    counter = 26;
    $('#ready').show();
}
function randomize() {
    $('#ready').hide();
    prepareMaize = [
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true,
        true, true, true, true, true
    ];
    counter = 1;
    ranAr = new Array();
    while (counter <= 25) {
        no = prepareMaize.length * Math.random() | 0;
        if (prepareMaize[no]) {
            ranAr.push(no);
            prepareMaize[no] = false;
            counter++;
        }
    }
    var boxes = document.querySelectorAll('.box');
    i = 0;
    boxes.forEach((b) => {
        $(b).text(ranAr[i++] + 1);
    });
    $('#ready').show();
}
function ready() {
    var maize = new Array();
    var boxes = document.querySelectorAll('.box');
    boxes.forEach((b) => {
        maize.push($(b).text());
    });
    localStorage.setItem('maize', JSON.stringify(maize));
    firebase.database().ref(`rooms/${localStorage.getItem('roomId')}`).on('value', function (snapshot) {
        if (!snapshot.val()['start']) {
            firebase.database().ref(`rooms/${localStorage.getItem('roomId')}/users/${localStorage.getItem('name')}`).update({
                name: localStorage.getItem('name')
            }).then(() => {
                window.location.replace('wait.html');
            });
        } else {
            pop('Sorry!!','', 'You are late the match already started!!');
        }
    });
}