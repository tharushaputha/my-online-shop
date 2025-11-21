"use client";
import { useEffect, useState } from "react";

export default function LogoLoader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    function onLoad() {
      setTimeout(() => setHidden(true), 1300); // wait for animation to finish
    }

    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <>
      {!hidden && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#071722",
            zIndex: 9999,
            transition: "opacity .45s ease",
            opacity: hidden ? 0 : 1,
          }}
        >
          <object
            data="/logo_loader.svg"
            type="image/svg+xml"
            width="320"
            height="320"
            aria-label="Logo loader"
          />
        </div>
      )}
    </>
  );
}
