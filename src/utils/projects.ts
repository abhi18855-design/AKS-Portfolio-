import { getCollection } from 'astro:content';
import { site } from './settings';
export async function library() {
  const [all, categories] = await Promise.all([getCollection('projects'), getCollection('categories')]);
  const slugs = new Set<string>();
  const categorySlugs = new Set<string>();
  for (const category of categories) {
    if (categorySlugs.has(category.data.slug)) throw new Error(`Duplicate category slug: ${category.data.slug}`);
    categorySlugs.add(category.data.slug);
  }
  for (const project of all) {
    if (slugs.has(project.data.slug)) throw new Error(`Duplicate project slug: ${project.data.slug}`);
    slugs.add(project.data.slug);
    if (!categorySlugs.has(project.data.category)) throw new Error(`Project ${project.data.title} references missing category ${project.data.category}. Reassign it before removing a category.`);
  }
  // A deleted or unpublished featured project falls back to the next published work.
  const projects = all.filter(p=>p.data.published && !p.data.deleted).sort((a,b)=>a.data.order-b.data.order || b.data.year-a.data.year || a.data.title.localeCompare(b.data.title));
  return {projects, categories:categories.sort((a,b)=>a.data.order-b.data.order), featured:projects.find(p=>p.data.slug===site.featuredProject) || projects.find(p=>p.data.featured) || projects[0]};
}
