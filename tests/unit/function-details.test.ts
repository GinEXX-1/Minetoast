import {describe,it,expect} from 'vitest';
import {functionNodeDetails,functionDetailById,validateFunctionDetails,searchFunctionDetails} from '../../content/fixtures/function-details';
import {functionCandidateGraph,functionDependencySeed} from '../../content/fixtures/function-dependencies';
import {functionOntologySeed} from '../../content/fixtures/function-ontology';

describe('Phase 2C function detail content',()=>{
 it('covers exactly the active Phase 2B graph nodes without mutating the frozen registry',()=>{
  expect(functionDependencySeed.nodeRegistry).toHaveLength(36);
  expect(functionNodeDetails.map(d=>d.identity.nodeId).sort()).toEqual(functionCandidateGraph.nodes.map(n=>n.id).sort());
  expect(functionNodeDetails).toHaveLength(32);
  expect(functionNodeDetails.every(d=>functionOntologySeed.nodes.some(n=>n.id===d.identity.nodeId))).toBe(true);
  expect(functionDependencySeed.publicationEligible).toBe(false);
 });
 it('validates required content, KaTeX, textbook refs, and exact active graph relationships',()=>{
  expect(validateFunctionDetails()).toEqual([]);
  for(const d of functionNodeDetails){
   expect(d.examples[0]).toEqual(expect.objectContaining({problem:expect.any(String),recognition:expect.any(String),reasoning:expect.any(String),calculation:expect.any(String),answer:expect.any(String),insight:expect.any(String)}));
   expect(d.textbookReferences.length).toBeGreaterThan(0);
   for(const r of [...d.relationships.incoming,...d.relationships.outgoing])expect(functionCandidateGraph.edges.some(e=>e.id===r.edgeId)).toBe(true);
  }
  expect(functionDetailById.get('MS-ALG-LINE-001')?.metadata.gateStatus).toBe('REVIEW_REQUIRED');
  expect(functionDetailById.get('MS-ALG-LINE-001')?.metadata.confidence).toBe('LOW');
  expect(functionDetailById.get('MS-GEO-COORD-001')?.metadata.evidenceStatus).toBe('PARTIAL_CONTEXTUAL');
 });
 it('searches Chinese, pinyin, initials, English, notation, and student vocabulary',()=>{
  expect(searchFunctionDetails('定义域')[0]?.identity.nodeId).toBe('HS-FUNC-DOMAIN-001');
  expect(searchFunctionDetails('qujian').some(d=>d.identity.nodeId==='HS-FUNC-INTERVAL-001')).toBe(true);
  expect(searchFunctionDetails('qjbs').some(d=>d.identity.nodeId==='HS-FUNC-INTERVAL-001')).toBe(true);
  expect(searchFunctionDetails('reciprocal').some(d=>d.identity.nodeId==='HS-FUNC-RECIPROCAL-001')).toBe(true);
  expect(searchFunctionDetails('k/x').some(d=>d.identity.nodeId==='HS-FUNC-RECIPROCAL-001')).toBe(true);
  expect(searchFunctionDetails('空心圆实心圆').some(d=>d.identity.nodeId==='MS-ALG-LINE-001')).toBe(true);
 });
 it('does not expose excluded, pending, removed, or REVIEW_REQUIRED graph records as active relations',()=>{
  const active=new Set(functionCandidateGraph.nodes.map(n=>n.id));
  for(const d of functionNodeDetails)for(const r of [...d.relationships.incoming,...d.relationships.outgoing])expect(active.has(r.nodeId)).toBe(true);
  expect(functionCandidateGraph.nodes.some(n=>n.id==='MS-NUM-REAL-001')).toBe(false);
  expect(functionCandidateGraph.edges.some(e=>e.qualityDecision==='REVIEW_REQUIRED'||e.qualityDecision==='REMOVE')).toBe(false);
 });
});
