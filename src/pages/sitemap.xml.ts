import type { APIRoute } from 'astro';
import { library } from '../utils/projects';
import { url } from '../utils/media';
export const GET: APIRoute = async ({site}) => {
  const {projects}=await library();
  const paths=['/','/work/','/about/','/contact/',...projects.map(p=>`/projects/${p.data.slug}/`)];
  const xml=`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map(path=>`<url><loc>${new URL(url(path),site).href.replace(/&/g,'&amp;')}</loc></url>`).join('')}</urlset>`;
  return new Response(xml,{headers:{'Content-Type':'application/xml'}});
};
