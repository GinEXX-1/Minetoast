import type {SVGProps} from 'react';

type Tile=readonly [x:number,y:number,width:number,height:number];
type IconDesign={base:readonly Tile[];accent?:readonly Tile[];light?:readonly Tile[]};
const r=(x:number,y:number,width:number,height:number):Tile=>[x,y,width,height];

// Original 32×32, integer-aligned pixel constructions. No external sprite or texture files.
const xAxis=[r(4,16,24,2),r(8,13,2,8),r(15,13,2,8),r(22,13,2,8)];
const xyAxes=[r(4,16,24,2),r(15,4,2,24)];
const twoSets=[r(4,8,7,16),r(21,8,7,16)];
const rise=[r(6,24,4,2),r(10,21,4,2),r(14,18,4,2),r(18,15,4,2),r(22,12,4,2)];
const uCurve=[r(6,8,2,6),r(8,14,2,5),r(10,19,3,3),r(13,22,6,2),r(19,19,3,3),r(22,14,2,5),r(24,8,2,6)];

export const representativeIconIds=[
 'MS-ALG-LINE-001','MS-GEO-COORD-001','HS-SET-CONCEPT-001',
 'HS-FUNC-CONCEPT-001','HS-FUNC-DOMAIN-001','HS-FUNC-RANGE-001',
 'HS-FUNC-GRAPH-001','HS-FUNC-MONO-001','HS-FUNC-PARITY-001',
 'HS-FUNC-QUAD-001','HS-FUNC-ZERO-001','HS-FUNC-APPLY-001',
] as const;

