/** vite使用动态图片的方式 */
export function requireImg(name) {
  return new URL(`/src/assets/imgs/${name}`, import.meta.url).href
}
