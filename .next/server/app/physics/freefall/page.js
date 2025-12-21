(()=>{var e={};e.id=128,e.ids=[128],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4052:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>l.a,__next_app__:()=>p,originalPathname:()=>x,pages:()=>c,routeModule:()=>h,tree:()=>d}),s(2935),s(1506),s(5866);var r=s(3191),a=s(8716),i=s(7922),l=s.n(i),n=s(5231),o={};for(let e in n)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>n[e]);s.d(t,o);let d=["",{children:["physics",{children:["freefall",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,2935)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\physics\\freefall\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,1506)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\physics\\freefall\\page.tsx"],x="/physics/freefall/page",p={require:s,loadChunk:()=>Promise.resolve()},h=new r.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/physics/freefall/page",pathname:"/physics/freefall",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},790:(e,t,s)=>{Promise.resolve().then(s.bind(s,3274)),Promise.resolve().then(s.bind(s,933)),Promise.resolve().then(s.bind(s,6618))},5747:(e,t,s)=>{Promise.resolve().then(s.bind(s,94)),Promise.resolve().then(s.bind(s,933)),Promise.resolve().then(s.bind(s,6618))},325:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2994,23)),Promise.resolve().then(s.t.bind(s,6114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,9671,23)),Promise.resolve().then(s.t.bind(s,1868,23)),Promise.resolve().then(s.t.bind(s,4759,23))},3274:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l});var r=s(326),a=s(434),i=s(7577);function l(){let[e,t]=(0,i.useState)(!1);return r.jsx("nav",{className:"bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-3",children:(0,r.jsxs)("div",{className:"max-w-7xl mx-auto px-4 flex items-center justify-between",children:[(0,r.jsxs)("div",{className:"flex items-center gap-3",children:[r.jsx("div",{className:"w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold",children:"OL"}),r.jsx("div",{className:"text-xl font-extrabold tracking-tight",children:"OpenLabs"})]}),r.jsx("button",{"aria-label":"Toggle menu","aria-expanded":e,className:"md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition",onClick:()=>t(e=>!e),children:(0,r.jsxs)("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[r.jsx("path",{d:"M4 6H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),r.jsx("path",{d:"M4 12H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),r.jsx("path",{d:"M4 18H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}),(0,r.jsxs)("ul",{className:`md:flex md:items-center md:gap-8 ${e?"flex flex-col absolute top-16 right-4 bg-white text-slate-800 p-4 rounded-lg shadow-lg w-48":"hidden"}`,children:[r.jsx("li",{children:r.jsx(a.default,{href:"/",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Home"})}),r.jsx("li",{children:r.jsx(a.default,{href:"/chemistry",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Chemistry"})}),r.jsx("li",{children:r.jsx(a.default,{href:"/physics",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Physics"})}),r.jsx("li",{children:r.jsx(a.default,{href:"/biology",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Biology"})}),r.jsx("li",{children:r.jsx(a.default,{href:"/login",className:"block px-3 py-2 rounded bg-white text-indigo-700 font-semibold shadow-sm hover:shadow-md",onClick:()=>t(!1),children:"Log In"})})]})]})})}},94:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l});var r=s(326),a=s(7577);let i="openlabs_freefall_runs_v1";function l({initialVelocity:e=0,initialGravity:t=9.8,initialHeight:s=5}){let l=(0,a.useRef)(null);(0,a.useRef)(null);let n=(0,a.useRef)(s),o=(0,a.useRef)(e),d=(0,a.useRef)(0),[c,x]=(0,a.useState)(e),[p,h]=(0,a.useState)(t),[m,u]=(0,a.useState)(s),[b,g]=(0,a.useState)(!1),[f,v]=(0,a.useState)(0),[y,j]=(0,a.useState)("y-t"),w=(0,a.useRef)([]);function k(){g(!1),d.current=0,n.current=m,o.current=c,w.current=[],v(0)}return(0,r.jsxs)("div",{className:"max-w-6xl mx-auto p-4 space-y-4",children:[r.jsx("h2",{className:"text-2xl font-semibold",children:"Free Fall — Virtual Physics Lab"}),r.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 text-center",children:[["Time",`${f.toFixed(2)} s`],["Height",`${n.current.toFixed(2)} m`],["Velocity",`${c.toFixed(2)} m/s`],["Gravity",`${p.toFixed(2)} m/s\xb2`]].map(([e,t])=>(0,r.jsxs)("div",{className:"bg-slate-100 p-3 rounded",children:[r.jsx("div",{className:"text-xs text-gray-500",children:e}),r.jsx("div",{className:"font-mono text-lg",children:t})]},e))}),r.jsx("div",{className:"flex gap-2",children:["y-t","v-t","a-t"].map(e=>r.jsx("button",{onClick:()=>j(e),className:`px-3 py-1 rounded border ${y===e?"bg-blue-600 text-white":""}`,children:e.toUpperCase()},e))}),(0,r.jsxs)("div",{className:"grid md:grid-cols-3 gap-4",children:[(0,r.jsxs)("div",{className:"bg-white p-4 rounded-xl shadow space-y-3",children:[r.jsx("label",{children:"Initial Velocity (m/s)"}),r.jsx("input",{type:"range",min:"-10",max:"10",step:"0.1",value:c,onChange:e=>{let t=+e.target.value;x(t),o.current=t,k()}}),r.jsx("label",{children:"Gravity (m/s\xb2)"}),r.jsx("input",{type:"range",min:"1",max:"20",step:"0.1",value:p,onChange:e=>h(+e.target.value)}),r.jsx("label",{children:"Initial Height (m)"}),r.jsx("input",{type:"number",value:m,onChange:e=>{let t=+e.target.value;u(t),n.current=t,k()},className:"w-full border rounded px-2 py-1"}),(0,r.jsxs)("div",{className:"flex gap-2",children:[r.jsx("button",{onClick:()=>g(e=>!e),className:"flex-1 bg-blue-600 text-white py-2 rounded",children:b?"Pause":"Start"}),r.jsx("button",{onClick:k,className:"flex-1 bg-gray-200 py-2 rounded",children:"Reset"})]}),(0,r.jsxs)("div",{className:"flex gap-2",children:[r.jsx("button",{onClick:function(){let e=[["# OpenLabs Virtual Physics Laboratory"],["# Experiment: Free Fall"],[`# Date: ${new Date().toLocaleString()}`],[`# Initial Height (m): ${m}`],[`# Gravity (m/s^2): ${p}`],[`# Initial Velocity (m/s): ${c}`],["#"]],t=w.current.map(e=>[e.t.toFixed(4),e.y.toFixed(4),e.v.toFixed(4)]),s=new Blob([[...e.map(e=>e.join(",")),"time_s,height_m,velocity_mps",...t.map(e=>e.join(","))].join("\n")],{type:"text/csv"}),r=URL.createObjectURL(s),a=document.createElement("a");a.href=r,a.download=`freefall_lab_${Date.now()}.csv`,a.click(),URL.revokeObjectURL(r)},className:"flex-1 bg-green-600 text-white py-1 rounded",children:"CSV"}),r.jsx("button",{onClick:function(){let e=JSON.parse(localStorage.getItem(i)||"[]");e.push({date:new Date().toISOString(),params:{gravity:p,height:m,velocity:c},data:w.current}),localStorage.setItem(i,JSON.stringify(e)),alert("Run saved")},className:"flex-1 bg-orange-500 text-white py-1 rounded",children:"Save"})]}),r.jsx("button",{onClick:function(){let e=w.current.slice(-200),t=`
<!DOCTYPE html>
<html>
<head>
  <title>Free Fall Lab Report</title>
  <style>
    body {
      font-family: "Segoe UI", Arial, sans-serif;
      margin: 32px;
      color: #111827;
    }
    h1 {
      text-align: center;
      margin-bottom: 4px;
    }
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 24px;
    }
    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
    }
    .card {
      background: #f9fafb;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 13px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 6px 8px;
      text-align: right;
    }
    th {
      background: #f3f4f6;
      text-align: center;
    }
    .footer {
      margin-top: 32px;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
    }
    .print-btn {
      margin-top: 24px;
      text-align: center;
    }
    button {
      padding: 8px 16px;
      font-size: 14px;
    }
  </style>
</head>

<body>
  <h1>FREE FALL LAB REPORT</h1>
  <div class="subtitle">Uniformly Accelerated Motion under Gravity</div>

  <h2>Experiment Details</h2>
  <div class="grid">
    <div class="card"><strong>Initial Height:</strong> ${m.toFixed(2)} m</div>
    <div class="card"><strong>Gravity:</strong> ${p.toFixed(2)} m/s\xb2</div>
    <div class="card"><strong>Total Time:</strong> ${f.toFixed(2)} s</div>
    <div class="card"><strong>Final Velocity:</strong> ${c.toFixed(2)} m/s</div>
  </div>

  <h2>Observation Table</h2>
  <table>
    <thead>
      <tr>
        <th>Time (s)</th>
        <th>Height (m)</th>
        <th>Velocity (m/s)</th>
      </tr>
    </thead>
    <tbody>
      ${e.map(e=>`
        <tr>
          <td>${e.t.toFixed(3)}</td>
          <td>${e.y.toFixed(3)}</td>
          <td>${e.v.toFixed(3)}</td>
        </tr>
      `).join("")}
    </tbody>
  </table>

  <div class="footer">
    Generated by OpenLabs Virtual Physics Laboratory<br/>
    ${new Date().toLocaleString()}
  </div>

  <div class="print-btn">
    <button onclick="window.print()">Print / Save as PDF</button>
  </div>
</body>
</html>
`,s=window.open("","_blank");s.document.write(t),s.document.close()},className:"w-full bg-indigo-600 text-white py-1 rounded",children:"Printable Report (PDF)"})]}),r.jsx("div",{className:"md:col-span-2 bg-white p-3 rounded-xl shadow",children:r.jsx("canvas",{ref:l,className:"w-full rounded"})})]})]})}},1506:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o,metadata:()=>n});var r=s(9510);s(7272),s(1159);var a=s(5782);let i=(0,a.default)(()=>s.e(700).then(s.bind(s,1700)),{loadableGenerated:{modules:["app\\layout.tsx -> ./components/Navbar"]},ssr:!1}),l=(0,a.default)(()=>s.e(267).then(s.bind(s,4267)),{loadableGenerated:{modules:["app\\layout.tsx -> ./components/Footer"]},ssr:!1}),n={title:"OpenLabs",description:"Interactive physics and chemistry experiments"};function o({children:e}){return r.jsx("html",{lang:"en",children:(0,r.jsxs)("body",{children:[r.jsx(i,{}),r.jsx("div",{className:"max-w-7xl mx-auto rounded-xl p-4 md:p-10 my-6 w-full mt-6",children:r.jsx("main",{children:e})}),r.jsx(l,{})]})})}},2935:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>i});var r=s(9510);s(1159);let a=(0,s(5782).default)(()=>s.e(390).then(s.bind(s,9390)),{loadableGenerated:{modules:["app\\physics\\freefall\\page.tsx -> ../../components/physics/FreeFallLab"]},ssr:!1,loading:()=>r.jsx("p",{className:"p-6",children:"Loading Hooke's law…"})});function i(){return r.jsx("main",{className:"min-h-screen p-6",children:(0,r.jsxs)("div",{className:"max-w-7xl mx-auto",children:[r.jsx("h1",{className:"text-2xl font-bold",children:"Free Fall Lab"}),r.jsx("p",{className:"text-gray-600 mb-4",children:"Free Fall demonstration virtual lab."}),r.jsx(a,{})]})})}},7272:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),r=t.X(0,[555],()=>s(4052));module.exports=r})();