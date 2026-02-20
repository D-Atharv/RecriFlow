"use client";

import { useEffect, useState, useRef } from "react";

function StatCounter({
  end,
  decimals = 0,
  suffix = "",
  prefix = "",
  delay = 0,
}: {
  end: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  delay?: number;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTimestamp: number | null = null;
    const duration = 2000; // 2 seconds animation
    let animationFrame: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp - delay;

      if (elapsed < 0) {
        animationFrame = window.requestAnimationFrame(step);
        return;
      }

      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out

      setCount(easeProgress * end);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, isVisible, delay]);

  return (
    <div
      ref={ref}
      className={`text-6xl md:text-[5.5rem] leading-none font-sans font-medium text-gray-900 tracking-tight transition-all duration-1000 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}`}
    >
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </div>
  );
}

export function StatsSection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <StatCounter end={10.6} decimals={1} suffix="x" delay={0} />
            <p className="text-[17px] text-gray-600 font-medium mt-6">
              Faster hiring
            </p>
          </div>
          <div>
            <StatCounter end={37} suffix="%" delay={200} />
            <p className="text-[17px] text-gray-600 font-medium mt-6">
              Interview increase
            </p>
          </div>
          <div>
            <StatCounter end={4.8} decimals={1} suffix="x" delay={400} />
            <p className="text-[17px] text-gray-600 font-medium mt-6">
              Recruiter efficiency
            </p>
          </div>
        </div>

        <div className="w-full h-px bg-gray-200 mt-20 mb-16"></div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12">
          <div className="md:pr-12 lg:pr-16 md:border-r border-gray-200">
            <div className="mb-6 flex">
              <span className="material-icons-outlined text-3xl text-gray-800">analytics</span>
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Drive Placement</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              RecriFlow&apos;s platform is built to help enterprises grow. Optimised to eliminate friction and instantly deliver higher conversion.
            </p>
          </div>

          <div className="md:px-12 lg:px-16 md:border-r border-gray-200">
            <div className="mb-6 flex">
              <span className="material-icons-outlined text-3xl text-gray-800">lock_outline</span>
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Future-proof screening</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              A powerful policy engine translates resume intelligence into structured data - enabling the industry&apos;s most detailed insights.
            </p>
          </div>

          <div className="md:pl-12 lg:pl-16">
            <div className="mb-6 flex">
              <span className="material-icons-outlined text-3xl text-gray-800">remove_circle_outline</span>
            </div>
            <h3 className="text-[17px] font-semibold text-gray-900 mb-3">Reduce overhead</h3>
            <p className="text-gray-500 text-[15px] leading-relaxed">
              Eliminate manual data entry, endless emails and lengthy reviews - by automating manual work with compliant, auditable AI.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
