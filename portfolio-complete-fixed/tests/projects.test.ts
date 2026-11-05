import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initializeProjects,selectedProjects,moveSelected,deleteCategory,mergeSaved} from '../public/editor/projects.js';
import {normalize,validateProject,documentBytes} from '../public/editor/core.js';
const project=(slug:string,order:number,selectedWork=true)=>normalize({meta:{title:slug,slug,description:'Project description',year:2026,order,selectedWorkOrder:order,selectedWork,published:true,category:'',cover:'https://example.com/cover.jpg'},body:'Keep full description'});
test('uncategorised publishing, selection, reorder, save/reload, removal and deletion preserve data',()=>{
 const docs:any={a:project('a',1),b:project('b',2)};
 docs.c=project('c',3,false);validateProject(docs.c,docs,{},'c');
 assert.deepEqual(selectedProjects(docs).map(([p]:any)=>p),['a','b']);
 docs.c.meta.selectedWork=true;moveSelected(docs,'c',-1);moveSelected(docs,'c',-1);
 const saved=JSON.parse(JSON.stringify(docs));initializeProjects(saved);
 assert.deepEqual(selectedProjects(saved).map(([p]:any)=>p),['c','a','b']);
 saved.c.meta.selectedWork=false;assert.equal(saved.c.body,'Keep full description');assert.equal(saved.c.meta.published,true);
 saved.a.meta.deleted=true;assert.deepEqual(selectedProjects(saved).map(([p]:any)=>p),['b']);
 assert.match(new TextDecoder().decode(documentBytes('c.md',saved.c)),/"selectedWork": false/);
});
test('category rename/delete changes no project content or ordering',()=>{
 const path='src/content/categories/custom.json';const docs:any={a:project('a',1),[path]:{slug:'custom',name:'Custom'}};
 docs.a.meta.category='custom';const original=structuredClone(docs.a);docs[path].name='Renamed';validateProject(docs.a,docs,{},'a');
 deleteCategory(docs,path);original.meta.category='';assert.deepEqual(docs.a,original);validateProject(docs.a,docs,{},'a');
 initializeProjects(docs);assert.equal(docs.a.meta.category,'');assert.equal(docs[path].deleted,true);
});
test('legacy selections migrate once and remain independent of highlight flags',()=>{
 const docs:any={a:project('a',1),b:project('b',2)};delete docs.a.meta.selectedWork;delete docs.a.meta.selectedWorkOrder;docs.a.meta.featured=true;
 initializeProjects(docs);const order=docs.a.meta.selectedWorkOrder;docs.a.meta.selectedWork=false;initializeProjects(docs);
 assert.equal(docs.a.meta.selectedWork,false);assert.equal(docs.a.meta.featured,true);assert.equal(docs.a.meta.selectedWorkOrder,order);
});
test('deployment refresh merges pending drafts and reports conflicting changes',()=>{
 const before:any={a:project('a',1),b:project('b',2)};const local:any={baseDocs:structuredClone(before),docs:structuredClone(before)};
 local.docs.a.meta.selectedWork=false;const published=structuredClone(before);published.b.meta.title='Published edit';
 let result=mergeSaved(published,local);assert.equal(result.docs.a.meta.selectedWork,false);assert.equal(result.docs.b.meta.title,'Published edit');assert.deepEqual(result.conflicts,[]);
 published.a.meta.title='Conflicting edit';result=mergeSaved(published,local);assert.deepEqual(result.conflicts,['a']);
});
test('new published projects without selection stay off homepage and invalid order is rejected',()=>{
 const docs:any={a:project('a',1,false)};initializeProjects(docs);assert.equal(selectedProjects(docs).length,0);
 docs.a.meta.selectedWorkOrder=Infinity;assert.throws(()=>validateProject(docs.a,docs,{},'a'),/finite/);
});
