// src/utils/slugify.js
export default function slugify(s=''){
  return s.toString().toLowerCase()
    .trim()
    .replace(/\s+/g,'-')
    .replace(/[^\w\-]+/g,'')
    .replace(/\-\-+/g,'-');
}
