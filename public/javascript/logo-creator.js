const canvas = document.getElementById('logoCanvas');
const ctx = canvas.getContext('2d');

// Update image source to the correct path
const baseImageSrc = '../img/template.png';  // Updated path for the base image
const boldFontSrc = '../fonts/quadraat-bold.ttf';  // Updated path for the bold font
const regularFontSrc = '../fonts/quadraat.ttf';  // Updated path for the regular font

// Update canvas dimensions
canvas.width = 2905;
canvas.height = 822;

// Load fonts
const loadFont = (name, url) => {
    const font = new FontFace(name, `url(${url})`);
    return font.load().then(loadedFont => {
        document.fonts.add(loadedFont);
        return loadedFont;
    });
};

// Load fonts and base image
Promise.all([
    loadFont('FFQuadraatSansProBold', boldFontSrc),
    loadFont('QuadraatSansRegular', regularFontSrc),
    loadImage(baseImageSrc)  // Load only the base image
]).then(([boldFont, regularFont, baseImage]) => {
    window.baseImage = baseImage;
    updatePreview();
});

// Function to load an image
function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

// Function to update the preview on the canvas
function updatePreview() {
    const irishText = document.getElementById('irishText').value;
    const secondText = document.getElementById('secondText').value;
    const charLimit = parseInt(document.getElementById('charLimit').value, 10);

    const irishTextY1 = parseInt(document.getElementById('irishTextY2').value, 10); // Swapped
    const irishTextY2 = parseInt(document.getElementById('irishTextY1').value, 10); // Swapped

    const secondTextY1 = parseInt(document.getElementById('secondTextY1').value, 10);
    const secondTextY2 = parseInt(document.getElementById('secondTextY2').value, 10);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(window.baseImage, 0, 0, canvas.width, canvas.height);

    drawText(irishText, 'FFQuadraatSansProBold', '#004D44', 827, 367, charLimit, true, irishTextY1, irishTextY2);
    drawText(secondText, 'QuadraatSansRegular', '#004D44', 827, 538, charLimit, false, secondTextY1, secondTextY2);
}

// Function to draw text on the canvas
function drawText(text, font, color, x, y, charLimit, isBold, y1, y2) {
    ctx.font = `165px ${font}`;
    ctx.fillStyle = color;

    if (text.length > charLimit) {
        let firstLine = '';
        let secondLine = '';
        const words = text.split(' ');
        for (let i = 0; i < words.length; i++) {
            if (firstLine.length + words[i].length + 1 <= charLimit) {
                firstLine += words[i] + ' ';
            } else {
                secondLine = words.slice(i).join(' ');
                break;
            }
        }

        ctx.fillText(firstLine.trim(), x, y1);
        ctx.fillText(secondLine.trim(), x, y2);
    } else {
        ctx.fillText(text, x, y);
    }
}

// Function to save the image
function saveImage(variant) {
    let textColor = '#004D44';  // Set the default text color

    // Use base image for all variants since we removed other images
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(window.baseImage, 0, 0, canvas.width, canvas.height);

    const irishText = document.getElementById('irishText').value;
    const secondText = document.getElementById('secondText').value;
    const charLimit = parseInt(document.getElementById('charLimit').value, 10);

    const irishTextY1 = parseInt(document.getElementById('irishTextY2').value, 10); // Swapped
    const irishTextY2 = parseInt(document.getElementById('irishTextY1').value, 10); // Swapped

    const secondTextY1 = parseInt(document.getElementById('secondTextY1').value, 10);
    const secondTextY2 = parseInt(document.getElementById('secondTextY2').value, 10);

    drawText(irishText, 'FFQuadraatSansProBold', textColor, 827, 367, charLimit, true, irishTextY1, irishTextY2);
    drawText(secondText, 'QuadraatSansRegular', textColor, 827, 538, charLimit, false, secondTextY1, secondTextY2);

    const link = document.createElement('a');
    link.download = `logo_standard.png`;  // Default filename
    link.href = canvas.toDataURL('image/png');
    link.click();

    closeSaveImageModal();
}

// Function to show save image modal
function showSaveImageModal() {
    document.getElementById('saveImageModal').classList.remove('hidden');
    document.getElementById('saveImageModal').style.display = 'flex';
}

// Function to close save image modal
function closeSaveImageModal() {
    document.getElementById('saveImageModal').classList.add('hidden');
    document.getElementById('saveImageModal').style.display = 'none';
}

// Function to toggle additional settings
function toggleAdditionalSettings() {
    const additionalSettings = document.getElementById('additionalSettings');
    additionalSettings.classList.toggle('hidden');
}

// Function to update character limit display
function updateCharLimitValue() {
    const charLimit = document.getElementById('charLimit').value;
    document.getElementById('charLimitValue').textContent = charLimit;
}
