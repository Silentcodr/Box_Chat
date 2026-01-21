import React from "react";
import { createRoot } from "react-dom/client";
import PresenceWidget from "./PresenceWidget";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<PresenceWidget fullPage={true} />);
