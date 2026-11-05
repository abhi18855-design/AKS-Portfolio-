// Shared by the editor and website: Selected Work never controls the main highlight.
export const projectEntries = docs => Object.entries(docs).filter(([, d]) => d.meta);
export const categoryEntries = docs => Object.entries(docs).filter(([p, d]) => p.includes('/categories/') && !d.deleted);
export const compareSelected = (a, b) => a.selectedWorkOrder - b.selectedWorkOrder || a.slug.localeCompare(b.slug);
export function selectedProjects(docs, publishedOnly = true) {
  return projectEntries(docs).filter(([, d]) => !d.meta.deleted && d.meta.selectedWork && (!publishedOnly || d.meta.published)).sort((a,b) => compareSelected(a[1].meta,b[1].meta));
}
export function initializeProjects(docs) {
  const entries = projectEntries(docs);
  // Migrate legacy selections once, preserving their previous visible sequence.
  const legacy = [...entries].sort((a,b) => (a[1].meta.order ?? 100)-(b[1].meta.order ?? 100) || b[1].meta.year-a[1].meta.year || a[1].meta.title.localeCompare(b[1].meta.title));
  let next = Math.max(0, ...entries.map(([,d]) => Number.isFinite(d.meta.selectedWorkOrder) ? d.meta.selectedWorkOrder : 0));
  for (const [,d] of legacy) {
    d.meta.selectedWork ??= !!d.meta.featured;
    if (!Number.isFinite(d.meta.selectedWorkOrder)) d.meta.selectedWorkOrder = ++next;
    d.meta.category ??= '';
  }
  const categories = new Set(categoryEntries(docs).map(([,d]) => d.slug));
  for (const [,d] of entries) if (!categories.has(d.meta.category)) d.meta.category = '';
}
export function moveSelected(docs, path, delta) {
  const entries = selectedProjects(docs, false), index = entries.findIndex(([p]) => p === path), target = index + delta;
  if (index < 0 || target < 0 || target >= entries.length) return;
  [entries[index], entries[target]] = [entries[target], entries[index]];
  entries.forEach(([,d], i) => { d.meta.selectedWorkOrder = i + 1; });
}
export function deleteCategory(docs, path) {
  const category = docs[path];
  if (!category || !path.includes('/categories/')) throw Error('Category not found.');
  // Tombstones also work with GitHub uploads, which cannot delete old files.
  category.deleted = true;
  for (const [,d] of projectEntries(docs)) if (d.meta.category === category.slug) d.meta.category = '';
}
export function mergeSaved(base, local) {
  const docs = structuredClone(base), conflicts = [];
  for (const [path, value] of Object.entries(local.docs)) {
    const before = local.baseDocs?.[path];
    if (JSON.stringify(value) === JSON.stringify(before)) continue;
    if (JSON.stringify(base[path]) === JSON.stringify(value)) continue;
    if (JSON.stringify(base[path]) !== JSON.stringify(before)) conflicts.push(path);
    else docs[path] = structuredClone(value);
  }
  return {docs, conflicts};
}
