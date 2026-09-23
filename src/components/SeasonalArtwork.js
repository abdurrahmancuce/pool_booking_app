import React from 'react';

const Snowflake = ({ x, y, size = 10 }) => (
    <g className="season-stroke season-float" transform={`translate(${x} ${y}) scale(${size / 12})`}>
        <path d="M0-10V10M-8.7-5 8.7 5M-8.7 5 8.7-5M0-10l-3 3M0-10l3 3M0 10l-3-3M0 10l3-3" />
    </g>
);

const Leaf = ({ x, y, rotate = 0, scale = 1 }) => (
    <g className="season-drift" transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
        <path className="season-warm" d="M0 0C20-16 39-11 43-7C38 10 19 20 0 0Z" />
        <path className="season-detail" d="M4-1C17-2 26-4 38-8M19-2l3 10M27-4l5 6" />
    </g>
);

const Flower = ({ x, y, scale = 1 }) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <path className="season-detail" d="M0 7V31M0 20c-7-8-13-5-15-2 5 6 10 7 15 5M0 16c7-8 13-5 15-2-5 6-10 7-15 5" />
        <g className="season-soft">
            <circle cx="0" cy="0" r="8" /><circle cx="-8" cy="4" r="8" /><circle cx="8" cy="4" r="8" /><circle cx="-5" cy="-7" r="8" /><circle cx="5" cy="-7" r="8" />
        </g>
        <circle className="season-warm" cy="1" r="5" />
    </g>
);

const Cloud = ({ x = 300, y = 70 }) => (
    <g transform={`translate(${x} ${y})`}>
        <path className="season-soft" d="M-44 21c-13 0-23-9-23-21 0-11 8-20 20-21 4-17 20-29 39-29 20 0 36 12 40 30 15 1 27 11 27 25 0 9-5 16-12 20H-44Z" />
    </g>
);

const Sun = ({ x = 385, y = 85, size = 46 }) => (
    <g className="season-pulse" transform={`translate(${x} ${y})`}>
        <circle className="season-warm" r={size} />
        {[0, 45, 90, 135].map((angle) => <path key={angle} className="season-detail" d={`M0 ${-size - 13}V${-size - 28}M0 ${size + 13}V${size + 28}`} transform={`rotate(${angle})`} />)}
    </g>
);

const WinterArt = ({ month }) => (
    <>
        <path className="season-ground" d="M182 286c62-38 119-22 167-4 49 18 96 11 151-10v48H170Z" />
        <Snowflake x={230} y={60} size={12} /><Snowflake x={292} y={112} size={8} /><Snowflake x={462} y={52} size={10} /><Snowflake x={480} y={145} size={7} />
        {month === 'january' && (
            <g className="season-object" transform="translate(376 177)">
                <circle className="season-primary" cy="72" r="43" /><circle className="season-primary" cy="15" r="31" />
                <circle className="season-dark" cx="-10" cy="8" r="3" /><circle className="season-dark" cx="10" cy="8" r="3" />
                <path className="season-warm" d="M2 16l27 7-27 4Z" /><path className="season-detail" d="M-13 29c9 7 18 7 26 0M-41 64l-34-22M41 64l33-24" />
                <path className="season-dark" d="M-29-13h58v9h-58zM-17-41h36v32h-36z" />
                <circle className="season-dark" cy="60" r="4" /><circle className="season-dark" cy="78" r="4" />
            </g>
        )}
        {month === 'february' && (
            <g className="season-object" transform="translate(378 108)">
                <path className="season-dark" d="M0-54-64 40h34l-47 62h57v52h40v-52h57L30 40h34Z" />
                <path className="season-primary" d="M-50 30c26 11 75 10 101-2M-58 88c33 13 85 12 118-2" />
                <circle className="season-warm" cx="60" cy="-18" r="22" />
            </g>
        )}
        {month === 'december' && (
            <g className="season-object" transform="translate(380 112)">
                <path className="season-dark" d="M0-62-62 34h31l-43 59h55v55h38V93h55L31 34h31Z" />
                <path className="season-primary" d="M-49 30c26 10 74 10 99-2M-58 87c33 12 84 12 117-2" />
                <circle className="season-warm" cx="0" cy="-53" r="8" /><circle className="season-warm" cx="-25" cy="42" r="6" /><circle className="season-warm" cx="27" cy="67" r="6" /><circle className="season-warm" cx="-38" cy="94" r="6" />
                <path className="season-detail" d="M-46 52c27 19 63 20 94 0M-55 104c35 19 76 19 111-1" />
            </g>
        )}
    </>
);

