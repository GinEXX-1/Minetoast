import type {SVGProps} from 'react';

type Tile=readonly [number,number,number,number];
const designs:Record<string,readonly Tile[]>= {
 'sets-logic':[[4,5,3,22],[4,5,10,3],[4,24,10,3],[25,5,3,22],[18,5,10,3],[18,24,10,3],[11,12,3,3],[18,18,3,3]],
 algebra:[[5,7,22,3],[5,22,22,3],[14,5,4,22],[7,14,18,4],[8,11,3,3],[22,18,3,3]],
 functions:[[5,5,3,22],[24,5,3,22],[8,15,16,3],[11,10,3,5],[19,18,3,5],[14,12,4,8]],
 trigonometry:[[4,17,24,2],[7,11,2,7],[9,18,3,3],[12,21,8,2],[20,18,3,3],[23,11,2,7]],
 sequences:[[6,23,5,3],[12,19,5,7],[18,13,5,13],[24,7,4,19],[6,7,3,3]],
 vectors:[[5,14,18,4],[19,10,4,4],[23,6,4,4],[19,18,4,4],[23,22,4,4]],
 geometry:[[14,4,4,4],[8,10,4,4],[20,10,4,4],[4,16,24,3],[8,21,4,4],[20,21,4,4],[14,26,4,3]],
 probability:[[6,6,5,5],[21,6,5,5],[13,13,6,6],[6,21,5,5],[21,21,5,5]],
 calculus:[[5,23,23,2],[6,6,2,19],[10,20,4,3],[14,16,4,4],[18,11,4,5],[22,7,4,4]],
};

const motifs:Record<string,readonly Tile[]>={
 nested:[[4,5,17,3],[4,5,3,21],[4,23,17,3],[18,11,11,3],[18,11,3,16],[18,24,11,3]],
 overlap:[[4,7,15,3],[4,7,3,16],[4,20,15,3],[13,11,15,3],[25,11,3,16],[13,24,15,3]],
 empty:[[5,5,22,3],[5,5,3,22],[24,5,3,22],[5,24,22,3],[9,21,3,3],[20,8,3,3]],
 implication:[[4,15,20,3],[19,10,3,4],[22,12,3,4],[25,15,3,3],[22,18,3,4],[19,21,3,3]],
 quantifier:[[4,6,4,4],[14,6,4,4],[24,6,4,4],[6,14,20,3],[4,22,4,4],[14,22,4,4],[24,22,4,4]],
 balance:[[4,16,24,3],[15,6,3,22],[5,11,8,3],[19,11,8,3],[7,20,4,3],[21,20,4,3]],
 parabola:[[5,7,3,8],[8,15,3,5],[11,20,3,3],[14,23,5,3],[19,20,3,3],[22,15,3,5],[25,7,3,8]],
 fraction:[[5,8,8,3],[19,8,8,3],[4,15,24,3],[5,22,8,3],[19,22,8,3]],
 circle:[[11,4,10,3],[7,7,4,4],[21,7,4,4],[4,11,3,10],[25,11,3,10],[7,21,4,4],[21,21,4,4],[11,25,10,3]],
 wave:[[4,17,4,3],[8,13,4,3],[12,9,5,3],[17,13,4,3],[21,17,4,3],[25,21,3,3]],
 angle:[[5,6,3,21],[5,24,23,3],[10,20,3,3],[13,17,3,3],[16,14,3,3],[19,11,3,3]],
 steps:[[4,23,5,4],[9,19,5,8],[14,15,5,12],[19,11,5,16],[24,7,4,20]],
 sum:[[4,5,24,3],[5,8,5,4],[8,12,5,4],[11,16,5,4],[8,20,5,4],[5,24,23,3]],
 loop:[[5,8,19,3],[21,11,4,4],[24,14,4,4],[21,18,4,4],[8,23,17,3],[5,20,4,4]],
 arrow:[[4,14,19,4],[20,10,4,4],[24,6,4,4],[20,18,4,4],[24,22,4,4]],
 dot:[[5,8,7,7],[20,18,7,7],[14,14,4,4]],
 axes:[[5,15,23,3],[15,4,3,24],[22,8,4,4],[8,21,4,4]],
 cube:[[6,7,15,3],[6,7,3,15],[6,20,15,3],[18,7,3,16],[21,12,6,3],[24,12,3,15],[18,24,9,3]],
 triangle:[[15,5,3,4],[12,9,3,4],[18,9,3,4],[9,13,3,4],[21,13,3,4],[6,17,3,4],[24,17,3,4],[4,23,24,3]],
 dice:[[4,4,24,3],[4,4,3,24],[25,4,3,24],[4,25,24,3],[10,10,3,3],[19,10,3,3],[14,15,3,3],[10,20,3,3],[19,20,3,3]],
 bars:[[5,21,5,6],[11,16,5,11],[17,10,5,17],[23,6,5,21]],
 tangent:[[5,23,22,3],[7,20,3,3],[10,16,3,4],[13,12,3,4],[16,10,3,3],[19,11,3,3],[22,14,3,3],[24,7,3,18]],
 slope:[[5,24,23,3],[5,9,3,18],[8,21,4,3],[12,17,4,3],[16,13,4,3],[20,9,4,3],[24,5,4,3]],
};

