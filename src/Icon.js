const ASSETS_ROOT = `${process.env.PUBLIC_URL}/assets`;

function Icon({ path, name = null, size = null }) {
    const actualSize = size ? `${size}px` : "48px";
    const sizeStyle = { width: actualSize, height: actualSize };

    if (!path) {
        return <div style={sizeStyle} />
    }

    return <img src={`${ASSETS_ROOT}/icons/${path}.png`} alt={name} title={name} style={sizeStyle} />;
}

export { Icon };
