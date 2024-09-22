import React, { useState, useRef, useEffect } from 'react';
import colorNamer from 'color-namer';
import {
    rgbToHex,
    rgbToHsl,
    rgbToCmyk,
    calculateLuminance,
    calculateColorTemperature,
    calculateDominantWavelength
} from './colorUtils'; // Ensure this path is correct

function ImageColorPicker() {
    const [color, setColor] = useState("#FFFFFF");
    const [colorName, setColorName] = useState("White");
    const [rgb, setRGB] = useState("255, 255, 255");
    const [hsl, setHSL] = useState("0, 0%, 100%");
    const [cmyk, setCMYK] = useState("0%, 0%, 0%, 0%");
    const [luminance, setLuminance] = useState(1);
    const [colorTemp, setColorTemp] = useState(6500);
    const [wavelength, setWavelength] = useState(555);
    const [imageSrc, setImageSrc] = useState(null);
    const [isColorLocked, setIsColorLocked] = useState(false);
    const canvasRef = useRef(null);
    const canvasWidth = 400;
    const canvasHeight = 300;

    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleMouseMove(event) {
        if (!isColorLocked) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const rect = canvas.getBoundingClientRect();
            const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
            const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));

            if (x >= 0 && x < canvas.width && y >= 0 && y < canvas.height) {
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const r = pixel[0], g = pixel[1], b = pixel[2];

                const hexColor = rgbToHex(r, g, b);
                setColor(hexColor);
                setRGB([r, g, b].join(", "));
                setHSL(rgbToHsl(r, g, b));
                setCMYK(rgbToCmyk(r, g, b));
                setLuminance(calculateLuminance(r, g, b).toFixed(2));
                setColorTemp(calculateColorTemperature(r, g, b));
                setWavelength(calculateDominantWavelength(r, g, b));

                const namedColor = colorNamer(hexColor, { format: 'hex' });
                const htmlColorName = namedColor.html[0]?.name || "Unknown Color";
                setColorName(htmlColorName);
            }
        }
    }

    function handleCanvasClick() {
        if (!isColorLocked) {
            setIsColorLocked(true);
        } else {
            setIsColorLocked(false);
        }
    }

    useEffect(() => {
        if (imageSrc) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const image = new Image();
            image.src = imageSrc;

            image.onload = () => {
                ctx.clearRect(0, 0, canvasWidth, canvasHeight);
                const ratio = Math.min(canvasWidth / image.width, canvasHeight / image.height);
                const scaledWidth = image.width * ratio;
                const scaledHeight = image.height * ratio;
                const xOffset = (canvasWidth - scaledWidth) / 2;
                const yOffset = (canvasHeight - scaledHeight) / 2;
                ctx.drawImage(image, xOffset, yOffset, scaledWidth, scaledHeight);
            };
        }
    }, [imageSrc]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            alert("Copied to clipboard!");
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    return (
        <>
            <h1>Image Color Picker</h1>
            <div className="color-picker-container">
                <div className="upload-section">
                    <h2>Upload Image</h2>
                    <input type="file" accept="image/*" onChange={handleImageUpload} />
                    {imageSrc && (
                        <canvas
                            ref={canvasRef}
                            onMouseMove={handleMouseMove}
                            onClick={handleCanvasClick}
                            width={canvasWidth}
                            height={canvasHeight}
                            className="image-canvas"
                        />
                    )}
                </div>

                <div className="info-section">
                    <h2>Color Information</h2>
                    <div className="color-display" style={{ backgroundColor: color }}>
                        <p>Selected Color: {colorName}</p>
                    </div>
                    <p>Hex Code: {color} <button onClick={() => copyToClipboard(color)}>Copy</button></p>
                    <p>RGB: {rgb} <button onClick={() => copyToClipboard(rgb)}>Copy</button></p>
                    <p>HSL: {hsl} <button onClick={() => copyToClipboard(hsl)}>Copy</button></p>
                    <p>CMYK: {cmyk} <button onClick={() => copyToClipboard(cmyk)}>Copy</button></p>
                    <p>Luminance: {luminance} <button onClick={() => copyToClipboard(luminance)}>Copy</button></p>
                    <p>Color Temperature: {colorTemp}K <button onClick={() => copyToClipboard(colorTemp)}>Copy</button></p>
                    <p>Dominant Wavelength: {wavelength} nm <button onClick={() => copyToClipboard(wavelength)}>Copy</button></p>
                </div>
            </div>
        </>
    );
}

export default ImageColorPicker;
