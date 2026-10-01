import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createElement} from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {worldGraph,worldNodes} from '../apps/web/src/function-world-model';
import {MathCraftIcon,mathCraftDesigns} from '../apps/web/src/MathCraftIcon';

const outputDirectory=join(process.cwd(),'assets','phase-3','mathcraft','icons');
await mkdir(outputDirectory,{recursive:true});
const manifest=[];
for(const node of worldGraph.nodes){
 const id=node.id;
 if(!mathCraftDesigns[id])throw new Error(`MATHCRAFT_ICON_MISSING:${id}`);
 const name=worldNodes.get(id)?.canonicalName??id;
 const svg='<?xml version="1.0" encoding="UTF-8"?>\n'+renderToStaticMarkup(createElement(MathCraftIcon,{nodeId:id,name,width:32,height:32}))+'\n';
 const filename=`${id}.svg`;
 await writeFile(join(outputDirectory,filename),svg,'utf8');
 manifest.push({nodeId:id,knowledgeName:name,file:filename,viewBox:'0 0 32 32',sha256:createHash('sha256').update(svg).digest('hex')});
}
await writeFile(join(outputDirectory,'manifest.json'),JSON.stringify({schemaVersion:1,generatedBy:'scripts/export-mathcraft-icons.ts',assetType:'original-pixel-svg',count:manifest.length,icons:manifest},null,2)+'\n','utf8');
process.stdout.write(`Exported ${manifest.length} MathCraft SVG icons to ${outputDirectory}\n`);
