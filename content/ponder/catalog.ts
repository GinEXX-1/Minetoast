import {pilotScenes} from './pilots';
import {expansionScenes} from './expansions';
import {batchOneScenes} from './batch-one';
import {batchTwoScenes} from './batch-two';
import {geometryCompletionScenes} from './geometry-complete';
import type {PonderDemo} from '../../packages/ponder/src/schema';
/** Curated local pilot preview. AI candidates never enter this catalog automatically. */
export const ponderScenes=[...pilotScenes,...expansionScenes,...batchOneScenes,...batchTwoScenes,...geometryCompletionScenes];
export const ponderDemos:PonderDemo[]=ponderScenes.map(scene=>({id:scene.id,nodeId:scene.nodeId,type:'PRINCIPLE',title:scene.title,status:'REVIEW_REQUIRED',isPrimary:true,suitability:'HIGH',version:scene.version,dslVersion:scene.dslVersion,createdAt:'2026-10-02T07:19:53.000Z',updatedAt:'2026-10-02T07:19:53.000Z',scene}));
export const demonstrationsForNode=(nodeId:string)=>ponderScenes.filter(scene=>scene.nodeId===nodeId);
export const demonstrationSuitability=(nodeId:string)=>demonstrationsForNode(nodeId).length?'HIGH' as const:'NONE' as const;
