(()=>{var e={};e.id=99,e.ids=[99],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},6122:(e,t,i)=>{"use strict";i.r(t),i.d(t,{GlobalError:()=>s.a,__next_app__:()=>f,originalPathname:()=>u,pages:()=>c,routeModule:()=>p,tree:()=>d}),i(4792),i(1506),i(5866);var n=i(3191),r=i(8716),a=i(7922),s=i.n(a),o=i(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);i.d(t,l);let d=["",{children:["chemistry",{children:["periodictable",{children:["atom",{children:["[atomicNumber]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,4792)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\chemistry\\periodictable\\atom\\[atomicNumber]\\page.tsx"]}]},{}]},{}]},{}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,1506)),"C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(i.t.bind(i,5866,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\Users\\rahul\\OneDrive\\Desktop\\Full Stack\\NextJS\\OpenLabs\\app\\chemistry\\periodictable\\atom\\[atomicNumber]\\page.tsx"],u="/chemistry/periodictable/atom/[atomicNumber]/page",f={require:i,loadChunk:()=>Promise.resolve()},p=new n.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/chemistry/periodictable/atom/[atomicNumber]/page",pathname:"/chemistry/periodictable/atom/[atomicNumber]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},7075:(e,t,i)=>{Promise.resolve().then(i.bind(i,5282))},5282:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>o});var n=i(326),r=i(5047),a=i(5383),s=i(1811);function o(){let{atomicNumber:e}=(0,r.useParams)(),t=Number(e),i=s.Z.find(e=>e.atomicNumber===t);return i?(0,n.jsxs)("div",{className:"min-h-screen bg-white p-6",children:[(0,n.jsxs)("h1",{className:"text-3xl font-bold text-center mb-2",children:[i.name," (",i.symbol,")"]}),(0,n.jsxs)("p",{className:"text-center text-gray-600 mb-6",children:["Atomic Number: ",i.atomicNumber]}),n.jsx("div",{className:"max-w-5xl mx-auto",children:n.jsx(a.Z,{atomicNumber:i.atomicNumber})})]}):n.jsx("div",{className:"p-10 text-center",children:"Element not found"})}},5383:(e,t,i)=>{"use strict";let n,r;i.d(t,{Z:()=>V});var a=i(326),s=i(33),o=i(8303),l=i(5353),d=i(7577),c=i(5797);let u=new c.Box3,f=new c.Vector3;class p extends c.InstancedBufferGeometry{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry",this.setIndex([0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5]),this.setAttribute("position",new c.Float32BufferAttribute([-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],3)),this.setAttribute("uv",new c.Float32BufferAttribute([-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],2))}applyMatrix4(e){let t=this.attributes.instanceStart,i=this.attributes.instanceEnd;return void 0!==t&&(t.applyMatrix4(e),i.applyMatrix4(e),t.needsUpdate=!0),null!==this.boundingBox&&this.computeBoundingBox(),null!==this.boundingSphere&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));let i=new c.InstancedInterleavedBuffer(t,6,1);return this.setAttribute("instanceStart",new c.InterleavedBufferAttribute(i,3,0)),this.setAttribute("instanceEnd",new c.InterleavedBufferAttribute(i,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let i;e instanceof Float32Array?i=e:Array.isArray(e)&&(i=new Float32Array(e));let n=new c.InstancedInterleavedBuffer(i,2*t,1);return this.setAttribute("instanceColorStart",new c.InterleavedBufferAttribute(n,t,0)),this.setAttribute("instanceColorEnd",new c.InterleavedBufferAttribute(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new c.WireframeGeometry(e.geometry)),this}fromLineSegments(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){null===this.boundingBox&&(this.boundingBox=new c.Box3);let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;void 0!==e&&void 0!==t&&(this.boundingBox.setFromBufferAttribute(e),u.setFromBufferAttribute(t),this.boundingBox.union(u))}computeBoundingSphere(){null===this.boundingSphere&&(this.boundingSphere=new c.Sphere),null===this.boundingBox&&this.computeBoundingBox();let e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(void 0!==e&&void 0!==t){let i=this.boundingSphere.center;this.boundingBox.getCenter(i);let n=0;for(let r=0,a=e.count;r<a;r++)f.fromBufferAttribute(e,r),n=Math.max(n,i.distanceToSquared(f)),f.fromBufferAttribute(t,r),n=Math.max(n,i.distanceToSquared(f));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}let m=parseInt(c.REVISION.replace(/\D+/g,""));class h extends c.ShaderMaterial{constructor(e){super({type:"LineMaterial",uniforms:c.UniformsUtils.clone(c.UniformsUtils.merge([c.UniformsLib.common,c.UniformsLib.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new c.Vector2(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${m>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(e){this.uniforms.diffuse.value=e}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(e){!0===e?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(e){this.uniforms.linewidth.value=e}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(e){!!e!="USE_DASH"in this.defines&&(this.needsUpdate=!0),!0===e?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(e){this.uniforms.dashScale.value=e}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(e){this.uniforms.dashSize.value=e}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(e){this.uniforms.dashOffset.value=e}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(e){this.uniforms.gapSize.value=e}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(e){this.uniforms.opacity.value=e}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(e){this.uniforms.resolution.value.copy(e)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(e){!!e!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),!0===e?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}let v=m>=125?"uv1":"uv2",y=new c.Vector4,x=new c.Vector3,g=new c.Vector3,b=new c.Vector4,S=new c.Vector4,w=new c.Vector4,_=new c.Vector3,E=new c.Matrix4,A=new c.Line3,L=new c.Vector3,U=new c.Box3,M=new c.Sphere,z=new c.Vector4;function O(e,t,i){return z.set(0,0,-t,1).applyMatrix4(e.projectionMatrix),z.multiplyScalar(1/z.w),z.x=r/i.width,z.y=r/i.height,z.applyMatrix4(e.projectionMatrixInverse),z.multiplyScalar(1/z.w),Math.abs(Math.max(z.x,z.y))}class B extends c.Mesh{constructor(e=new p,t=new h({color:16777215*Math.random()})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let e=this.geometry,t=e.attributes.instanceStart,i=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let e=0,r=0,a=t.count;e<a;e++,r+=2)x.fromBufferAttribute(t,e),g.fromBufferAttribute(i,e),n[r]=0===r?0:n[r-1],n[r+1]=n[r]+x.distanceTo(g);let r=new c.InstancedInterleavedBuffer(n,2,1);return e.setAttribute("instanceDistanceStart",new c.InterleavedBufferAttribute(r,1,0)),e.setAttribute("instanceDistanceEnd",new c.InterleavedBufferAttribute(r,1,1)),this}raycast(e,t){let i,a;let s=this.material.worldUnits,o=e.camera;null!==o||s||console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let l=void 0!==e.params.Line2&&e.params.Line2.threshold||0;n=e.ray;let d=this.matrixWorld,u=this.geometry,f=this.material;if(r=f.linewidth+l,null===u.boundingSphere&&u.computeBoundingSphere(),M.copy(u.boundingSphere).applyMatrix4(d),s)i=.5*r;else{let e=Math.max(o.near,M.distanceToPoint(n.origin));i=O(o,e,f.resolution)}if(M.radius+=i,!1!==n.intersectsSphere(M)){if(null===u.boundingBox&&u.computeBoundingBox(),U.copy(u.boundingBox).applyMatrix4(d),s)a=.5*r;else{let e=Math.max(o.near,U.distanceToPoint(n.origin));a=O(o,e,f.resolution)}U.expandByScalar(a),!1!==n.intersectsBox(U)&&(s?function(e,t){let i=e.matrixWorld,a=e.geometry,s=a.attributes.instanceStart,o=a.attributes.instanceEnd,l=Math.min(a.instanceCount,s.count);for(let a=0;a<l;a++){A.start.fromBufferAttribute(s,a),A.end.fromBufferAttribute(o,a),A.applyMatrix4(i);let l=new c.Vector3,d=new c.Vector3;n.distanceSqToSegment(A.start,A.end,d,l),d.distanceTo(l)<.5*r&&t.push({point:d,pointOnLine:l,distance:n.origin.distanceTo(d),object:e,face:null,faceIndex:a,uv:null,[v]:null})}}(this,t):function(e,t,i){let a=t.projectionMatrix,s=e.material.resolution,o=e.matrixWorld,l=e.geometry,d=l.attributes.instanceStart,u=l.attributes.instanceEnd,f=Math.min(l.instanceCount,d.count),p=-t.near;n.at(1,w),w.w=1,w.applyMatrix4(t.matrixWorldInverse),w.applyMatrix4(a),w.multiplyScalar(1/w.w),w.x*=s.x/2,w.y*=s.y/2,w.z=0,_.copy(w),E.multiplyMatrices(t.matrixWorldInverse,o);for(let t=0;t<f;t++){if(b.fromBufferAttribute(d,t),S.fromBufferAttribute(u,t),b.w=1,S.w=1,b.applyMatrix4(E),S.applyMatrix4(E),b.z>p&&S.z>p)continue;if(b.z>p){let e=b.z-S.z,t=(b.z-p)/e;b.lerp(S,t)}else if(S.z>p){let e=S.z-b.z,t=(S.z-p)/e;S.lerp(b,t)}b.applyMatrix4(a),S.applyMatrix4(a),b.multiplyScalar(1/b.w),S.multiplyScalar(1/S.w),b.x*=s.x/2,b.y*=s.y/2,S.x*=s.x/2,S.y*=s.y/2,A.start.copy(b),A.start.z=0,A.end.copy(S),A.end.z=0;let l=A.closestPointToPointParameter(_,!0);A.at(l,L);let f=c.MathUtils.lerp(b.z,S.z,l),m=f>=-1&&f<=1,h=_.distanceTo(L)<.5*r;if(m&&h){A.start.fromBufferAttribute(d,t),A.end.fromBufferAttribute(u,t),A.start.applyMatrix4(o),A.end.applyMatrix4(o);let r=new c.Vector3,a=new c.Vector3;n.distanceSqToSegment(A.start,A.end,a,r),i.push({point:a,pointOnLine:r,distance:n.origin.distanceTo(a),object:e,face:null,faceIndex:t,uv:null,[v]:null})}}}(this,o,t))}}onBeforeRender(e){let t=this.material.uniforms;t&&t.resolution&&(e.getViewport(y),this.material.uniforms.resolution.value.set(y.z,y.w))}}class P extends p{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){let t=e.length-3,i=new Float32Array(2*t);for(let n=0;n<t;n+=3)i[2*n]=e[n],i[2*n+1]=e[n+1],i[2*n+2]=e[n+2],i[2*n+3]=e[n+3],i[2*n+4]=e[n+4],i[2*n+5]=e[n+5];return super.setPositions(i),this}setColors(e,t=3){let i=e.length-t,n=new Float32Array(2*i);if(3===t)for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5];else for(let r=0;r<i;r+=t)n[2*r]=e[r],n[2*r+1]=e[r+1],n[2*r+2]=e[r+2],n[2*r+3]=e[r+3],n[2*r+4]=e[r+4],n[2*r+5]=e[r+5],n[2*r+6]=e[r+6],n[2*r+7]=e[r+7];return super.setColors(n,t),this}fromLine(e){let t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class C extends B{constructor(e=new P,t=new h({color:16777215*Math.random()})){super(e,t),this.isLine2=!0,this.type="Line2"}}let j=d.forwardRef(function({points:e,color:t="black",vertexColors:i,linewidth:n,lineWidth:r,segments:a,dashed:o,...u},f){let m=(0,s.A)(e=>e.size),v=d.useMemo(()=>a?new B:new C,[a]),[y]=d.useState(()=>new h),x=d.useMemo(()=>{let t=a?new p:new P,n=e.map(e=>{let t=Array.isArray(e);return e instanceof c.Vector3?[e.x,e.y,e.z]:e instanceof c.Vector2?[e.x,e.y,0]:t&&3===e.length?[e[0],e[1],e[2]]:t&&2===e.length?[e[0],e[1],0]:e});if(t.setPositions(n.flat()),i){let e=i.map(e=>e instanceof c.Color?e.toArray():e);t.setColors(e.flat())}return t},[e,a,i]);return d.useLayoutEffect(()=>{v.computeLineDistances()},[e,v]),d.useLayoutEffect(()=>{o?y.defines.USE_DASH="":delete y.defines.USE_DASH,y.needsUpdate=!0},[o,y]),d.useEffect(()=>()=>x.dispose(),[x]),d.createElement("primitive",(0,l.Z)({object:v,ref:f},u),d.createElement("primitive",{object:x,attach:"geometry"}),d.createElement("primitive",(0,l.Z)({object:y,attach:"material",color:t,vertexColors:!!i,resolution:[m.width,m.height],linewidth:null!=n?n:r,dashed:o},u)))});var D=i(1851),N=i(2688);function I({radius:e,tilt:t}){let i=[];for(let t=0;t<=64;t++){let n=t/64*Math.PI*2;i.push([Math.cos(n)*e,0,Math.sin(n)*e])}return a.jsx("group",{rotation:[t,0,0],children:a.jsx(j,{points:i,color:"#d1d5db",lineWidth:.8})})}function T({radius:e,speed:t,angle:i,tilt:n}){let r=(0,d.useRef)();return(0,s.C)((e,i)=>{r.current&&(r.current.rotation.y+=i*t)}),a.jsx("group",{ref:r,rotation:[n,0,0],children:(0,a.jsxs)("mesh",{position:[Math.cos(i)*e,0,Math.sin(i)*e],children:[a.jsx("sphereGeometry",{args:[.05,16,16]}),a.jsx("meshStandardMaterial",{color:"#2563eb"})]})})}function R({atomicNumber:e}){let t=e,i=[],n=[];return[2,8,18,32].forEach((e,r)=>{let s=Math.min(e,t);if(t-=s,0===s)return;let o=1+.75*r;for(let e=0;e<s;e++){let t=e/s*Math.PI*2,l=e/s*Math.PI*.6;n.push(a.jsx(I,{radius:o,tilt:l},`orbit-${r}-${e}`)),i.push(a.jsx(T,{radius:o,angle:t,tilt:l,speed:.3+.1*r},`electron-${r}-${e}`))}}),(0,a.jsxs)(a.Fragment,{children:[a.jsx(D.aL,{args:[.35,32,32],children:a.jsx("meshStandardMaterial",{color:"#dc2626"})}),n,i]})}function V({atomicNumber:e}){return(0,a.jsxs)("div",{className:"w-full h-[600px] bg-white rounded-xl border",children:[(0,a.jsxs)("div",{className:"text-center text-sm text-gray-600 py-1",children:["Bohr Model — One orbit per electron (Z = ",e,")"]}),(0,a.jsxs)(o.Xz,{camera:{position:[0,0,7]},eventSource:void 0,eventPrefix:"client",children:[a.jsx("color",{attach:"background",args:["#ffffff"]}),a.jsx("ambientLight",{intensity:.8}),a.jsx("pointLight",{position:[10,10,10]}),a.jsx(R,{atomicNumber:Math.min(e,30)}),a.jsx(N.z,{enableZoom:!0,enablePan:!1})]})]})}},4792:(e,t,i)=>{"use strict";i.r(t),i.d(t,{default:()=>n});let n=(0,i(8570).createProxy)(String.raw`C:\Users\rahul\OneDrive\Desktop\Full Stack\NextJS\OpenLabs\app\chemistry\periodictable\atom\[atomicNumber]\page.tsx#default`)}};var t=require("../../../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),n=t.X(0,[555,231,477],()=>i(6122));module.exports=n})();