const SpringArt = ({ month }) => (
    <>
        <path className="season-ground" d="M180 292c70-28 126-19 181-4 51 14 91 4 139-13v45H170Z" />
        {month === 'march' && <><Cloud x={379} y={75} /><path className="season-rain" d="M327 116l-10 21M362 121l-10 21M397 118l-10 21M431 122l-10 21" /><g transform="translate(372 226)"><path className="season-detail" d="M0 55V0" /><path className="season-primary" d="M-1 20c-22-27-49-15-52-7 11 20 32 25 52 18M1 6c21-25 46-13 49-5-11 18-30 23-49 16" /></g></>}
        {month === 'april' && <><Cloud x={402} y={62} /><path className="season-rain" d="M348 105l-9 20M382 111l-9 20M417 108l-9 20M451 112l-9 20" /><g transform="translate(373 207)"><path className="season-warm" d="M-74 8c13-57 99-57 130 0Z" /><path className="season-detail" d="M-8 8v72c0 20 25 20 25 2" /></g><Flower x={465} y={245} scale={.8} /></>}
        {month === 'may' && <><Sun x={438} y={75} size={32} /><Flower x={295} y={225} scale={1.1} /><Flower x={365} y={208} scale={.9} /><Flower x={438} y={235} scale={1.2} /><path className="season-detail" d="M268 279c54-42 119-54 196-26" /><g className="season-soft" transform="translate(335 100)"><path d="M0 0c17-15 34-9 37 0-11 12-24 13-37 3C-13 13-26 12-37 0c3-9 20-15 37 0Z" /></g></>}
    </>
);

const SummerArt = ({ month }) => (
    <>
        <Sun x={414} y={72} size={month === 'july' ? 48 : 39} />
        <path className="season-wave" d="M190 248c35-23 70-23 105 0s70 23 105 0 70-23 105 0M190 276c35-23 70-23 105 0s70 23 105 0 70-23 105 0M220 303c29-18 58-18 87 0s58 18 87 0 58-18 87 0" />
        {month === 'june' && <g transform="translate(339 212) rotate(-8)"><ellipse className="season-warm" rx="67" ry="28" /><ellipse className="season-cutout" rx="31" ry="13" /><path className="season-detail" d="M-53-14c29 13 78 12 107-2" /></g>}
        {month === 'july' && <g transform="translate(340 126)"><path className="season-primary" d="M-92 35c25-77 146-77 184 0Z" /><path className="season-detail" d="M0 35v125M0 153c0 18 25 20 31 4" /><path className="season-warm" d="M0-32 13 35H-13Z" /></g>}
        {month === 'august' && <g transform="translate(350 148)"><path className="season-warm" d="M-93 27c27-70 137-70 176 0Z" /><path className="season-detail" d="M-5 27l-17 111M-60 170h130M-44 151h86" /></g>}
    </>
);

const AutumnArt = ({ month }) => (
    <>
        <path className="season-wind" d="M218 91c47-28 88-24 122 1 25 19 57 19 94-3M243 134c39-21 76-16 105 8 21 17 51 18 88-4" />
        {month === 'september' && <><Sun x={429} y={71} size={31} /><Leaf x={296} y={174} rotate={18} scale={1.1} /><Leaf x={401} y={207} rotate={-22} scale={.9} /><Leaf x={463} y={145} rotate={42} scale={.7} /></>}
        {month === 'october' && <><Leaf x={270} y={169} rotate={12} scale={1.15} /><Leaf x={350} y={213} rotate={-28} scale={.95} /><Leaf x={440} y={162} rotate={52} scale={1.1} /><Leaf x={474} y={244} rotate={-16} scale={.75} /><path className="season-detail" d="M213 295c75-19 153-19 236 0" /></>}
        {month === 'november' && <><Cloud x={401} y={74} /><path className="season-rain" d="M345 114l-10 25M380 120l-10 25M417 116l-10 25M452 122l-10 25" /><path className="season-detail" d="M292 280c46-33 85-76 116-129M363 208l-35-23M390 180l34-29M337 239l42 19" /><Leaf x={449} y={225} rotate={32} scale={.8} /></>}
    </>
);

const SeasonalArtwork = ({ month }) => {
    const winterMonths = ['december', 'january', 'february'];
    const springMonths = ['march', 'april', 'may'];
    const summerMonths = ['june', 'july', 'august'];

    return (
        <div className={`seasonal-art seasonal-art-${month}`} aria-hidden="true">
            <svg viewBox="0 0 520 320" role="presentation">
                <circle className="season-glow" cx="390" cy="160" r="128" />
                {winterMonths.includes(month) && <WinterArt month={month} />}
                {springMonths.includes(month) && <SpringArt month={month} />}
                {summerMonths.includes(month) && <SummerArt month={month} />}
                {!winterMonths.includes(month) && !springMonths.includes(month) && !summerMonths.includes(month) && <AutumnArt month={month} />}
            </svg>
        </div>
    );
};

export default SeasonalArtwork;
