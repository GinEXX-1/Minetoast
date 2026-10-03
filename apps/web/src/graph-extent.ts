import type {CoordinateExtent} from '@xyflow/react';

type PositionedNode={position:{x:number;y:number};width?:number;height?:number;measured?:{width?:number;height?:number}};

/** Keep the graph within a small margin while allowing fit, focus and minimap travel. */
export function graphExtent(nodes:readonly PositionedNode[]):CoordinateExtent{
 if(!nodes.length)return [[-300,-300],[300,300]];
 let left=Infinity,top=Infinity,right=-Infinity,bottom=-Infinity;
 for(const node of nodes){const {x,y}=node.position;if(!Number.isFinite(x)||!Number.isFinite(y))continue;left=Math.min(left,x);top=Math.min(top,y);right=Math.max(right,x+(node.measured?.width??node.width??160));bottom=Math.max(bottom,y+(node.measured?.height??node.height??120));}
 if(!Number.isFinite(left))return [[-300,-300],[300,300]];
 const margin=220;
 return [[left-margin,top-margin],[right+margin,bottom+margin]];
}
