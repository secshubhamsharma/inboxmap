export default function BrandLogo({ size = 32, uid = 'a' }) {
  const g = `im_grad_${uid}`
  const s = `im_shine_${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={g} x1="4" y1="2" x2="36" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ade80" />
          <stop offset="55%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
        <linearGradient id={s} x1="20" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="white" stopOpacity="0.18" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Background rounded square */}
      <rect width="40" height="40" rx="10" fill={`url(#${g})`} />

      {/* Glass shine at top */}
      <rect width="40" height="22" rx="10" fill={`url(#${s})`} />

      {/* Pin body — circle top */}
      <circle cx="20" cy="15.5" r="11" fill="white" />

      {/* Pin tail — triangle converging to point */}
      <path d="M13 22 Q20 36 27 22 Z" fill="white" />

      {/* Inner inbox lines — drawn in deep green so they sit inside the white pin */}
      <line x1="15" y1="11.5" x2="25" y2="11.5" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="15" y1="16"   x2="25" y2="16"   stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="15" y1="20.5" x2="21" y2="20.5" stroke="#15803d" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}
