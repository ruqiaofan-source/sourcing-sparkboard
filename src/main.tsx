import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const loadStart = performance.now();
const MIN_DISPLAY_MS = 1400;

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

requestAnimationFrame(() => {
  const elapsed = performance.now() - loadStart;
  const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

  setTimeout(() => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
      preloader.classList.add("hide");
      setTimeout(() => preloader.remove(), 900);
    }
  }, remaining);
});
