import React, { useState } from 'react';

function ColorPicker() {
    const [color, setColor] = useState("#FFFFFF");
    const [rgb, setRGB] = useState("255, 255, 255");
    const [hsl, setHSL] = useState("0, 0%, 100%");
    const [cmyk, setCMYK] = useState("0%, 0%, 0%, 0%");
    const [luminance, setLuminance] = useState(1);
    const [colorTemp, setColorTemp] = useState(6500);
    const [wavelength, setWavelength] = useState(555);

    function handleColorChange(event) {
        const hex = event.target.value;
        setColor(hex);

        const rgbValues = hexToRgb(hex);
        setRGB(rgbValues.join(", "));

        const hslValues = rgbToHsl(...rgbValues);
        setHSL(hslValues);

        const cmykValues = rgbToCmyk(...rgbValues);
        setCMYK(cmykValues);

        const lum = calculateLuminance(...rgbValues);
        setLuminance(lum.toFixed(2));

        const temp = calculateColorTemperature(...rgbValues);
        setColorTemp(temp);

        const wl = calculateDominantWavelength(...rgbValues);
        setWavelength(wl);
    }

    return (
        <div className="color-picker-container">
            <h1>Color Picker</h1>
            <div className="color-display" style={{ backgroundColor: color }}>
                <p>Hex Code: {color}</p>
                <p>RGB: {rgb}</p>
                <p>HSL: {hsl}</p>
                <p>CMYK: {cmyk}</p>
                <p>Luminance: {luminance}</p>
                <p>Color Temperature: {colorTemp}K</p>
                <p>Dominant Wavelength: {wavelength} nm</p>
            </div>
            <label>Select a Color:</label>
            <input type="color" value={color} onChange={handleColorChange} />
        </div>
    );
}

// Function to convert Hex to RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

// Function to convert RGB to HSL
function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

// Function to convert RGB to CMYK
function rgbToCmyk(r, g, b) {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    const c1 = ((c - k) / (1 - k)) || 0;
    const m1 = ((m - k) / (1 - k)) || 0;
    const y1 = ((y - k) / (1 - k)) || 0;
    return `${Math.round(c1 * 100)}%, ${Math.round(m1 * 100)}%, ${Math.round(y1 * 100)}%, ${Math.round(k * 100)}%`;
}

// Function to calculate Luminance
function calculateLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

// Function to estimate Color Temperature (approximation)
function calculateColorTemperature(r, g, b) {
    // Approximate color temperature based on RGB values (simplified)
    return Math.round((r + g + b) / 3 * 100); // Scaled, typically between 1000K-10000K
}

// Function to estimate Dominant Wavelength (simplified model)
function calculateDominantWavelength(r, g, b) {
    // Simplified model, not scientifically accurate but provides an estimate
    return Math.round((r + g + b) / 3 + 400); // Approximate wavelength (400-700 nm range)
}

export default ColorPicker;
