/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode } from "react";

interface TrackedButtonProps {
  children: ReactNode;
  eventName: string;
  eventData?: Record<string, any>;
  className?: string;
  onClick?: () => void;
}

declare global {
  interface Window {
    dataLayer?: any[];
    twq?: (action: string, eventId: string, data?: any) => void;
  }
}

export function TrackedButton({ children, eventName, eventData = {}, className, onClick }: TrackedButtonProps) {
  const handleClick = () => {
    if (typeof window !== "undefined" && window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...eventData,
      });
    }

    // Track X/Twitter lead event for signup-related buttons
    if (typeof window !== "undefined" && window.twq) {
      if (["signup"].some(event => eventName.toLowerCase().includes(event))) {
        window.twq("event", "tw-qj0po-qjdz6", {});
      }
      if (["demo"].some(event => eventName.toLowerCase().includes(event))) {
        window.twq("event", "tw-qj0po-qje0f", {});
      }
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}