function motifFor(systemId:string,name:string):readonly Tile[]{
 if(systemId==='sets-logic')return motifs[/命题|充分|必要|条件|反例|逆/.test(name)?'implication':/量词|否定/.test(name)?'quantifier':/并集|交集|补集/.test(name)?'overlap':/子集|相等|包含/.test(name)?'nested':/空集/.test(name)?'empty':'nested'];
 if(systemId==='algebra')return motifs[/二次|根|判别/.test(name)?'parabola':/分式|倒数/.test(name)?'fraction':'balance'];
 if(systemId==='trigonometry')return motifs[/角|弧度/.test(name)?'angle':/圆|象限/.test(name)?'circle':'wave'];
 if(systemId==='sequences')return motifs[/求和|前.n.项和|二项/.test(name)?'sum':/递推|归纳/.test(name)?'loop':'steps'];
 if(systemId==='vectors')return motifs[/数量积|夹角|垂直/.test(name)?'dot':/坐标|模/.test(name)?'axes':'arrow'];
 if(systemId==='geometry')return motifs[/圆|椭圆|双曲线/.test(name)?'circle':/角|三角/.test(name)?'triangle':/直线|坐标|距离/.test(name)?'axes':'cube'];
 if(systemId==='probability')return motifs[/统计|分布|均值|方差|频率/.test(name)?'bars':/排列|组合|二项/.test(name)?'steps':'dice'];
 if(systemId==='calculus')return motifs[/切线|极值/.test(name)?'tangent':/导数|变化率/.test(name)?'slope':'wave'];
 return designs[systemId]??designs.functions;
}

/** Small integer-aligned SVG glyphs for the curriculum systems and concepts. */
export function CurriculumPixelIcon({systemId,conceptName,variant=0,...props}:{systemId:string;conceptName?:string;variant?:number}&Omit<SVGProps<SVGSVGElement>,'children'>){
 const tiles=conceptName?motifFor(systemId,conceptName):designs[systemId]??designs.functions;
 const shift=variant%3;
 return <svg viewBox="0 0 32 32" width={props.width??40} height={props.height??40} shapeRendering="crispEdges" imageRendering="pixelated" aria-hidden="true" focusable="false" {...props}>
  {tiles.map(([x,y,w,h],i)=><rect key={i} x={x+(i%4===0?shift:0)} y={y} width={w} height={h} fill={i%4===0?'#e8d28b':i%3===0?'#8ad5a3':'#b8d0c0'}/>)}
 </svg>;
}
