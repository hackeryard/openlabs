interface PreviewProps {
  html: string;
  css: string;
  js: string;
}

export default function PreviewPanel({ html, css, js }: PreviewProps) {
  const srcDoc = `
    <html>
      <head><style>body { background: white; margin: 0; padding: 20px; font-family: sans-serif; } ${css}</style></head>
      <body>
        ${html}
        <script>
          const log = console.log;
          console.log = (msg) => { window.parent.postMessage({ type: "log", msg: JSON.stringify(msg) }, "*"); log(msg); };
          window.onerror = (err) => { window.parent.postMessage({ type: "log", msg: "ERROR: " + err }, "*"); };
          try { ${js} } catch (e) { console.log(e.message); }
        </script>
      </body>
    </html>
  `;

  return <iframe title="preview" sandbox="allow-scripts" srcDoc={srcDoc} className="w-full h-full border-none" />;
}