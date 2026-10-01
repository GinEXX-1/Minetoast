import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {describe,it,expect} from 'vitest';
import {functionOntologySeed as seed} from '../../content/fixtures/function-ontology';
import {fixtureNodes} from '../../content/fixtures/function-slice';

describe('Phase 2A ontology authoring boundary',()=>{
 it('preserves existing identities and supplies complete unique candidate metadata',()=>{
  const ids=new Set(seed.nodes.map(n=>n.id));
  expect(ids.size).toBe(36);
  expect(new Set(seed.nodes.map(n=>n.canonicalName)).size).toBe(36);
  for(const old of fixtureNodes) expect(ids.has(old.id)).toBe(true);
  const modules=new Set<string>(seed.modules.map(m=>m.id));
  for(const n of seed.nodes){
   expect(n.id).toMatch(/^(HS|MS)-[A-Z]+-[A-Z]+-\d{3}$/);
   expect(modules.has(n.module)).toBe(true);
   for(const value of [n.canonicalName,n.achievementName,n.summary,n.englishName,n.pinyin,n.pinyinInitials]) expect(value.trim()).not.toBe('');
   expect(n.importance).toBeGreaterThanOrEqual(1);expect(n.importance).toBeLessThanOrEqual(5);
   expect(n.difficulty).toBeGreaterThanOrEqual(1);expect(n.difficulty).toBeLessThanOrEqual(5);
   expect(n.contentStatus).toBe('ONTOLOGY_ONLY');
   expect(n).not.toHaveProperty('contentDetailed');expect(n).not.toHaveProperty('isRoot');
  }
  expect(seed.nodes.filter(n=>n.isPrerequisite)).toHaveLength(6);
  expect(seed.nodes.filter(n=>n.isKeyAchievement&&n.keyAchievementStatus==='CANDIDATE')).toHaveLength(5);
  expect(seed.publicationEligible).toBe(false);expect(seed).not.toHaveProperty('edges');
 });
 it('keeps evidence pages separate, referenced and synchronized with delivery documents',()=>{
  const index=readFileSync('docs/textbook/TEXTBOOK-INDEX.md','utf8');
  const mapping=readFileSync('docs/phase-2/FUNCTION-TEXTBOOK-MAPPING.md','utf8');
  const ontology=readFileSync('docs/phase-2/FUNCTION-ONTOLOGY.md','utf8');
  for(const n of seed.nodes){
   expect(n.textbookReferences.length).toBeGreaterThan(0);
   expect(ontology).toContain(n.id);
   for(const r of n.textbookReferences){
    expect(index).toContain('`'+r.sourceRef+'`');
    expect(r.printedPage).toBeGreaterThan(0);expect(r.pdfPage).toBe(r.printedPage+7);
    expect(mapping).toContain('|'+r.printedPage+'|'+r.pdfPage+'|'+r.sourceRef+'|'+r.evidenceStatus+'|');
    if(r.evidenceStatus==='PARTIAL_CONTEXTUAL')expect(n.reviewStatus).toBe('REVIEW_REQUIRED');
   }
  }
  expect(seed.nodes.filter(n=>n.textbookReferences[0].evidenceStatus==='PARTIAL_CONTEXTUAL')).toHaveLength(6);
 });
 it('leaves the frozen P1 fixture and review history unchanged',()=>{
  for(const [file,hash] of [
   ['content/fixtures/function-slice.ts','70919239d49b2c12abce194785bd5161cb1b0919a1749cf214c207ec0c0ba782'],
   ['docs/textbook/TEXTBOOK-REVIEW.md','8bef56a0db920f8a492b6082276a6cb86b6c9ae817be2d87b21ca5f6c10f08a4'],
  ])expect(createHash('sha256').update(readFileSync(file)).digest('hex')).toBe(hash);
 });
});
