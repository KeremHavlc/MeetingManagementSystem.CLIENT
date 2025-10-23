import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const defaultFrom = { opacity: 0, y: 40 };
const defaultTo = { opacity: 1, y: 0 };

export default function SplitText({
  text = "",
  className = "",
  delay = 90,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = defaultFrom,
  to = defaultTo,
  threshold = 0.1,
  rootMargin = "0px",
  textAlign = "left",
  onLetterAnimationComplete = () => {},
}) {
  const containerRef = useRef(null);
  const lettersRef = useRef([]);

  const split = (str) => {
    if (splitType === "words") {
      return str.split(" ").map((w, i) => ({
        key: i,
        text: w + (i < str.split(" ").length - 1 ? " " : ""),
      }));
    }
    return Array.from(str).map((ch, i) => ({ key: i, text: ch }));
  };

  useEffect(() => {
    lettersRef.current = lettersRef.current.slice(0, text.length || 0);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elms = lettersRef.current.filter(Boolean);
            gsap.killTweensOf(elms);
            gsap.set(elms, from);
            gsap.to(elms, {
              y: to.y ?? 0,
              opacity: to.opacity ?? 1,
              duration: duration,
              ease: ease,
              stagger: {
                each: delay / 1000,
              },
              onComplete: onLetterAnimationComplete,
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: threshold, rootMargin }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [text, delay, duration, ease, from, to, splitType, threshold, rootMargin]);

  const parts = split(text);

  return (
    <div ref={containerRef} style={{ textAlign }} className={className}>
      {parts.map((part, idx) => {
        const content = part.text === " " ? "\u00A0" : part.text;
        return (
          <span
            key={part.key ?? idx}
            ref={(el) => (lettersRef.current[idx] = el)}
            style={{ display: "inline-block", whiteSpace: "pre" }}
            aria-hidden="true"
          >
            {content}
          </span>
        );
      })}
    </div>
  );
}
