import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { safeLink } from './utils/urls';
const text = z.preprocess(v => v ?? '', z.string());
const link = text.refine(v => !v || safeLink(v), 'Use an https:// URL or a /media/ path.');
const list = <T extends z.ZodType>(schema: T) => z.preprocess(v => v ?? [], z.array(schema));
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase words separated by hyphens.');
const projects = defineCollection({
  loader: glob({pattern:'**/*.md', base:'./src/content/projects', generateId: ({entry}) => entry.replace(/\.md$/, '')}),
  schema: z.object({
    title:z.string().min(1), slug, description:z.string().min(1).max(320), category:z.preprocess(v => v ?? '', z.union([slug,z.literal('')])),
    year:z.number().int().min(1900).max(2200), cover:link, coverAlt:text, hero:link,
    selectedWork:z.boolean().default(false), selectedWorkOrder:z.number().default(100),
    featured:z.boolean().default(false), published:z.boolean().default(false), demo:z.boolean().default(false),
    order:z.preprocess(v => v ?? 100, z.number()), youtube:text, video:link, tags:list(z.string()), deleted:z.boolean().default(false), role:text,
    gallery:list(z.object({image:link, alt:text, caption:text})),
    audio:list(z.object({title:z.string().min(1), file:link, description:text, cover:link, external:link})),
    credits:list(z.object({label:z.string().min(1), value:z.string().min(1)})),
    links:list(z.object({label:z.string().min(1), url:link}))
  })
});
const categories = defineCollection({loader:glob({pattern:'*.json',base:'./src/content/categories'}),schema:z.object({deleted:z.boolean().default(false),slug,name:z.string().min(1),description:text,order:z.preprocess(v => v ?? 100, z.number())})});
export const collections = {projects,categories};
