let canvas = document.getElementById("canvas")
let video = document.getElementById("video")
var ctx = canvas.getContext("2d");
canvas.style.background = "black"

function convert2Grayscale(img) {
    for (let i = 0; i < img.data.length; i += 4) {
        g = (0.299 * img.data[i] + 0.587 * img.data[i + 1] + 0.114 * img.data[i + 2]) * img.data[i + 3] / 255;
        img.data[i] = g;
        img.data[i + 1] = g;
        img.data[i + 2] = g;
    }
    return img;
}

function edgeDetection(img) {
    ImgGray = convert2Grayscale(img)
    var Img2D = []
    for (let i = 0; i < ImgGray.height; i++) {
        Img2D[i] = [];
        for (let j = 0; j < ImgGray.width; j++) {
            const index = (i * ImgGray.width + j) * 4;
            Img2D[i][j] = ImgGray.data[index];
        }
    }

    for (let i = 1; i < ImgGray.height - 1; i++) {
        for (let j = 1; j < ImgGray.width - 1; j++) {
            gX = Img2D[i + 1][j + 1] + 2 * Img2D[i][j + 1] + Img2D[i - 1][j + 1] - Img2D[i + 1][j - 1] - 2 * Img2D[i][j - 1] - Img2D[i - 1][j - 1];
            gY = -Img2D[i + 1][j + 1] - 2 * Img2D[i + 1][j] - Img2D[i + 1][j - 1] + Img2D[i - 1][j + 1] + 2 * Img2D[i - 1][j] + Img2D[i - 1][j - 1];
            g = Math.sqrt(gX ** 2 + gY ** 2);
            const index = (i * ImgGray.width + j) * 4;
            ImgGray.data[index] = g;
            ImgGray.data[index + 1] = g;
            ImgGray.data[index + 2] = g;
        }
    }

    return ImgGray;
}

function drawFrame() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
    f = edgeDetection(frame);
    ctx.putImageData(f, 0, 0);
    if (!video.paused && !video.ended) {
        requestAnimationFrame(drawFrame);
    }
}

video.addEventListener("play", drawFrame);
