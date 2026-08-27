import "./PerfumeLoader.css";

// A themed loading animation for the shop's product grid — a perfume
// bottle with an animated spray puff, shown while real products are
// being fetched from the server (replaces the old mock-product flash).
const PerfumeLoader = () => {
  return (
    <div className="perfume-loader">
      <svg
        className="perfume-loader-svg"
        viewBox="0 0 220 260"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Spray puffs — small circles drifting up and fading, staggered */}
        <g className="spray-puffs">
          <circle className="puff puff-1" cx="150" cy="70" r="5" />
          <circle className="puff puff-2" cx="165" cy="55" r="4" />
          <circle className="puff puff-3" cx="140" cy="50" r="3.5" />
          <circle className="puff puff-4" cx="158" cy="35" r="3" />
          <circle className="puff puff-5" cx="172" cy="75" r="3.5" />
        </g>

        {/* Nozzle + trigger */}
        <rect x="118" y="78" width="34" height="12" rx="3" className="nozzle" />
        <rect x="146" y="72" width="14" height="8" rx="2" className="nozzle-tip" />
        <path
          d="M120 82 Q100 72 100 90"
          className="trigger"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Bottle cap */}
        <rect x="90" y="88" width="40" height="26" rx="4" className="cap" />

        {/* Bottle neck */}
        <rect x="98" y="112" width="24" height="16" className="neck" />

        {/* Bottle body */}
        <path
          d="M75 128 h70 a8 8 0 0 1 8 8 v90 a14 14 0 0 1 -14 14 h-58 a14 14 0 0 1 -14 -14 v-90 a8 8 0 0 1 8 -8 z"
          className="bottle-body"
        />

        {/* Liquid fill inside bottle */}
        <path
          d="M79 170 h62 v50 a12 12 0 0 1 -12 12 h-38 a12 12 0 0 1 -12 -12 z"
          className="liquid"
        />

        {/* Label */}
        <rect x="83" y="178" width="54" height="26" rx="3" className="label" />
      </svg>
      <p className="perfume-loader-text">Loading latest products...</p>
    </div>
  );
};

export default PerfumeLoader;
