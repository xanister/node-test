$(document).ready(function() {
    var ctx, canvas, view, player;

    // Create canvas element
    canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Append to dom
    document.body.appendChild(canvas);

    // Setup view
    view = {x: 0, y: 0, width: canvas.width, height: canvas.height};

    // Connect to server
    var nc = new NodeClient();
    nc.connect("http://forest.anslemgalaxy.com:3000");

    window.running = false;

    function inView(targetRect) {
        var rect = {left: view.x, top: view.y, right: view.x + view.width, bottom: view.y + view.height};
        return !(rect.left > targetRect.right || targetRect.left > rect.right || rect.top > targetRect.bottom || targetRect.top > rect.bottom);
    }

    function render() {
        // Clear
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        var uos = nc.getServerData() ? nc.getServerData().uos : [];

        // Draw any uos in view
        for (var id in uos) {
            if (inView(uos[id].boundingBox)) {
                var img = document.getElementById(uos[id].sprite);
                ctx.drawImage(img, uos[id].x - view.x, uos[id].y - view.y);
            }
        }

        // Return true on success
        return true;
    }

    function run() {
        window.running = true;
        // Render
        render();
        if (nc.getConnected())
            requestAnimationFrame(run);
    }

    $("canvas").click(function() {
        if (!window.running)
            run();
    });
});
