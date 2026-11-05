import { withBase } from './urls';
export const url = (path: string) => withBase(path, import.meta.env.BASE_URL);
export const media = (path?: string) => url(path || '/media/images/projects/after-the-rain.svg');
