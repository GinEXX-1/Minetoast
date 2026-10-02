import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {ponderScenes} from '../content/ponder/catalog';
import {qualityGate,type GateEvidence} from '../packages/ponder/src/quality';
import {validateMathematics} from '../packages/ponder/src/validation';
import {sceneSchema} from '../packages/ponder/src/schema';
import {z} from 'zod';
const args=process.argv.slice(2).filter(x=>!x.startsWith('--')),candidatePath=args[0],evidencePath=args[1];
const scenes=candidatePath?[sceneSchema.parse(JSON.parse(await readFile(candidatePath,'utf8')))]:ponderScenes;
const evidence:GateEvidence=evidencePath?JSON.parse(await readFile(evidencePath,'utf8')):{reviews:[]};
const reports=scenes.map(scene=>({id:scene.id,nodeId:scene.nodeId,renderer:scene.renderer,mathematicalSmoke:validateMathematics(scene),...qualityGate(scene,evidence)}));
await mkdir('docs/ponder/evidence',{recursive:true});
await writeFile('docs/ponder/evidence/quality-report.json',JSON.stringify({generatedAt:new Date().toISOString(),scope:'Numerical smoke is not independent review or proof',reports},null,2)+'\n');
await writeFile('docs/ponder/ponder-scene.schema.json',JSON.stringify(z.toJSONSchema(sceneSchema),null,2)+'\n');
for(const r of reports)console.log(`${r.id}: ${r.decision} (${r.mathematicalSmoke.length} mathematical smoke issues)`);
// CI/production gate deliberately fails closed; --validate-only is for authoring smoke checks.
if(reports.some(r=>r.decision==='FAIL')||!process.argv.includes('--validate-only')&&reports.some(r=>r.decision!=='PASS'))process.exitCode=1;
