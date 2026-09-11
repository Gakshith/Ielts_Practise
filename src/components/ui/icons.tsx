/* Inline SVG only — never emoji. All icons inherit currentColor and are marked
   aria-hidden; the accessible name lives on the control that wraps them. */
import type { SVGProps } from "react";

const p = (d: string) => function Icon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d={d} />
    </svg>
  );
};

export const IconMenu = p("M4 7h16M4 12h16M4 17h16");
export const IconNote = p("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z");
export const IconBell = p("M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6M13.7 20a2 2 0 0 1-3.4 0");
export const IconWifi = p("M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01M2 9.5a15 15 0 0 1 20 0");
export const IconClose = p("M18 6 6 18M6 6l12 12");
export const IconCheck = p("M20 6 9 17l-5-5");
export const IconArrowRight = p("M5 12h14M13 5l7 7-7 7");
export const IconArrowLeft = p("M19 12H5M11 19l-7-7 7-7");
export const IconChevronRight = p("M9 18l6-6-6-6");
export const IconChevronLeft = p("M15 18l-6-6 6-6");
export const IconPlay = p("M6 4.5v15l13-7.5Z");
export const IconHeadphones = p("M3 16v-4a9 9 0 0 1 18 0v4M3 16a3 3 0 0 0 3 3h1v-6H6a3 3 0 0 0-3 3Zm18 0a3 3 0 0 1-3 3h-1v-6h1a3 3 0 0 1 3 3Z");
export const IconContrast = p("M12 3a9 9 0 1 0 0 18Zm0 0a9 9 0 0 1 0 18");
export const IconTextSize = p("M4 7V5h10v2M9 5v14M7 19h4M15 12v-1h6v1M18 11v8M16.5 19h3");
export const IconSend = p("M22 2 11 13M22 2l-7 20-4-9-9-4Z");
export const IconFlag = p("M4 21V4h13l-2 4 2 4H4");
export const IconClock = p("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM12 7v5l3 2");
export const IconTarget = p("M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-4.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM12 12h.01");
export const IconBook = p("M4 19.5V5a2 2 0 0 1 2-2h13v18H6.5A2.5 2.5 0 0 0 4 21.5M19 17H6.5A2.5 2.5 0 0 0 4 19.5");
export const IconMic = p("M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3ZM5 11a7 7 0 0 0 14 0M12 18v3");
export const IconPen = p("M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z");
export const IconUser = p("M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z");
export const IconChart = p("M3 21h18M7 21V10M12 21V4M17 21v-7");
export const IconSpark = p("M12 3l1.9 5.6L19.5 10l-5.6 1.9L12 17.5l-1.9-5.6L4.5 10l5.6-1.4L12 3Z");
export const IconVolume = p("M11 5 6 9H3v6h3l5 4V5ZM16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12");
