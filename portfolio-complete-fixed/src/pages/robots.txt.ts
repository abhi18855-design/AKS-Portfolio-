import type { APIRoute } from 'astro';
import {url} from '../utils/media';
export const GET: APIRoute = ({site}) => new Response(`User-agent: *\nAllow: /\nSitemap: ${new URL(url('/sitemap.xml'),site)}\n`,{headers:{'Content-Type':'text/plain'}});
