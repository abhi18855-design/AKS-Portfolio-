import { z } from 'astro/zod';
import rawSite from '../data/site.json';
import rawAbout from '../data/about.json';
import { safeLink } from './urls';
const text = z.preprocess(v => v ?? '', z.string());
const link = text.refine(v => !v || safeLink(v), 'Use an https:// URL or a root-relative file path.');
const links = z.preprocess(v => v ?? [], z.array(z.object({label:z.string().min(1),url:link})));
export const site = z.object({name:z.string().min(1),wordmark:z.string().min(1),description:z.string().min(1),introduction:text,featuredProject:text,professionalTitle:text,heroHeadline:text,heroDescription:text,ctaText:text,email:z.email(),location:text,availability:text,contactTitle:z.string().min(1),contactIntro:text,footerNote:text,accent:z.string().regex(/^#[0-9a-fA-F]{6}$/),socials:links}).parse(rawSite);
export const about = z.object({title:z.string().min(1),introduction:text,biography:text,background:text,philosophy:text,portrait:link,portraitAlt:text,disciplines:z.preprocess(v=>v??[],z.array(z.string())),resume:link,services:z.preprocess(v=>v??[],z.array(z.object({title:z.string().min(1),description:text}))),links}).parse(rawAbout);
