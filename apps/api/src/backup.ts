import {z} from 'zod';
import type {Graph} from '../../../packages/graph-core/src/index';
export const nodeIdSchema = z.string().regex(/^(HS|MS)-[A-Z0-9]+-[A-Z0-9]+-[0-9]{3}$/);
export const backupSchema = z.object({schemaVersion:z.literal(1),graphReleaseId:z.uuid(),exportedAt:z.iso.datetime(),unlockedNodeIds:z.array(nodeIdSchema).max(1000)}).strict();
export function previewBackup(graph:Graph, unlocked:ReadonlySet<string>, input:unknown, releaseId:string) {
 const backup=backupSchema.parse(input), ids=[...new Set(backup.unlockedNodeIds)];
 const allowed=new Set(graph.nodes.filter(n=>!n.retired).map(n=>n.id));
 const unknownNodeIds=ids.filter(id=>!allowed.has(id));
 return {valid:unknownNodeIds.length===0,unknownNodeIds,addedNodeIds:ids.filter(id=>allowed.has(id)&&!unlocked.has(id)),existingNodeIds:ids.filter(id=>unlocked.has(id)),crossRelease:backup.graphReleaseId!==releaseId,graphReleaseId:releaseId};
}
