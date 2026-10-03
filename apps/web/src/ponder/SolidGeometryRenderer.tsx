import {useEffect,useRef,useState} from 'react';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {palette} from '../../../../packages/ponder/src/runtime';
import {lineColors,usePreferences} from '../settings/preferences';
import type {RendererProps} from './types';
type CachedObject={root:THREE.Group;parts:THREE.Mesh[];label:HTMLSpanElement;anchor:THREE.Vector3};
// The horizontal construction lines sit on bright checker tiles; the HUD labels sit on dark chips.
/** Persistent scene graph: frames update transforms/buffers, never allocate a new scene. */
export default function SolidGeometryRenderer(props:RendererProps){
 const preferences=usePreferences(),colorPreferences=useRef(preferences);colorPreferences.current=preferences;
 const host=useRef<HTMLDivElement>(null),latest=useRef(props);latest.current=props;
 const [error,setError]=useState('');const engine=useRef<{draw:()=>void;reset:()=>void;beginStep:()=>void}|null>(null);
 useEffect(()=>{
  const element=host.current!;let renderer:THREE.WebGLRenderer;
  try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});}catch{setError('此设备无法初始化 WebGL。文字说明仍保留空间关系。');return;}
  renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;element.appendChild(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','三维空间场景，拖动旋转视角');renderer.domElement.setAttribute('data-testid','ponder-webgl-canvas');
  const world=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,100),controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=false;controls.enablePan=false;controls.minDistance=5;controls.maxDistance=22;controls.enableRotate=latest.current.model.scene.controls.allowCameraRotation;
  controls.target.set(0,.5,0);world.add(new THREE.HemisphereLight(0xffffff,0x46505a,2.3));const light=new THREE.DirectionalLight(0xffffff,2);light.position.set(-4,8,5);world.add(light);
  const resources:{geometries:Set<THREE.BufferGeometry>;materials:Set<THREE.Material>}={geometries:new Set(),materials:new Set()};
  const geometry=<T extends THREE.BufferGeometry>(g:T)=>{resources.geometries.add(g);return g;};
  const material=<T extends THREE.Material>(m:T)=>{resources.materials.add(m);return m;};
  // The specimen rests on an actual block platform, matching the reference's isolated stage.
  const block=geometry(new THREE.BoxGeometry(1,.34,1)),tiles=[0xa7b4b6,0xd2d9d5].map(color=>material(new THREE.MeshStandardMaterial({color,roughness:1})));
  for(let x=0;x<6;x++)for(let z=0;z<6;z++){const mesh=new THREE.Mesh(block,tiles[(x+z)%2]);mesh.position.set(x-2.5,-.45,z-2.5);world.add(mesh);}
  const base=new THREE.Mesh(geometry(new THREE.BoxGeometry(6,.42,6)),material(new THREE.MeshStandardMaterial({color:0x38444b,roughness:1})));base.position.y=-.83;world.add(base);
  const cache=new Map<string,CachedObject>(),unitLine=geometry(new THREE.CylinderGeometry(1,1,1,12)),pointGeometry=geometry(new THREE.SphereGeometry(.075,20,12));
  for(const o of latest.current.model.scene.objects){
   const root=new THREE.Group();world.add(root);const color=palette[o.color],parts:THREE.Mesh[]=[];
   const surfaceColor=(o.kind==='line3'||o.kind==='segment3'||o.kind==='arc3'||o.kind==='angleMarker3')?lineColors('solid',colorPreferences.current)[o.color]:color;
   const solid=material(new THREE.MeshBasicMaterial({color:surfaceColor,transparent:true}));
   if(o.kind==='plane'){
    const plane=geometry(new THREE.BufferGeometry());plane.setAttribute('position',new THREE.BufferAttribute(new Float32Array(18),3));parts.push(new THREE.Mesh(plane,material(new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,transparent:true,opacity:.16,depthWrite:false}))));
   }else if(o.kind==='point3')parts.push(new THREE.Mesh(pointGeometry,solid));
   else if(o.kind==='line3'||o.kind==='segment3'||o.kind==='arc3'||o.kind==='angleMarker3')for(let i=0;i<(o.kind==='arc3'?32:o.kind==='angleMarker3'?2:1);i++)parts.push(new THREE.Mesh(unitLine,solid));
   root.add(...parts);const label=document.createElement('span');label.className='ponder-3d-label';label.textContent=o.label;label.style.color=color;label.dataset.object=o.id;element.appendChild(label);cache.set(o.id,{root,parts,label,anchor:new THREE.Vector3()});
  }
  let manual=false;const up=new THREE.Vector3(0,1,0);
  const segment=(mesh:THREE.Mesh,a:THREE.Vector3,b:THREE.Vector3,draw:number,thickness:number)=>{const end=a.clone().lerp(b,draw),direction=end.clone().sub(a),length=direction.length();mesh.visible=length>1e-8;mesh.position.copy(a).add(end).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(up,direction.normalize());mesh.scale.set(thickness,length,thickness);};
  const render=()=>{renderer.domElement.dataset.camera=camera.position.toArray().map(n=>n.toFixed(3)).join(',');renderer.render(world,camera);for(const entry of cache.values()){const projected=entry.anchor.clone().project(camera);entry.label.style.left=`${(projected.x+1)*element.clientWidth/2}px`;entry.label.style.top=`${(1-projected.y)*element.clientHeight/2}px`;entry.label.hidden=!entry.root.visible||projected.z>1;}};
  const draw=()=>{
   const {model,parameters,step,frame,showAuxiliary}=latest.current;
   for(const o of model.scene.objects){const entry=cache.get(o.id)!,motion=frame.objects[o.id];entry.root.visible=!!motion&&(!('auxiliary' in o)||!o.auxiliary||showAuxiliary);if(!entry.root.visible)continue;
    entry.label.style.opacity=String(motion.reveal*motion.draw);for(const mesh of entry.parts){const mat=mesh.material as THREE.MeshBasicMaterial;mat.opacity=(o.kind==='plane'?.16:1)*motion.reveal;const base=(o.kind==='line3'||o.kind==='segment3'||o.kind==='arc3'||o.kind==='angleMarker3')?lineColors('solid',colorPreferences.current)[o.color]:palette[o.color];mat.color.set(base).lerp(new THREE.Color(0xffffff),motion.emphasis*.12);}
    if(o.kind==='plane'){
     const origin=new THREE.Vector3(...model.v3(o.origin,parameters)),u=new THREE.Vector3(...model.v3(o.u,parameters)),v=new THREE.Vector3(...model.v3(o.v,parameters)),attr=entry.parts[0].geometry.getAttribute('position') as THREE.BufferAttribute;
     [[-1,-1],[1,-1],[1,1],[-1,-1],[1,1],[-1,1]].forEach(([a,b],i)=>{const point=u.clone().multiplyScalar(a*o.size).addScaledVector(v,b*o.size);attr.setXYZ(i,...point.toArray());});attr.needsUpdate=true;entry.parts[0].position.copy(origin);entry.parts[0].scale.setScalar(motion.draw);entry.anchor.copy(origin).addScaledVector(u,-o.size*.75).addScaledVector(v,o.size*.75);
    }else if(o.kind==='line3'){
     const origin=new THREE.Vector3(...model.v3(o.origin,parameters)),direction=new THREE.Vector3(...model.v3(o.direction,parameters)).normalize(),a=origin.clone().addScaledVector(direction,-o.length/2),b=origin.clone().addScaledVector(direction,o.length/2);segment(entry.parts[0],a,b,motion.draw,.033+motion.emphasis*.01);entry.anchor.copy(b).addScaledVector(direction,.18);
    }else if(o.kind==='segment3'){const a=new THREE.Vector3(...model.v3(o.from,parameters)),b=new THREE.Vector3(...model.v3(o.to,parameters));segment(entry.parts[0],a,b,motion.draw,.033+motion.emphasis*.01);entry.anchor.copy(b);
    }else if(o.kind==='arc3'){const origin=new THREE.Vector3(...model.v3(o.origin,parameters)),u=new THREE.Vector3(...model.v3(o.u,parameters)),v=new THREE.Vector3(...model.v3(o.v,parameters)),radius=model.value(o.radius,parameters),angle=model.value(o.angle,parameters)*motion.draw;
     const at=(t:number)=>origin.clone().addScaledVector(u,radius*Math.cos(t)).addScaledVector(v,radius*Math.sin(t));for(let i=0;i<32;i++)segment(entry.parts[i],at(angle*i/32),at(angle*(i+1)/32),1,.027);entry.anchor.copy(at(angle/2)).addScaledVector(u,.15);
    }else if(o.kind==='point3'){const at=model.v3(o.at,parameters);entry.parts[0].position.set(...at);entry.parts[0].scale.setScalar(motion.reveal*(1+motion.emphasis*.6));entry.anchor.set(at[0]+.12,at[1]+.2,at[2]);
    }else if(o.kind==='angleMarker3'){
     const origin=new THREE.Vector3(...model.v3(o.origin,parameters)),a=new THREE.Vector3(...model.v3(o.first,parameters)).normalize().multiplyScalar(o.size),b=new THREE.Vector3(...model.v3(o.second,parameters)).normalize().multiplyScalar(o.size),start=origin.clone().add(a),corner=start.clone().add(b),end=origin.clone().add(b);
     segment(entry.parts[0],start,corner,Math.min(1,motion.draw*2),.025);segment(entry.parts[1],corner,end,Math.max(0,motion.draw*2-1),.025);entry.anchor.copy(corner).addScaledVector(b,.3);
    }
   }
   if(!manual){camera.position.set(...frame.camera);controls.update();}
   renderer.domElement.dataset.step=step.id;renderer.domElement.dataset.elapsed=frame.elapsed.toFixed(3);renderer.domElement.dataset.camera=camera.position.toArray().map(n=>n.toFixed(3)).join(',');render();
  };
  const reset=()=>{manual=true;camera.position.set(...(latest.current.step.camera??latest.current.model.scene.scene.camera));controls.target.set(0,.5,0);controls.update();render();};
  const interact=()=>{manual=true;latest.current.onInteraction();};controls.addEventListener('change',render);controls.addEventListener('start',interact);
  const observer=new ResizeObserver(()=>{const width=element.clientWidth,height=element.clientHeight;if(width&&height){renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();render();}});observer.observe(element);
  const lost=(event:Event)=>{event.preventDefault();setError('WebGL 上下文中断。请退出后重新打开；文字说明仍可阅读。');};renderer.domElement.addEventListener('webglcontextlost',lost);
  engine.current={draw,reset,beginStep:()=>{manual=false;draw();}};reset();draw();
  return()=>{engine.current=null;observer.disconnect();controls.removeEventListener('change',render);controls.removeEventListener('start',interact);controls.dispose();for(const item of cache.values())item.label.remove();resources.geometries.forEach(g=>g.dispose());resources.materials.forEach(m=>m.dispose());renderer.domElement.removeEventListener('webglcontextlost',lost);renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();};
 },[props.model]);
 useEffect(()=>engine.current?.draw(),[props.parameters,props.step,props.frame,props.showAuxiliary,preferences.colors,preferences.resolvedTheme]);
 useEffect(()=>engine.current?.reset(),[props.cameraReset]);
 useEffect(()=>engine.current?.beginStep(),[props.step.id]);
 return <div className="ponder-solid" data-testid="ponder-solid-renderer"><div ref={host} className="ponder-webgl"/>{error&&<p className="ponder-webgl-error" role="alert">{error}</p>}<p className="ponder-camera-hint">拖动旋转 · 滚轮缩放 · 随时恢复最佳视角</p></div>;
}
