(()=>{var e={};e.id=550,e.ids=[550],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},6789:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>a.a,__next_app__:()=>p,originalPathname:()=>h,pages:()=>c,routeModule:()=>m,tree:()=>d}),s(3256),s(1506),s(5866);var i=s(3191),n=s(8716),r=s(7922),a=s.n(r),l=s(5231),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);s.d(t,o);let d=["",{children:["physics",{children:["speedoflight",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,3256)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\physics\\speedoflight\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,1506)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\physics\\speedoflight\\page.tsx"],h="/physics/speedoflight/page",p={require:s,loadChunk:()=>Promise.resolve()},m=new i.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/physics/speedoflight/page",pathname:"/physics/speedoflight",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},790:(e,t,s)=>{Promise.resolve().then(s.bind(s,3274)),Promise.resolve().then(s.bind(s,933)),Promise.resolve().then(s.bind(s,6618))},2236:(e,t,s)=>{Promise.resolve().then(s.bind(s,55)),Promise.resolve().then(s.bind(s,933)),Promise.resolve().then(s.bind(s,6618))},325:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2994,23)),Promise.resolve().then(s.t.bind(s,6114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,9671,23)),Promise.resolve().then(s.t.bind(s,1868,23)),Promise.resolve().then(s.t.bind(s,4759,23))},3274:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});var i=s(326),n=s(434),r=s(7577);function a(){let[e,t]=(0,r.useState)(!1);return i.jsx("nav",{className:"bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-3",children:(0,i.jsxs)("div",{className:"max-w-7xl mx-auto px-4 flex items-center justify-between",children:[(0,i.jsxs)("div",{className:"flex items-center gap-3",children:[i.jsx("div",{className:"w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold",children:"OL"}),i.jsx("div",{className:"text-xl font-extrabold tracking-tight",children:"OpenLabs"})]}),i.jsx("button",{"aria-label":"Toggle menu","aria-expanded":e,className:"md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition",onClick:()=>t(e=>!e),children:(0,i.jsxs)("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("path",{d:"M4 6H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),i.jsx("path",{d:"M4 12H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),i.jsx("path",{d:"M4 18H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}),(0,i.jsxs)("ul",{className:`md:flex md:items-center md:gap-8 ${e?"flex flex-col absolute top-16 right-4 bg-white text-slate-800 p-4 rounded-lg shadow-lg w-48":"hidden"}`,children:[i.jsx("li",{children:i.jsx(n.default,{href:"/",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Home"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/chemistry",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Chemistry"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/physics",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Physics"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/biology",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Biology"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/login",className:"block px-3 py-2 rounded bg-white text-indigo-700 font-semibold shadow-sm hover:shadow-md",onClick:()=>t(!1),children:"Log In"})})]})]})})}},55:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o});var i=s(326),n=s(7577);let r="openlabs_light_speed_runs_v1",a={Vacuum:1,Air:1.0003,Water:1.33,Glass:1.5,Diamond:2.42},l={Vacuum:"#16a34a",Air:"#2563eb",Water:"#0ea5e9",Glass:"#9333ea",Diamond:"#dc2626"};function o(){let e=(0,n.useRef)(null);(0,n.useRef)(null);let t=(0,n.useRef)(0),s=(0,n.useRef)(Object.fromEntries(Object.keys(a).map(e=>[e,0]))),[o,d]=(0,n.useState)(0),[c,h]=(0,n.useState)(!1),[p,m]=(0,n.useState)("d-t"),x=(0,n.useRef)([]);return(0,i.jsxs)("div",{className:"max-w-6xl mx-auto p-4 space-y-4",children:[i.jsx("h2",{className:"text-2xl font-semibold",children:"Speed of Light in Different Media — Comparison Lab"}),(0,i.jsxs)("div",{className:"grid md:grid-cols-3 gap-4 items-start",children:[(0,i.jsxs)("div",{className:"bg-white p-4 rounded shadow space-y-3",children:[(0,i.jsxs)("div",{className:"flex flex-col gap-2",children:[i.jsx("button",{onClick:()=>h(e=>!e),className:"bg-blue-600 text-white py-2 rounded",children:c?"Pause":"Start"}),i.jsx("button",{onClick:function(){h(!1),t.current=0,Object.keys(a).forEach(e=>s.current[e]=0),x.current=[],d(0)},className:"bg-gray-200 py-2 rounded",children:"Reset"}),i.jsx("button",{onClick:()=>m(e=>"d-t"===e?"v-t":"d-t"),className:"bg-slate-200 py-2 rounded",children:"Toggle Graph"})]}),i.jsx("hr",{}),(0,i.jsxs)("div",{className:"flex gap-2",children:[i.jsx("button",{onClick:function(){let e=new Blob([[["time_s",...Object.keys(a).map(e=>`${e}_distance_m`)],...x.current.map(e=>[e.t.toFixed(4),...Object.keys(a).map(t=>e.distances[t].toExponential(3))])].map(e=>e.join(",")).join("\n")],{type:"text/csv"}),t=URL.createObjectURL(e),s=document.createElement("a");s.href=t,s.download=`speed_of_light_${Date.now()}.csv`,s.click(),URL.revokeObjectURL(t)},className:"flex-1 bg-green-600 text-white py-1 rounded",children:"CSV"}),i.jsx("button",{onClick:function(){let e=JSON.parse(localStorage.getItem(r)||"[]");e.push({date:new Date().toISOString(),data:x.current}),localStorage.setItem(r,JSON.stringify(e)),alert("Run saved")},className:"flex-1 bg-orange-500 text-white py-1 rounded",children:"Save"})]}),i.jsx("button",{onClick:function(){let t=e.current?e.current.toDataURL("image/png"):"",i=Object.keys(a).reduce((e,t)=>a[e]<a[t]?e:t),n=Object.keys(a).reduce((e,t)=>a[e]>a[t]?e:t),r=`
<!DOCTYPE html>
<html>
<head>
  <title>Speed of Light – Lab Report</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      margin: 32px;
      color: #111827;
      line-height: 1.6;
    }

    h1 {
      text-align: center;
      margin-bottom: 4px;
      letter-spacing: 0.5px;
    }

    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 28px;
      font-size: 14px;
    }

    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
      font-size: 18px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .info-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 12px;
      font-size: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
      font-size: 13px;
    }

    th, td {
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: center;
    }

    th {
      background: #f3f4f6;
      font-weight: 600;
    }

    img {
      margin-top: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
    }

    .footer {
      margin-top: 36px;
      text-align: center;
      font-size: 12px;
      color: #6b7280;
    }

    .print-btn {
      margin-top: 24px;
      text-align: center;
    }

    button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
    }

    @media print {
      .print-btn {
        display: none;
      }
    }
  </style>
</head>

<body>

  <h1>SPEED OF LIGHT LAB REPORT</h1>
  <div class="subtitle">
    Comparison of Speed of Light in Different Media
  </div>

  <h2>Objectives</h2>
  <ul>
    <li>To study the variation of speed of light in different media.</li>
    <li>To understand the effect of refractive index on speed.</li>
    <li>To compare distances travelled by light in equal time intervals.</li>
  </ul>

  <h2>Theory</h2>
  <p>
    Light travels at its maximum speed in vacuum. When it enters a material
    medium, interactions with atoms cause a reduction in its speed.
    This reduction depends on the refractive index of the medium.
  </p>

  <h2>Formula Used</h2>
  <p style="font-size:16px; text-align:center;"><b>v = c / n</b></p>
  <ul>
    <li><b>v</b> = speed of light in medium (m/s)</li>
    <li><b>c</b> = speed of light in vacuum (3 \xd7 10⁸ m/s)</li>
    <li><b>n</b> = refractive index of the medium</li>
  </ul>

  <h2>Experiment Overview</h2>
  <div class="info-grid">
    <div class="info-card">
      <strong>Speed of Light in Vacuum (c):</strong><br/>
      3.000e+8 m/s
    </div>
    <div class="info-card">
      <strong>Total Time Elapsed:</strong><br/>
      ${o.toFixed(3)} s
    </div>
  </div>

  <h2>Observation Table</h2>
  <table>
    <thead>
      <tr>
        <th>Medium</th>
        <th>Refractive Index</th>
        <th>Speed (m/s)</th>
        <th>Distance Travelled (m)</th>
        <th>Time (s)</th>
      </tr>
    </thead>
    <tbody>
      ${Object.keys(a).map(e=>`
        <tr>
          <td>${e}</td>
          <td>${a[e]}</td>
          <td>${(3e8/a[e]).toExponential(3)}</td>
          <td>${s.current[e].toExponential(3)}</td>
          <td>${o.toFixed(3)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <h2>Graphical Analysis</h2>
  <p>Distance–Time comparison of light in different media:</p>
  ${t?`<img src="${t}" width="100%" />`:"<p>(Graph unavailable)</p>"}

  <h2>Conclusion</h2>
  <p>
    From the experiment, it is observed that light travels fastest in
    <b>${i}</b> and slowest in <b>${n}</b>.
    This confirms that the speed of light decreases with increasing
    refractive index, validating the relation <b>v = c / n</b>.
  </p>

  <div class="footer">
    Generated by OpenLabs Virtual Physics Laboratory<br/>
    ${new Date().toLocaleString()}
  </div>

  <div class="print-btn">
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>

</body>
</html>
`,l=window.open("","_blank");l.document.write(r),l.document.close()},className:"w-full bg-indigo-600 text-white py-1 rounded",children:"PDF"})]}),i.jsx("div",{className:"md:col-span-2",children:i.jsx(function(){return!e.current||x.current.length<2?null:(0,i.jsxs)("div",{className:"bg-white p-3 rounded shadow",children:[(0,i.jsxs)("h3",{className:"text-sm font-semibold mb-2",children:["d-t"===p?"Distance–Time":"Velocity–Time"," Graph"]}),i.jsx("svg",{width:"100%",height:"200",viewBox:"0 0 500 200",children:Object.keys(a).map((e,t)=>{let s=x.current.at(-1).t,n="d-t"===p?Math.max(...x.current.map(t=>t.distances[e])):3e8,r=x.current.map(t=>{let i=t.t/s*480+10,r="d-t"===p?t.distances[e]:t.velocities[e];return`${i},${190-r/n*170}`});return i.jsx("polyline",{points:r.join(" "),fill:"none",stroke:l[e],strokeWidth:"2"},e)})})]})},{})})]}),i.jsx("div",{className:"bg-white p-3 rounded shadow",children:i.jsx("canvas",{ref:e,className:"w-full rounded"})}),(0,i.jsxs)("div",{className:"bg-white p-4 rounded shadow",children:[i.jsx("h3",{className:"font-semibold mb-2",children:"Results"}),(0,i.jsxs)("table",{className:"w-full text-sm border",children:[i.jsx("thead",{className:"bg-slate-100",children:(0,i.jsxs)("tr",{children:[i.jsx("th",{className:"border p-2",children:"Medium"}),i.jsx("th",{className:"border p-2",children:"Speed (m/s)"}),i.jsx("th",{className:"border p-2",children:"Distance (m)"}),i.jsx("th",{className:"border p-2",children:"Time (s)"})]})}),i.jsx("tbody",{children:Object.keys(a).map(e=>(0,i.jsxs)("tr",{children:[i.jsx("td",{className:"border p-2",children:e}),i.jsx("td",{className:"border p-2",children:(3e8/a[e]).toExponential(3)}),i.jsx("td",{className:"border p-2",children:s.current[e].toExponential(3)}),i.jsx("td",{className:"border p-2",children:o.toFixed(3)})]},e))})]})]})]})}},1506:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o,metadata:()=>l});var i=s(9510);s(7272),s(1159);var n=s(5782);let r=(0,n.default)(()=>s.e(700).then(s.bind(s,1700)),{loadableGenerated:{modules:["app\\layout.tsx -> ./components/Navbar"]},ssr:!1}),a=(0,n.default)(()=>s.e(267).then(s.bind(s,4267)),{loadableGenerated:{modules:["app\\layout.tsx -> ./components/Footer"]},ssr:!1}),l={title:"OpenLabs",description:"Interactive physics and chemistry experiments"};function o({children:e}){return i.jsx("html",{lang:"en",children:(0,i.jsxs)("body",{children:[i.jsx(r,{}),i.jsx("div",{className:"max-w-7xl mx-auto rounded-xl p-4 md:p-10 my-6 w-full mt-6",children:i.jsx("main",{children:e})}),i.jsx(a,{})]})})}},3256:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});var i=s(9510);s(1159);let n=(0,s(5782).default)(()=>s.e(539).then(s.bind(s,6539)),{loadableGenerated:{modules:["app\\physics\\speedoflight\\page.tsx -> ../../components/physics/SpeedOfLightLab"]},ssr:!1,loading:()=>i.jsx("p",{className:"p-6",children:"Loading Wave Optics…"})});function r(){return i.jsx("main",{className:"min-h-screen p-6",children:(0,i.jsxs)("div",{className:"max-w-7xl mx-auto",children:[i.jsx("h1",{className:"text-2xl font-bold",children:"Speed of Light Lab"}),i.jsx("p",{className:"text-gray-600 mb-4",children:"Demonstration of change in speed of light in defferent media."}),i.jsx(n,{})]})})}},7272:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[555],()=>s(6789));module.exports=i})();