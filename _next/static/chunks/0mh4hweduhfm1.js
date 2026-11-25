(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,145261,e=>{"use strict";var t=e.i(190072),i=e.i(408560);let r=`
  uniform vec2 uVelocity;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 p = position;
    float bend = sin(uv.y * 3.14159) ;
    p.x += uVelocity.x * bend * 0.9;
    p.y += uVelocity.y * sin(uv.x * 3.14159) * 0.9;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,s=`
  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uMix;
  uniform float uAlpha;
  uniform vec2 uVelocity;
  uniform vec2 uCover;  // object-fit: cover scale
  varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    float shift = length(uVelocity) * 0.012;
    float n = noise(vUv * 6.0);
    float m = smoothstep(uMix - 0.25, uMix + 0.25, n * 0.5 + vUv.y * 0.5);
    vec4 a = texture2D(uFrom, uv + vec2(0.0, (1.0 - uMix) * 0.0));
    vec4 b = texture2D(uTo, uv + vec2(0.0, (1.0 - uMix) * 0.04));
    vec4 c = mix(b, a, m);
    // gentle chromatic drift with motion
    c.r = mix(texture2D(uTo, uv + vec2(shift, 0.0)).r, a.r, m);
    // soft rounded corners
    vec2 d = abs(vUv - 0.5) - 0.5 + 0.06;
    float corner = 1.0 - smoothstep(0.0, 0.004, length(max(d, 0.0)) - 0.06);
    gl_FragColor = vec4(c.rgb, uAlpha * corner);
  }
`;e.s(["HoverImageGL",0,class{renderer;scene=new t.P6;camera;mesh;textures=[];target=new t.wq;pos=new t.wq;vel=new t.wq;alphaTarget=0;current=-1;raf=0;W=340;H=420;constructor(e,a){this.renderer=new i.f({canvas:e,alpha:!0,antialias:!0}),this.renderer.setPixelRatio(Math.min(devicePixelRatio,2)),this.renderer.outputColorSpace=t.nj,this.renderer.setClearColor(0,0),this.camera=new t.Sc(0,1,0,1,-10,10);let o=new t.H5;this.textures=a.map(e=>{let i=o.load(e);return i.colorSpace=t.nj,i});let h=new t.U7(new Uint8Array([200,190,170,255]),1,1);h.needsUpdate=!0,this.mesh=new t.kE(new t.CQ(this.W,this.H,24,24),new t.Zg({vertexShader:r,fragmentShader:s,transparent:!0,uniforms:{uFrom:{value:h},uTo:{value:this.textures[0]??h},uMix:{value:1},uAlpha:{value:0},uVelocity:{value:new t.wq},uCover:{value:new t.wq(1,1)}}})),this.scene.add(this.mesh),this.resize();let u=()=>{this.tick(),this.raf=requestAnimationFrame(u)};u()}resize(){let e=innerWidth,t=innerHeight;this.renderer.setSize(e,t,!1),this.camera.left=0,this.camera.right=e,this.camera.top=0,this.camera.bottom=t,this.camera.updateProjectionMatrix(),this.mesh.rotation.x=Math.PI}move(e,t){this.target.set(e,t),this.mesh.material.uniforms.uAlpha.value<.01&&this.pos.set(e,t)}show(e){if(this.alphaTarget=1,e===this.current)return;let t=this.mesh.material.uniforms;t.uFrom.value=t.uTo.value,t.uTo.value=this.textures[e]??t.uTo.value,t.uMix.value=0,this.current=e;let i=t.uTo.value.image;if(i?.width){let e=i.width/i.height,r=this.W/this.H;t.uCover.value.set(e>r?r/e:1,e>r?1:e/r)}}hide(){this.alphaTarget=0}tick(){let e=this.mesh.material.uniforms,i=this.pos.clone();this.pos.lerp(this.target,.12),this.vel.lerp(this.pos.clone().sub(i),.25),e.uVelocity.value.set(.9*this.vel.x,.9*this.vel.y),e.uMix.value=Math.min(1,e.uMix.value+.035),e.uAlpha.value+=(this.alphaTarget-e.uAlpha.value)*.12,this.mesh.position.set(this.pos.x+40,this.pos.y,0),this.mesh.rotation.z=t.rA.clamp(-(.004*this.vel.x),-.12,.12),e.uAlpha.value>.002||this.alphaTarget>0?this.renderer.render(this.scene,this.camera):this.renderer.clear()}dispose(){cancelAnimationFrame(this.raf),this.textures.forEach(e=>e.dispose()),this.mesh.geometry.dispose(),this.mesh.material.dispose(),this.renderer.dispose()}}])}]);