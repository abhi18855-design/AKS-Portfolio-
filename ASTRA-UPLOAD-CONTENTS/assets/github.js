export class GitHub {
 constructor({owner,repo,branch='main',token}) {if(!/^[\w-]+$/.test(owner)||!/^[\w.-]+$/.test(repo))throw Error('Invalid GitHub repository');this.root=`/repos/${owner}/${repo}`;this.owner=owner;this.repo=repo;this.branch=branch;this.token=token;}
 async api(path,method='GET',body){const r=await fetch('https://api.github.com'+path,{method,headers:{Accept:'application/vnd.github+json',Authorization:`Bearer ${this.token}`,'X-GitHub-Api-Version':'2022-11-28',...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});let value;try{value=await r.json();}catch{value={};}if(!r.ok){const messages={401:'GitHub sign-in expired or the token is invalid.',403:'GitHub denied access. Check token permissions, expiry and API rate limits.',404:'Repository or file not found. Check repository access.',409:'GitHub changed during publishing. Reconnect and review before retrying.',422:'GitHub rejected this update. The branch may have changed; reconnect before retrying.'};throw Object.assign(Error(messages[r.status]||value.message||`GitHub request failed (${r.status})`),{status:r.status});}return value;}
 async head(){return (await this.api(this.root+'/git/ref/heads/'+encodeURIComponent(this.branch))).object.sha;}
 async content(ref=this.branch){const file=await this.api(this.root+'/contents/content/site.json?ref='+encodeURIComponent(ref));let b64=file.content;if(!b64&&file.sha){b64=(await this.api(this.root+'/git/blobs/'+file.sha)).content;}return {sha:file.sha,content:JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g,'')),c=>c.charCodeAt(0))))};}
 async connect(){const [user,repo]=await Promise.all([this.api('/user'),this.api(this.root)]);if(!repo.permissions?.push)throw Error('This account cannot publish to this repository');const head=await this.head(),remote=await this.content(head);return {user:user.login,repo,head,...remote};}
 async blob(blob){const a=new Uint8Array(await blob.arrayBuffer());let binary='';for(let i=0;i<a.length;i+=32768)binary+=String.fromCharCode(...a.subarray(i,i+32768));return (await this.api(this.root+'/git/blobs','POST',{content:btoa(binary),encoding:'base64'})).sha;}
 async publish({content,baseline,media,onProgress=()=>{}}){
 const head=await this.head(),remote=await this.content(head);if(remote.sha!==baseline)throw Error('Someone changed the content on GitHub. Download your draft backup, then load the latest GitHub content before publishing. Nothing was overwritten.');
 const parent=await this.api(this.root+'/git/commits/'+head),tree=[];
 for(let i=0;i<media.length;i++){onProgress(`Uploading optimized file ${i+1} of ${media.length}`);tree.push({path:media[i].path,mode:'100644',type:'blob',sha:await this.blob(media[i].blob)});}
 tree.push({path:'content/site.json',mode:'100644',type:'blob',content:JSON.stringify(content,null,2)});
 onProgress('Creating one atomic content commit…');const t=await this.api(this.root+'/git/trees','POST',{base_tree:parent.tree.sha,tree});
 const commit=await this.api(this.root+'/git/commits','POST',{message:'Update portfolio content',tree:t.sha,parents:[head]});
 await this.api(this.root+'/git/refs/heads/'+encodeURIComponent(this.branch),'PATCH',{sha:commit.sha,force:false});
 const saved=await this.content(commit.sha);return {commit:commit.sha,baseline:saved.sha};
 }
 async deployment(sha){const r=await this.api(this.root+'/actions/workflows/deploy.yml/runs?head_sha='+encodeURIComponent(sha)+'&per_page=10');const run=r.workflow_runs.find(r=>r.head_sha===sha);return run?{status:run.status,conclusion:run.conclusion,url:run.html_url}:{status:'waiting',conclusion:null};}
}
