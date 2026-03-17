import React from 'react';

/**
 * A reusable icon used for the "added" / "wishlist" button state.
 *
 * Props:
 * - className: tailwind / css classes (e.g. "flex-shrink-0 text-white/70")
 * - ...props: other svg props (e.g. width, height)
 */
export default function AddedIcon({ className = '', ...props }) {
  return (
    <svg
      viewBox="0 0 100 110"
      fill="none"
      className={className}
      {...props}
      stroke="currentColor"
    >
      <rect x="10" y="30" width="80" height="70" rx="4" strokeWidth="7" fill="none" />
      <path
        d="M32 30 Q32 10 50 10 Q68 10 68 30"
        strokeWidth="7"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M10 68 Q18 60 28 63 Q36 65 40 72"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 68 Q6 75 10 80"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M28 63 Q30 55 35 57"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M33 62 Q35 54 40 56"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M38 63 Q40 56 45 58"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M90 68 Q82 60 72 63 Q64 65 60 72"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M90 68 Q94 75 90 80"
        strokeWidth="4.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M72 63 Q70 55 65 57"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M67 62 Q65 54 60 56"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M62 63 Q60 56 55 58"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
