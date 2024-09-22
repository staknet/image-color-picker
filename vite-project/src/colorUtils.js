export function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

export function rgbToHsl(r, g, b) {
    r /= 255, g /= 255, b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
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

export function rgbToCmyk(r, g, b) {
    const c = 1 - (r / 255);
    const m = 1 - (g / 255);
    const y = 1 - (b / 255);
    const k = Math.min(c, m, y);
    const c1 = ((c - k) / (1 - k)) || 0;
    const m1 = ((m - k) / (1 - k)) || 0;
    const y1 = ((y - k) / (1 - k)) || 0;
    return `${Math.round(c1 * 100)}%, ${Math.round(m1 * 100)}%, ${Math.round(y1 * 100)}%, ${Math.round(k * 100)}%`;
}

export function calculateLuminance(r, g, b) {
    const a = [r, g, b].map(v => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
}

export function calculateColorTemperature(r, g, b) {
    return Math.round((r + g + b) / 3 * 100); // Approximation
}

export function calculateDominantWavelength(r, g, b) {
    return Math.round((r + g + b) / 3 + 400); // Approximation
}
