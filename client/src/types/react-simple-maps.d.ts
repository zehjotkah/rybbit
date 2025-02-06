declare module "react-simple-maps" {
  import { ComponentType, ReactNode } from "react";
  import { Feature, Geometry } from "geojson";

  export interface ComposableMapProps {
    projection?: string;
    projectionConfig?: {
      rotate?: [number, number, number];
      scale?: number;
    };
    children?: ReactNode;
  }

  export interface GeographyProps {
    geography: Feature<Geometry>;
    style?: {
      default?: any;
      hover?: any;
      pressed?: any;
    };
    [key: string]: any;
  }

  export const ComposableMap: ComponentType<ComposableMapProps>;
  export const Geographies: ComponentType<{
    geography: string;
    children: (props: { geographies: Array<Feature<Geometry>> }) => ReactNode;
  }>;
  export const Geography: ComponentType<GeographyProps>;
  export const Sphere: ComponentType<any>;
  export const Graticule: ComponentType<any>;
  export const ZoomableGroup: ComponentType<any>;
}
