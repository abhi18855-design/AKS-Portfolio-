export function fromLegacy(c){
 const cfg=c.siteConfig,profile=c.profile;
 const socials=[...['instagram','linkedin','youtube','twitter'].filter(k=>cfg[k]).map(k=>({label:{instagram:'Instagram',linkedin:'LinkedIn',youtube:'YouTube',twitter:'X / Twitter'}[k],url:cfg[k]})),...(cfg.otherSocials||[]).filter(l=>l.url)];
 return {version:1,site:{name:cfg.name,role:cfg.title,headline:cfg.heroDescription||'Imagination,\nmade visible.',intro:profile.introduction,about:profile.biography,email:cfg.email||'',phone:cfg.phone||'',contactUrl:'',contactTitle:cfg.contactHeading,contactText:cfg.contactDescription,description:cfg.description,socials,navigation:c.navigation,services:c.services,process:c.process,skills:profile.skills,experience:profile.experience,education:profile.education,additional:profile.additional,heroNote:cfg.heroNote,accent:cfg.accent,accentContrast:cfg.accentContrast,seoTitle:cfg.seo?.title},projects:c.projects.map(p=>{
 const gallery=[];if(p.thumbnail)gallery.push({id:p.id+'-cover',src:p.thumbnail,thumb:p.thumbnailSmall||p.thumbnail,alt:p.title});
 for(const [i,m]of (p.gallery||[]).entries())if(m.src!==p.thumbnail)gallery.push({id:p.id+'-gallery-'+i,src:m.src,thumb:m.thumb||m.src,alt:m.alt});
 if(p.mediaType==='image'&&p.media&&p.media!==p.thumbnail&&!gallery.some(m=>m.src===p.media))gallery.push({id:p.id+'-media',src:p.media,thumb:p.media,alt:p.title});
 return {id:p.id,slug:p.slug,title:p.title,subtitle:p.subtitle,description:p.description,category:p.category,date:String(p.year)+'-01-01',role:p.role||'',featured:p.featured,status:p.published?'published':'draft',demo:p.demo,cover:gallery[0]?.id||'',gallery,media:p.media||p.video||'',mediaType:p.mediaType||'video',projectUrl:p.projectUrl||'',tools:p.tools,process:p.process};
 })};
}
export function legacyMedia(c){return [...new Set(c.projects.flatMap(p=>[p.thumbnail,p.thumbnailSmall,p.hero,p.video,p.preview,p.media,p.captions,...(p.gallery||[]).flatMap(m=>[m.src,m.thumb])]).filter(v=>v&&!/^https?:\/\//.test(v)))];}
