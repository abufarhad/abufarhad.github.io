import{_ as e,a as t,b as n,c as r,d as i,f as a,g as o,h as s,i as c,l,m as u,n as d,o as f,p as ee,r as p,s as m,t as te,u as ne,v as h,x as re,y as ie}from"./three-ChNKkUXX.js";var ae=`
uniform float uTime;
uniform float uScroll;
varying float vH;
varying float vDepth;
varying float vX;

vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec2 mod289(vec2 x){return x-floor(x*(1.0/289.0))*289.0;}
vec3 permute(vec3 x){return mod289(((x*34.0)+1.0)*x);}
float snoise(vec2 v){
  const vec4 C=vec4(0.211324865405187,0.366025403784439,-0.577350269189626,0.024390243902439);
  vec2 i=floor(v+dot(v,C.yy));
  vec2 x0=v-i+dot(i,C.xx);
  vec2 i1=(x0.x>x0.y)?vec2(1.0,0.0):vec2(0.0,1.0);
  vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
  i=mod289(i);
  vec3 p=permute(permute(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
  vec3 m=max(0.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.0);
  m=m*m; m=m*m;
  vec3 x=2.0*fract(p*C.www)-1.0;
  vec3 h=abs(x)-0.5;
  vec3 ox=floor(x+0.5);
  vec3 a0=x-ox;
  m*=1.79284291400159-0.85373472095314*(a0*a0+h*h);
  vec3 g; g.x=a0.x*x0.x+h.x*x0.y; g.yz=a0.yz*x12.xz+h.yz*x12.yw;
  return 130.0*dot(m,g);
}
float terrain(vec2 p, float t){
  vec2 q = vec2(p.x, p.y - t);
  float h = snoise(q*0.075)*1.0 + snoise(q*0.17)*0.42 + snoise(q*0.4)*0.12;
  // Carve a calm valley down the middle so the hero text sits on open space.
  float valley = smoothstep(2.5, 14.0, abs(p.x));
  return h * (0.25 + valley * 1.55) + valley * 1.1;
}

void main(){
  vec3 p = position;
  float h = terrain(p.xz, uTime*0.55);
  p.y += h;
  vH = h;
  vX = p.x;
  vec4 mv = modelViewMatrix * vec4(p,1.0);
  vDepth = -mv.z;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.4 + max(h,0.0)*1.1) * (34.0 / vDepth);
}
`,oe=`
uniform float uScroll;
uniform float uAlpha;
uniform float uIsPoint;
varying float vH;
varying float vDepth;
varying float vX;
void main(){
  if(uIsPoint > 0.5){
    vec2 c = gl_PointCoord - 0.5;
    if(dot(c,c) > 0.25) discard;
  }
  vec3 deep = vec3(0.15,0.25,0.75);
  vec3 blue = vec3(0.36,0.55,1.0);
  vec3 cyan = vec3(0.37,0.91,0.96);
  vec3 violet = vec3(0.61,0.55,1.0);
  float k = clamp(vH*0.45 + 0.35, 0.0, 1.0);
  vec3 col = mix(deep, blue, k);
  col = mix(col, cyan, smoothstep(0.65, 1.0, k));
  col = mix(col, violet, clamp(uScroll*1.2,0.0,1.0)*0.55);
  float far = smoothstep(50.0, 10.0, vDepth);
  float near = smoothstep(1.5, 6.0, vDepth);
  float a = far * near * (0.20 + k*0.85) * uAlpha;
  if(uIsPoint > 0.5) a *= 1.6 * smoothstep(0.45, 1.0, k);
  gl_FragColor = vec4(col * a, a);
}
`,g=`
attribute float aSize;
attribute float aSeed;
uniform float uTime;
uniform float uPixel;
varying float vTw;
void main(){
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  vTw = 0.55 + 0.45*sin(uTime*1.6 + aSeed*6.2831);
  gl_PointSize = aSize * uPixel * (10.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`,_=`
uniform vec3 uColor;
uniform float uAlpha;
varying float vTw;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  float core = smoothstep(0.5, 0.0, d);
  float glow = pow(core, 2.6);
  float a = (glow*0.9 + smoothstep(0.12,0.0,d)) * vTw * uAlpha;
  gl_FragColor = vec4(uColor * a, a);
}
`;function se(e,t,n,i){let a=[],o=e/n,s=t/i,c=-e/2,l=-t+6;for(let e=0;e<=i;e++){let t=l+e*s;for(let e=0;e<n;e++)a.push(c+e*o,0,t,c+(e+1)*o,0,t)}for(let e=0;e<=n;e++){let t=c+e*o;for(let e=0;e<i;e++)a.push(t,0,l+e*s,t,0,l+(e+1)*s)}let u=new p;return u.setAttribute(`position`,new r(a,3)),u}function ce(e,t,n,i){let a=[],o=-e/2,s=-t+6;for(let r=0;r<=i;r++)for(let c=0;c<=n;c++)a.push(o+c*e/n,0,s+r*t/i);let c=new p;return c.setAttribute(`position`,new r(a,3)),c}function le(r,le){let v=le===`high`,y=new te({canvas:r,antialias:v,alpha:!0,powerPreference:`high-performance`}),b=Math.min(window.devicePixelRatio||1,v?1.75:1.25);y.setPixelRatio(b),y.setClearColor(0,0);let x=new e,S=new ee(55,1,.1,120);S.position.set(0,2.1,8);let C=[],w=e=>(C.push(e),e),T={uTime:{value:0},uScroll:{value:0},uAlpha:{value:1},uIsPoint:{value:0}},[E,D,ue,de]=v?[64,52,110,84]:[56,44,60,46],fe=w(new h({uniforms:T,vertexShader:ae,fragmentShader:oe,transparent:!0,depthWrite:!1,blending:2})),pe=new i(w(se(E,D,ue,de)),fe);pe.position.y=-1.7,x.add(pe);let O=w(new h({uniforms:{...T,uIsPoint:{value:1}},vertexShader:ae,fragmentShader:oe,transparent:!0,depthWrite:!1,blending:2}));O.uniforms.uTime=T.uTime,O.uniforms.uScroll=T.uScroll,O.uniforms.uAlpha=T.uAlpha;let me=new s(w(ce(E,D,ue,de)),O);me.position.y=-1.7,x.add(me);let k=v?120:56,he=v?1.75:2,A={x:10,yMin:-.6,yMax:5.2,zMin:-7,zMax:1.5},j=new Float32Array(k*3),M=new Float32Array(k*3),ge=new Float32Array(k),N=new Float32Array(k);for(let e=0;e<k;e++)j[e*3]=(Math.random()*2-1)*A.x,j[e*3+1]=A.yMin+Math.random()*(A.yMax-A.yMin),j[e*3+2]=A.zMin+Math.random()*(A.zMax-A.zMin),M[e*3]=(Math.random()-.5)*.12,M[e*3+1]=(Math.random()-.5)*.08,M[e*3+2]=(Math.random()-.5)*.08,ge[e]=2+Math.random()*(Math.random()>.9?7:3),N[e]=Math.random();let P=w(new p);P.setAttribute(`position`,new d(j,3).setUsage(f)),P.setAttribute(`aSize`,new d(ge,1)),P.setAttribute(`aSeed`,new d(N,1));let _e={uTime:T.uTime,uPixel:{value:b},uColor:{value:new t(.62,.86,1)},uAlpha:{value:1}},ve=w(new h({uniforms:_e,vertexShader:g,fragmentShader:_,transparent:!0,depthWrite:!1,blending:2})),ye=new s(P,ve);x.add(ye);let F=k*8,I=new Float32Array(F*6),L=new Float32Array(F*6),R=w(new p);R.setAttribute(`position`,new d(I,3).setUsage(f)),R.setAttribute(`color`,new d(L,3).setUsage(f));let be=w(new ne({vertexColors:!0,transparent:!0,depthWrite:!1,blending:2})),xe=new i(R,be);x.add(xe);let z=(e,t)=>w(new ne({color:e,transparent:!0,opacity:t,depthWrite:!1,blending:2})),Se=w(new m(new l(1.25,1))),B=new i(Se,z(6219765,.28));B.position.set(6.2,2.6,-3.5),x.add(B);let Ce=w(new m(new a(.7,0))),V=new i(Ce,z(10194175,.35));V.position.set(-6.4,3.4,-4.5),x.add(V);let we=w(new m(new ie(.9,.012,3,64))),H=new i(we,z(5999871,.4));H.position.copy(B.position),x.add(H);let U=v?900:350,W=new Float32Array(U*3),Te=new Float32Array(U),Ee=new Float32Array(U);for(let e=0;e<U;e++)W[e*3]=(Math.random()*2-1)*40,W[e*3+1]=Math.random()*22-2,W[e*3+2]=-12-Math.random()*40,Te[e]=1.4+Math.random()*2.4,Ee[e]=Math.random();let G=w(new p);G.setAttribute(`position`,new d(W,3)),G.setAttribute(`aSize`,new d(Te,1)),G.setAttribute(`aSeed`,new d(Ee,1));let De=w(new h({uniforms:{uTime:T.uTime,uPixel:{value:b*2.2},uColor:{value:new t(.7,.78,1)},uAlpha:{value:.55}},vertexShader:g,fragmentShader:_,transparent:!0,depthWrite:!1,blending:2})),Oe=new s(G,De);x.add(Oe);let K={x:0,y:0,tx:0,ty:0,active:!1},q=new re(999,999,999),ke=new o,Ae=new u(new re(0,0,1),1.5),je=new n,Me=0,J=0,Y=()=>{let e=window.innerWidth,t=window.innerHeight;y.setSize(e,t,!1),S.aspect=e/t,S.fov=e<768?68:55,S.updateProjectionMatrix()};Y(),window.addEventListener(`resize`,Y);let X=new c,Z=0,Q=!0,$=()=>{Z=requestAnimationFrame($);let e=Math.min(X.getDelta(),.05),t=X.elapsedTime;T.uTime.value=t,K.x+=(K.tx-K.x)*.05,K.y+=(K.ty-K.y)*.05,J+=(Me-J)*.06,T.uScroll.value=J,S.position.x=K.x*.9,S.position.y=2.1+K.y*.45-J*1.4,S.position.z=8-J*1.5,S.lookAt(K.x*.25,.35-J*1.6,-2),K.active&&(je.set(K.tx,K.ty),ke.setFromCamera(je,S),ke.ray.intersectPlane(Ae,q));for(let t=0;t<k;t++){let n=t*3;if(j[n]+=M[n]*e*2,j[n+1]+=M[n+1]*e*2,j[n+2]+=M[n+2]*e*2,(j[n]>A.x||j[n]<-A.x)&&(M[n]*=-1),(j[n+1]>A.yMax||j[n+1]<A.yMin)&&(M[n+1]*=-1),(j[n+2]>A.zMax||j[n+2]<A.zMin)&&(M[n+2]*=-1),K.active){let t=q.x-j[n],r=q.y-j[n+1],i=q.z-j[n+2],a=t*t+r*r+i*i;if(a<9&&a>.3){let i=(1-a/9)*.35*e;j[n]+=t*i,j[n+1]+=r*i}}}P.attributes.position.needsUpdate=!0;let n=0,r=he*he;for(let e=0;e<k&&n<F;e++){let t=j[e*3],i=j[e*3+1],a=j[e*3+2];for(let o=e+1;o<k&&n<F;o++){let e=t-j[o*3],s=i-j[o*3+1],c=a-j[o*3+2],l=e*e+s*s+c*c;if(l<r){let e=(1-l/r)*.7,s=n*6;I[s]=t,I[s+1]=i,I[s+2]=a,I[s+3]=j[o*3],I[s+4]=j[o*3+1],I[s+5]=j[o*3+2],L[s]=.36*e,L[s+1]=.55*e,L[s+2]=1*e,L[s+3]=.36*e,L[s+4]=.85*e,L[s+5]=.96*e,n++}}if(K.active){let e=t-q.x,r=i-q.y,o=a-q.z,s=e*e+r*r+o*o,c=7.5;if(s<c&&n<F){let e=(1-s/c)*.9,r=n*6;I[r]=t,I[r+1]=i,I[r+2]=a,I[r+3]=q.x,I[r+4]=q.y,I[r+5]=q.z,L[r]=.37*e,L[r+1]=.91*e,L[r+2]=.96*e,L[r+3]=.61*e*.4,L[r+4]=.55*e*.4,L[r+5]=1*e*.4,n++}}}R.setDrawRange(0,n*2),R.attributes.position.needsUpdate=!0,R.attributes.color.needsUpdate=!0,B.rotation.x=t*.08,B.rotation.y=t*.12,B.position.y=2.6+Math.sin(t*.5)*.18,H.position.y=B.position.y,H.rotation.x=Math.PI/2.4+Math.sin(t*.3)*.1,H.rotation.z=t*.2,V.rotation.x=-t*.15,V.rotation.z=t*.1,V.position.y=3.4+Math.cos(t*.6)*.22,Oe.rotation.y=t*.004+K.x*.02,y.render(x,S)},Ne=()=>{document.hidden&&Q?(Q=!1,cancelAnimationFrame(Z)):!document.hidden&&!Q&&(Q=!0,X.getDelta(),$())};return document.addEventListener(`visibilitychange`,Ne),$(),{setPointer(e,t){Number.isNaN(e)?K.active=!1:(K.tx=e,K.ty=t,K.active=!0)},setScroll(e){Me=e},dispose(){cancelAnimationFrame(Z),window.removeEventListener(`resize`,Y),document.removeEventListener(`visibilitychange`,Ne),C.forEach(e=>e.dispose()),y.dispose()}}}export{le as createUniverse};