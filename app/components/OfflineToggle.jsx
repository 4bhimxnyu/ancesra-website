"use client";

import { useState } from "react";

// The hero's "offline mode" switch. A toy, but it still works like a switch.
export default function OfflineToggle() {
  const [on, setOn] = useState(true);
  return (
    <button className="offline-toggle" type="button" role="switch" aria-checked={on} aria-label="Offline mode" onClick={() => setOn(!on)}>
      <span className="track"><span className="knob" /></span>
      <span className="toggle-text">
        <strong>offline mode</strong>
        <small>{on ? "on · always" : "off · ancesra doesn't mind"}</small>
      </span>
    </button>
  );
}
