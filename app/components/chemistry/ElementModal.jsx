"use client";
// src/components/ElementModal.jsx
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";


const AtomicModel3D = dynamic(
  () => import("./AtomicModel3D"),
  { ssr: false }
);



/* Helper: build image path from element name */
function getElementImageSrc(name) {
  if (!name) return null;

  return `/images/elements/${name
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "")
    }.jpg`;
}


/**
 * ElementModal
 * - Props:
 *   - element: object | null
 *   - onClose: () => void
 *
 * Accessible modal: traps focus minimally and closes on ESC or click outside.
 */
export default function ElementModal({ element, onClose }) {
  const closeRef = useRef(null);
  const dialogRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();

      // Simple focus trap (Tab / Shift+Tab)
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (closeRef.current) closeRef.current.focus();
  }, [element]);

  if (!element) return null;

  const {
    atomicNumber,
    symbol,
    name,
    atomicMass,
    category,
    electronConfiguration,
    electronConfig,
    yearDiscovered,
    electronegativity,
    period,
    group,
    block,
    summary,
  } = element;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={`element-${atomicNumber}-title`}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-auto"
        style={{ maxHeight: "90vh" }}
      >
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-start gap-4">
          <div className="flex gap-4 items-center">


            {/* Element Identity */}
            <div>
              <div className="text-xs text-gray-500">
                Atomic number {atomicNumber}
              </div>
              <div className="text-4xl font-extrabold">{symbol}</div>
              <div className="text-lg">{name}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            Close
          </button>
        </div>

        {/* Content */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Atomic mass</div>
            <div className="font-medium">{atomicMass ?? "—"}</div>

            <div className="mt-3 text-sm text-gray-600">Category</div>
            <div className="font-medium">{category ?? "—"}</div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <div className="text-sm text-gray-600">Period</div>
                <div className="font-medium">{period ?? "—"}</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Group</div>
                <div className="font-medium">{group ?? "—"}</div>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-600">Block</div>
            <div className="font-medium">{block ?? "—"}</div>

            <div className="mt-3 text-sm text-gray-600">
              Electron configuration
            </div>
            <div className="font-medium">
              {electronConfiguration || electronConfig || "—"}
            </div>

            <div className="mt-3 text-sm text-gray-600">Electronegativity</div>
            <div className="font-medium">{electronegativity ?? "—"}</div>

            <div className="mt-3 text-sm text-gray-600">Year discovered</div>
            <div className="font-medium">{yearDiscovered ?? "—"}</div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Summary / notes</div>
            <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
              {summary || "No summary available."}
            </div>
            {/* Element Image */}
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={getElementImageSrc(name)}
                alt={name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded border"
            onClick={() => {
              const payload = JSON.stringify(element, null, 2);

              if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard
                  .writeText(payload)
                  .then(() => {
                    alert("Copied JSON to clipboard");
                  })
                  .catch(() => {
                    fallbackCopy(payload);
                  });
              } else {
                fallbackCopy(payload);
              }
            }}
          >
            Copy JSON
          </button>

          {/* ✅ NEW BUTTON (ADDED) */}
          <button
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => {
              onClose();
              router.push(`/chemistry/periodictable/atom/${atomicNumber}`);
            }}
          >
            View Full 3D Model
          </button>
          <button
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
            onClick={() => {
              onClose();
              router.push(`/chemistry/electronic-configuration/${atomicNumber}`);
            }}
          >
            View Electronic Configuration
          </button>

          <button
            ref={closeRef}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={onClose}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

function fallbackCopy(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.top = "-9999px";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);

  textarea.focus();
  textarea.select();

  try {
    const successful = document.execCommand("copy");
    alert(successful ? "Copied JSON to clipboard" : "Copy failed");
  } catch {
    alert("Copy not supported in this browser");
  }

  document.body.removeChild(textarea);
}

