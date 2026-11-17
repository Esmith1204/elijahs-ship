/// <reference types="vite/client" />

/** Site paths of every file in public/images. Provided by the plugin in vite.config.ts. */
declare module 'virtual:public-images' {
  const images: string[];
  export default images;
}
