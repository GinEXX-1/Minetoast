export type Positions=Record<string,{x:number;y:number}>;
export interface Override {nodeId:string;x:number;y:number;layoutVersion:string;}
/** Pure projection: overrides never alter the graph or user progress. */
export function applyLayoutOverrides(auto:Positions,overrides:readonly Override[],version='v1'){
 const positions={...auto},warnings:string[]=[];
 for(const p of overrides){if(p.layoutVersion!==version)continue;if(!positions[p.nodeId]||!Number.isFinite(p.x)||!Number.isFinite(p.y)){warnings.push('INVALID_OVERRIDE:'+p.nodeId);continue;}positions[p.nodeId]={x:p.x,y:p.y};}
 const touched=new Set(overrides.filter(o=>o.layoutVersion===version).map(o=>o.nodeId)),entries=Object.entries(positions);
 for(let a=0;a<entries.length;a++)for(let b=a+1;b<entries.length;b++){
  const [id,p]=entries[a],[other,q]=entries[b];
  if((touched.has(id)||touched.has(other))&&Math.abs(p.x-q.x)<210&&Math.abs(p.y-q.y)<100)warnings.push('LAYOUT_COLLISION:'+id+':'+other);
 }
 return {positions,warnings};
}
