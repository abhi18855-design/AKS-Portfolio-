// One-time bootstrap after GitHub authentication. Future edits publish in /editor/.
import {execFileSync} from 'node:child_process';import fs from 'node:fs';
const gh=process.env.GH_BIN||'gh',git=process.env.GIT_BIN||'git';
const run=(cmd,args,options={})=>execFileSync(cmd,args,{encoding:'utf8',stdio:['pipe','pipe','inherit'],...options}).trim();
const owner=run(gh,['api','user','--jq','.login']);
if(owner!=='abhi18855-design')throw Error(`Signed in as ${owner}; expected abhi18855-design. Confirm the account before deploying.`);
const repo=owner+'/portfolio';let exists=false;
try{run(gh,['repo','view',repo,'--json','name']);exists=true;}catch{}
if(exists)throw Error('The portfolio repository already exists. Inspect it before deploying; this script never overwrites an existing repository.');
run(process.execPath,['--test','tests/core.test.mjs'],{stdio:'inherit'});
run(process.execPath,['scripts/build.mjs'],{stdio:'inherit'});
run(gh,['repo','create',repo,'--public','--description','Abhishek Soni — portfolio and browser content editor']);
run(git,['init','-b','main']);run(git,['config','user.name',owner]);run(git,['config','user.email',`${owner}@users.noreply.github.com`]);
run(git,['add','.']);run(git,['commit','-m','Build portfolio and browser content editor']);
run(git,['remote','add','origin',`https://github.com/${repo}.git`]);
run(git,['-c','credential.helper=','-c',`credential.helper=!${gh} auth git-credential`,'push','-u','origin','main'],{stdio:'inherit'});
try{run(gh,['api','--method','POST',`repos/${repo}/pages`,'-f','build_type=workflow']);}catch{run(gh,['api','--method','PUT',`repos/${repo}/pages`,'-f','build_type=workflow']);}
run(gh,['workflow','run','deploy.yml','--repo',repo]);
console.log('Repository pushed and deployment requested. Verify GitHub Actions and both live URLs before reporting completion.');
