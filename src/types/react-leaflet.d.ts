declare module "react-leaflet" {
    import * as React from "react";
    import {
        Map as LeafletMap,
        MapOptions,
        TileLayer as LeafletTileLayer,
        Marker as LeafletMarker,
        Popup as LeafletPopup,
        LatLngExpression,
    } from "leaflet";

    export interface MapContainerProps extends MapOptions {
        children?: React.ReactNode;
        style?: React.CSSProperties;
        className?: string;
        center?: LatLngExpression;
        zoom?: number;
    }

    export class MapContainer extends React.Component<MapContainerProps> { }
    export class TileLayer extends React.Component<{ url: string }> { }

    export class Marker extends React.Component<{
        position: LatLngExpression;
        children?: React.ReactNode;
    }> { }

    export class Popup extends React.Component {
        children?: React.ReactNode;
    }
}
