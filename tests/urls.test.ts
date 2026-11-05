import {test} from 'node:test';
import assert from 'node:assert/strict';
import {withBase,safeLink} from '../src/utils/urls.ts';
import {youtubeId} from '../src/utils/youtube.ts';
test('repository paths and external media remain correct',()=>{
  assert.equal(withBase('/projects/film/','/portfolio/'),'/portfolio/projects/film/');
  assert.equal(withBase('/portfolio/media/audio/a.mp3','/portfolio/'),'/portfolio/media/audio/a.mp3');
  assert.equal(withBase('/media/a.jpg','/'),'/media/a.jpg');
  assert.equal(withBase('https://cdn.example.com/a.mp3','/portfolio'),'https://cdn.example.com/a.mp3');
  assert.equal(withBase('mailto:hello@example.com','/portfolio'),'mailto:hello@example.com');
  assert.equal(safeLink('javascript:alert(1)'),false);
  assert.equal(safeLink('//unknown.example'),false);
});
test('YouTube share, watch, mobile, Shorts, live and embed URLs',()=>{
  const id='aqz-KE-bpKQ';
  for(const value of [`https://youtu.be/${id}?t=5`,`https://www.youtube.com/watch?v=${id}&feature=share`,`https://m.youtube.com/watch?v=${id}`,`https://youtube.com/shorts/${id}`,`https://youtube.com/live/${id}`,`https://www.youtube-nocookie.com/embed/${id}`])assert.equal(youtubeId(value),id);
});
test('malformed and lookalike video URLs never produce an iframe ID',()=>{
  for(const value of ['', 'not a URL','https://youtube.com.evil.example/watch?v=aqz-KE-bpKQ','https://example.com/aqz-KE-bpKQ','javascript:alert(1)','https://youtube.com/watch?v=bad'])assert.equal(youtubeId(value),null);
});
