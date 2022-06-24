module.exports = function (msg, color) {
    if(color.length < 1) {
        msg.channel.send("Wrong command usage, provide color to check");
    } else if (!/^\d+$/.test(color) && !color.includes("-")) {
        msg.channel.send("Incorrect color format, must be RGB!");
    } else if(color[0].length != 9) {
        msg.channel.send("Incorrect RGB format! (RRRGGGBBB)");
    } else {
        color = color[0];
        var R = Number(color.substr(0, 3)) + 100;
        var G = Number(color.substr(3, 3)) + 100;
        var B = Number(color.substr(6, 3)) + 100;

        if(R > 255) R = 255;
        if(G > 255) G = 255;
        if(B > 255) B = 255;

        let RGB2INT = R << 16 ^ G << 8 ^ B;

        if (RGB2INT < 6582527 || RGB2INT > 16777158) {
            msg.channel.send(color + " **will** have a red glitch in lobby.");
        } else {
            msg.channel.send(color + " **won't** have a red glitch in lobby.");
        }
    }
}