export const mathCraftDesigns:Readonly<Record<string,IconDesign>>={
 'MS-ALG-LINE-001':{base:xAxis,accent:[r(15,12,2,10)],light:[r(25,15,3,4)]},
 'MS-GEO-COORD-001':{base:xyAxes,accent:[r(21,9,4,4)],light:[r(25,16,3,2),r(15,4,2,3)]},
 'HS-SET-CONCEPT-001':{base:[r(5,7,3,18),r(8,7,5,2),r(8,23,5,2),r(24,7,3,18),r(19,7,5,2),r(19,23,5,2)],accent:[r(12,12,3,3),r(18,17,3,3),r(13,20,3,3)]},
 'HS-ALG-INEQUALITY-001':{base:[r(6,8,4,16),r(22,12,4,12),r(11,15,4,2),r(15,13,4,2),r(19,11,3,2)],accent:[r(6,21,4,3),r(22,21,4,3)],light:[r(8,6,2,3),r(24,9,2,3)]},
 'HS-FUNC-INTERVAL-001':{base:[r(4,16,24,2),r(7,12,2,10),r(23,12,2,10)],accent:[r(10,15,13,4)],light:[r(5,13,5,5),r(23,14,4,4)]},
 'HS-FUNC-MAPPING-001':{base:[...twoSets,r(11,11,10,2),r(11,19,10,2)],accent:[r(6,10,3,3),r(6,18,3,3),r(23,10,3,3),r(23,18,3,3)],light:[r(17,10,3,4),r(17,18,3,4)]},
 'HS-FUNC-CONCEPT-001':{base:[...twoSets,r(11,14,10,4),r(13,11,6,10)],accent:[r(6,14,3,3),r(23,14,3,3),r(14,14,4,4)],light:[r(17,15,4,2)]},
 'HS-FUNC-DOMAIN-001':{base:[...twoSets,r(11,15,10,2)],accent:[r(5,10,5,12),r(16,13,4,6)],light:[r(7,8,2,3)]},
 'HS-FUNC-RANGE-001':{base:[...twoSets,r(11,15,10,2)],accent:[r(22,10,5,12),r(13,13,4,6)],light:[r(24,8,2,3)]},
 'HS-FUNC-VALUE-001':{base:[r(5,11,6,10),r(13,9,8,14),r(23,11,5,10)],accent:[r(7,14,3,4),r(15,14,4,4)],light:[r(24,13,3,6),r(19,15,4,2)]},
 'HS-FUNC-IDENTITY-001':{base:[r(5,7,9,7),r(18,7,9,7),r(5,19,9,7),r(18,19,9,7)],accent:[r(8,10,4,2),r(21,10,4,2),r(8,22,4,2),r(21,22,4,2)],light:[r(14,14,4,2),r(14,17,4,2)]},
 'HS-FUNC-ANALYTIC-001':{base:[r(4,7,9,18),r(19,7,9,18),r(13,13,6,2),r(13,18,6,2)],accent:[r(7,10,3,12),r(22,10,3,12)],light:[r(12,11,8,2)]},
 'HS-FUNC-TABLE-001':{base:[r(5,5,22,22),r(5,11,22,2),r(5,18,22,2),r(12,5,2,22),r(19,5,2,22)],accent:[r(14,13,5,5),r(21,20,4,5)],light:[r(7,7,4,3)]},
 'HS-FUNC-GRAPH-001':{base:xyAxes,accent:rise,light:[r(23,10,3,2)]},
 'HS-FUNC-PIECEDEF-001':{base:xyAxes,accent:[r(5,21,4,2),r(9,18,4,2),r(13,15,3,2),r(18,11,4,2),r(22,9,4,2)],light:[r(15,14,4,4),r(17,10,3,3)]},
 'HS-FUNC-PIECE-001':{base:xyAxes,accent:[r(5,21,4,2),r(9,18,4,2),r(13,15,3,2),r(18,11,4,2),r(22,9,4,2)],light:[r(19,9,5,5),r(19,23,4,2)]},
 'HS-FUNC-REPRESENT-001':{base:[r(4,7,9,18),r(4,13,9,2),r(8,7,2,18),r(19,7,2,18),r(19,23,9,2),r(13,15,6,2)],accent:[r(21,18,3,3),r(24,13,3,3)],light:[r(15,13,3,2)]},
 'HS-FUNC-MONO-001':{base:[r(5,24,22,2),r(5,7,2,19)],accent:rise,light:[r(22,8,4,4)]},
 'HS-FUNC-MONOPROOF-001':{base:[r(5,24,22,2),r(5,7,2,19),r(9,18,2,6),r(20,10,2,14)],accent:rise,light:[r(8,17,4,3),r(19,9,4,3)]},
 'HS-FUNC-MONOINTERVAL-001':{base:[r(4,23,24,2),r(8,19,2,10),r(23,19,2,10)],accent:[r(10,22,13,4),r(10,16,3,3),r(14,13,3,3),r(18,10,3,3),r(22,7,3,3)]},
 'HS-FUNC-EXTREME-001':{base:[r(4,24,24,2),r(15,5,2,22)],accent:[r(6,20,3,3),r(9,16,3,3),r(12,12,3,3),r(17,12,3,3),r(20,16,3,3),r(23,20,3,3)],light:[r(14,10,4,4)]},
 'HS-FUNC-PARITY-001':{base:[r(15,4,2,24),r(5,24,22,2)],accent:[r(6,12,3,3),r(9,16,3,3),r(12,19,3,3),r(17,19,3,3),r(20,16,3,3),r(23,12,3,3)]},
 'HS-FUNC-SYMMETRY-001':{base:[r(15,4,2,24),r(6,23,20,2)],accent:[r(6,11,4,4),r(22,11,4,4),r(9,17,4,4),r(19,17,4,4)],light:[r(15,5,2,4)]},
 'HS-FUNC-LINEAR-001':{base:xyAxes,accent:[r(6,23,4,2),r(10,19,4,2),r(14,15,4,2),r(18,11,4,2),r(22,7,4,2)]},
 'HS-FUNC-QUAD-001':{base:[r(4,24,24,2),r(15,4,2,24)],accent:uCurve,light:[r(14,21,4,2)]},
 'HS-FUNC-RECIPROCAL-001':{base:xyAxes,accent:[r(18,6,3,3),r(21,9,3,3),r(23,12,4,2),r(5,20,4,2),r(8,22,3,3),r(11,25,3,3)]},
 'HS-FUNC-POWER-001':{base:xyAxes,accent:[r(17,22,4,2),r(20,18,3,4),r(22,13,3,5),r(24,7,3,6)],light:[r(24,6,3,3)]},
 'HS-FUNC-PLOT-001':{base:xyAxes,accent:[r(7,21,3,3),r(12,18,3,3),r(18,13,3,3),r(23,9,3,3)],light:[r(8,23,15,2)]},
 'HS-FUNC-ZERO-001':{base:xyAxes,accent:[r(6,8,3,3),r(9,11,3,3),r(12,14,3,3),r(18,19,3,3),r(21,22,3,3)],light:[r(14,14,4,4)]},
 'HS-FUNC-ZEROEXIST-001':{base:xyAxes,accent:[r(6,7,3,3),r(9,10,3,3),r(12,13,3,3),r(18,18,3,3),r(21,21,3,3)],light:[r(5,6,4,4),r(22,20,4,4)]},
 'HS-FUNC-BISECTION-001':{base:[r(4,17,24,2),r(5,12,2,12),r(25,12,2,12),r(15,7,2,20)],accent:[r(7,16,8,4),r(17,16,8,4)],light:[r(14,13,4,8)]},
 'HS-FUNC-APPLY-001':{base:[r(5,6,22,20),r(8,9,16,2),r(8,21,16,2),r(8,12,2,9),r(22,12,2,9)],accent:[r(11,18,3,3),r(14,15,3,3),r(17,12,3,3)],light:[r(11,8,10,2)]},
};

export interface MathCraftIconProps extends Omit<SVGProps<SVGSVGElement>,'children'>{nodeId:string;name?:string;decorative?:boolean}
export function MathCraftIcon({nodeId,name,decorative=false,...svgProps}:MathCraftIconProps){
 const design=mathCraftDesigns[nodeId];
 if(!design)return null;
 const layers:[string,readonly Tile[]][]=[['#b7c8b7',design.base],['#76c3af',design.accent??[]],['#e6d8a5',design.light??[]]];
 return <svg {...svgProps} viewBox="0 0 32 32" width={svgProps.width??48} height={svgProps.height??48} xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges" imageRendering="pixelated" role={decorative?undefined:'img'} aria-hidden={decorative||undefined} aria-label={decorative?undefined:(name??nodeId)}>
  {layers.flatMap(([fill,tiles],layer)=>tiles.map(([x,y,width,height],index)=><rect key={`${layer}-${index}`} x={x} y={y} width={width} height={height} fill={fill}/>))}
 </svg>;
}
