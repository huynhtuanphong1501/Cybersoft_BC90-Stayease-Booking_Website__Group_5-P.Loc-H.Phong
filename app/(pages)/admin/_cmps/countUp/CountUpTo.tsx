"use client";

import { useEffect, useRef } from "react";
import { CountUp } from "countup.js";
import type { CountUpProps } from "@/app/type";

export default function CountUpTo({
  value,
  duration = 1.5,
  prefix = "",
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const countUp = new CountUp(ref.current, value, {
      duration,
      separator: ",",
      prefix,
    });

    if (!countUp.error) {
      countUp.start();
    } else {
      console.error(countUp.error);
    }
  }, [value, duration, prefix]);

  return <span ref={ref} />;
}
