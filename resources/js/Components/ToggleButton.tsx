// src/ToggleButton.tsx (démo)
import React, { useState } from "react";
export default function ToggleButton() {
const [on, setOn] = useState(false);
return <button onClick={() => setOn(v => !v)}>{on ? "On" : "Off"}</button>;
}