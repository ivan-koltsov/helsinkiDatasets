/// <reference types="vite/client" />

declare module "*.png";
declare module "*.png?url";
declare module "*.svg";
declare module "*.svg?url";
declare module "*.jpg";
declare module "*.jpg?url";

declare module "leaflet/dist/images/*.png" {
  const value: string;
  export default value;
}
