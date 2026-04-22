// Fix recharts JSX component type compatibility with React 18
// See: https://github.com/recharts/recharts/issues/3615
import type { ComponentType } from "react";

declare module "recharts" {
  export const XAxis: ComponentType<any>;
  export const YAxis: ComponentType<any>;
  export const Tooltip: ComponentType<any>;
  export const Area: ComponentType<any>;
  export const Bar: ComponentType<any>;
  export const Legend: ComponentType<any>;
  export const Cell: ComponentType<any>;
  export const Pie: ComponentType<any>;
  export const CartesianGrid: ComponentType<any>;
  export const Line: ComponentType<any>;
}