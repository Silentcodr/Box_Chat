import React from "react";
import { createRoot } from "react-dom/client";
import NotificationBadge from "./NotificationBadge";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
    <div style={{ padding: 20 }}>
        <NotificationBadge />
    </div>
);
