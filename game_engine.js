$(document).ready(function() {
    var gs = new GameClient();

    gs.init();

    setInterval(function() {
        $.each(gs.uos, function(id, uo) {
            if ($('#' + id).length === 0) {
                $('body').append("<div class='uo' id='" + id + "'></div>");
            }
            $('#' + id).css('left', uo.x + "px");
            $('#' + id).css('top', uo.y + "px");
        });
    }, 33);
});