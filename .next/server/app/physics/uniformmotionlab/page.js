(()=>{var e={};e.id=540,e.ids=[540],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},9383:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>r.a,__next_app__:()=>x,originalPathname:()=>m,pages:()=>c,routeModule:()=>p,tree:()=>d}),s(6268),s(1506),s(5866);var i=s(3191),n=s(8716),a=s(7922),r=s.n(a),o=s(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);s.d(t,l);let d=["",{children:["physics",{children:["uniformmotionlab",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,6268)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\physics\\uniformmotionlab\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,1506)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\physics\\uniformmotionlab\\page.tsx"],m="/physics/uniformmotionlab/page",x={require:s,loadChunk:()=>Promise.resolve()},p=new i.AppPageRouteModule({definition:{kind:n.x.APP_PAGE,page:"/physics/uniformmotionlab/page",pathname:"/physics/uniformmotionlab",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},790:(e,t,s)=>{Promise.resolve().then(s.bind(s,3274)),Promise.resolve().then(s.bind(s,933)),Promise.resolve().then(s.bind(s,6618))},2575:(e,t,s)=>{Promise.resolve().then(s.bind(s,8725)),Promise.resolve().then(s.bind(s,933)),Promise.resolve().then(s.bind(s,6618))},325:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2994,23)),Promise.resolve().then(s.t.bind(s,6114,23)),Promise.resolve().then(s.t.bind(s,9727,23)),Promise.resolve().then(s.t.bind(s,9671,23)),Promise.resolve().then(s.t.bind(s,1868,23)),Promise.resolve().then(s.t.bind(s,4759,23))},3274:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});var i=s(326),n=s(434),a=s(7577);function r(){let[e,t]=(0,a.useState)(!1);return i.jsx("nav",{className:"bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white py-3",children:(0,i.jsxs)("div",{className:"max-w-7xl mx-auto px-4 flex items-center justify-between",children:[(0,i.jsxs)("div",{className:"flex items-center gap-3",children:[i.jsx("div",{className:"w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold",children:"OL"}),i.jsx("div",{className:"text-xl font-extrabold tracking-tight",children:"OpenLabs"})]}),i.jsx("button",{"aria-label":"Toggle menu","aria-expanded":e,className:"md:hidden p-2 rounded-md bg-white/10 hover:bg-white/20 transition",onClick:()=>t(e=>!e),children:(0,i.jsxs)("svg",{width:"22",height:"22",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[i.jsx("path",{d:"M4 6H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),i.jsx("path",{d:"M4 12H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"}),i.jsx("path",{d:"M4 18H20",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round"})]})}),(0,i.jsxs)("ul",{className:`md:flex md:items-center md:gap-8 ${e?"flex flex-col absolute top-16 right-4 bg-white text-slate-800 p-4 rounded-lg shadow-lg w-48":"hidden"}`,children:[i.jsx("li",{children:i.jsx(n.default,{href:"/",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Home"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/chemistry",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Chemistry"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/physics",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Physics"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/biology",className:"block px-3 py-2 rounded hover:bg-slate-50/20 transition",onClick:()=>t(!1),children:"Biology"})}),i.jsx("li",{children:i.jsx(n.default,{href:"/login",className:"block px-3 py-2 rounded bg-white text-indigo-700 font-semibold shadow-sm hover:shadow-md",onClick:()=>t(!1),children:"Log In"})})]})]})})}},8725:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>r});var i=s(326),n=s(7577);let a="openlabs_kinematics_runs_v1";function r({initialVelocity:e=1,initialAcceleration:t=0,initialPosition:s=0}){let r=(0,n.useRef)(null);(0,n.useRef)(null);let o=(0,n.useRef)(s),l=(0,n.useRef)(e),d=(0,n.useRef)(0),[c,m]=(0,n.useState)(e),[x,p]=(0,n.useState)(t),[u,h]=(0,n.useState)(!1),[b,g]=(0,n.useState)(0),[f,v]=(0,n.useState)(s),[y,j]=(0,n.useState)("x-t"),w=(0,n.useRef)([]);return(0,i.jsxs)("div",{className:"max-w-6xl mx-auto p-4 space-y-4",children:[i.jsx("h2",{className:"text-2xl font-semibold",children:"Kinematics — Uniform & Accelerated Motion Lab"}),i.jsx("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 text-center",children:[["Time",`${b.toFixed(2)} s`],["Position",`${f.toFixed(2)} m`],["Velocity",`${c.toFixed(2)} m/s`],["Acceleration",`${x.toFixed(2)} m/s\xb2`]].map(([e,t])=>(0,i.jsxs)("div",{className:"bg-slate-100 p-3 rounded shadow-sm",children:[i.jsx("div",{className:"text-xs text-gray-500",children:e}),i.jsx("div",{className:"font-mono text-lg",children:t})]},e))}),i.jsx("div",{className:"flex gap-2",children:[["x-t","Distance–Time"],["v-t","Velocity–Time"],["a-t","Acceleration–Time"]].map(([e,t])=>i.jsx("button",{onClick:()=>j(e),className:`px-3 py-1 rounded text-sm border ${y===e?"bg-blue-600 text-white":"bg-white text-gray-700"}`,children:t},e))}),(0,i.jsxs)("div",{className:"grid md:grid-cols-3 gap-4",children:[(0,i.jsxs)("div",{className:"bg-white p-4 rounded-xl shadow-md space-y-3",children:[i.jsx("label",{className:"text-sm",children:"Initial Velocity (m/s)"}),i.jsx("input",{type:"range",min:"-10",max:"10",step:"0.1",value:c,onChange:e=>{let t=+e.target.value;m(t),l.current=t}}),i.jsx("input",{type:"number",value:c,onChange:e=>{let t=+e.target.value;m(t),l.current=t},className:"w-full border rounded px-2 py-1"}),i.jsx("label",{className:"text-sm",children:"Acceleration (m/s\xb2)"}),i.jsx("input",{type:"range",min:"-5",max:"5",step:"0.1",value:x,onChange:e=>p(+e.target.value)}),i.jsx("input",{type:"number",value:x,onChange:e=>p(+e.target.value),className:"w-full border rounded px-2 py-1"}),(0,i.jsxs)("div",{className:"flex gap-2 pt-2",children:[i.jsx("button",{onClick:()=>h(e=>!e),className:"flex-1 py-2 bg-blue-600 text-white rounded",children:u?"Pause":"Start"}),i.jsx("button",{onClick:function(){h(!1),d.current=0,o.current=s,l.current=c,w.current=[],g(0),v(s)},className:"flex-1 py-2 bg-gray-200 rounded",children:"Reset"})]}),(0,i.jsxs)("div",{className:"flex gap-2",children:[i.jsx("button",{onClick:function(){let e=[["# Kinematics Lab Data Export"],[`# Date: ${new Date().toLocaleString()}`],[`# Initial Velocity (m/s): ${c}`],[`# Acceleration (m/s^2): ${x}`],["#"]],t=w.current.map(e=>[e.t.toFixed(4),e.x.toFixed(4),e.v.toFixed(4)]),s=new Blob([[...e.map(e=>e.join(",")),"time_s,position_m,velocity_mps",...t.map(e=>e.join(","))].join("\n")],{type:"text/csv"}),i=URL.createObjectURL(s),n=document.createElement("a");n.href=i,n.download=`kinematics_lab_${Date.now()}.csv`,n.click(),URL.revokeObjectURL(i)},className:"flex-1 py-1 bg-green-600 text-white rounded",children:"Export CSV"}),i.jsx("button",{onClick:function(){let e=JSON.parse(localStorage.getItem(a)||"[]");e.push({date:new Date().toISOString(),params:{velocity:c,acceleration:x},data:w.current}),localStorage.setItem(a,JSON.stringify(e)),alert("Run saved")},className:"flex-1 py-1 bg-orange-500 text-white rounded",children:"Save Run"})]}),i.jsx("button",{onClick:function(){let e=w.current.slice(-200),t=`
<!DOCTYPE html>
<html>
<head>
  <title>Kinematics Lab Report</title>
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
    h2 {
      margin-top: 28px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 4px;
    }
    .subtitle {
      text-align: center;
      color: #6b7280;
      margin-bottom: 24px;
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
  <h1>KINEMATICS LAB REPORT</h1>
  <div class="subtitle">Uniform & Uniformly Accelerated Motion</div>

  <h2>Experiment Details</h2>
  <div class="grid">
    <div class="card"><strong>Initial Velocity:</strong> ${c.toFixed(2)} m/s</div>
    <div class="card"><strong>Acceleration:</strong> ${x.toFixed(2)} m/s\xb2</div>
    <div class="card"><strong>Total Time:</strong> ${b.toFixed(2)} s</div>
    <div class="card"><strong>Final Position:</strong> ${f.toFixed(2)} m</div>
  </div>

  <h2>Observation Table</h2>
  <table>
    <thead>
      <tr>
        <th>Time (s)</th>
        <th>Position (m)</th>
        <th>Velocity (m/s)</th>
      </tr>
    </thead>
    <tbody>
      ${e.map(e=>`
        <tr>
          <td>${e.t.toFixed(3)}</td>
          <td>${e.x.toFixed(3)}</td>
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
`,s=window.open("","_blank");s.document.write(t),s.document.close()},className:"w-full mt-2 py-1 bg-indigo-600 text-white rounded",children:"Printable Report (PDF)"})]}),i.jsx("div",{className:"md:col-span-2 bg-white p-3 rounded-xl shadow-md",children:i.jsx("canvas",{ref:r,className:"w-full rounded-lg"})})]})]})}},1506:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>l,metadata:()=>o});var i=s(9510);s(7272),s(1159);var n=s(5782);let a=(0,n.default)(()=>s.e(700).then(s.bind(s,1700)),{loadableGenerated:{modules:["app\\layout.tsx -> ./components/Navbar"]},ssr:!1}),r=(0,n.default)(()=>s.e(267).then(s.bind(s,4267)),{loadableGenerated:{modules:["app\\layout.tsx -> ./components/Footer"]},ssr:!1}),o={title:"OpenLabs",description:"Interactive physics and chemistry experiments"};function l({children:e}){return i.jsx("html",{lang:"en",children:(0,i.jsxs)("body",{children:[i.jsx(a,{}),i.jsx("div",{className:"max-w-7xl mx-auto rounded-xl p-4 md:p-10 my-6 w-full mt-6",children:i.jsx("main",{children:e})}),i.jsx(r,{})]})})}},6268:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>a});var i=s(9510);s(1159);let n=(0,s(5782).default)(()=>s.e(117).then(s.bind(s,9117)),{loadableGenerated:{modules:["app\\physics\\uniformmotionlab\\page.tsx -> ../../components/physics/UniformMotionLab"]},ssr:!1,loading:()=>i.jsx("p",{className:"p-6",children:"Loading Wave Optics…"})});function a(){return i.jsx("main",{className:"min-h-screen p-6",children:(0,i.jsxs)("div",{className:"max-w-7xl mx-auto",children:[i.jsx("h1",{className:"text-2xl font-bold",children:"Uniform Motion Lab"}),i.jsx("p",{className:"text-gray-600 mb-4",children:"Uniform linear motion using a moving object."}),i.jsx(n,{})]})})}},7272:()=>{}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[555],()=>s(9383));module.exports=i})();