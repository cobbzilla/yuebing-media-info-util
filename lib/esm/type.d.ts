export type TrackType = "General" | "Video" | "Audio" | "Text" | "Image";
export type TrackObject = Record<string, string> & {
    "@type": TrackType;
    extra: Record<string, string>;
};
export type MediaInfoObject = {
    creatingLibrary: {
        name: string;
        version: string;
        url: string;
    };
    media: {
        "@ref": string;
        track: TrackObject[];
    };
};
export declare class MediaInfo {
    readonly info: MediaInfoObject;
    readonly generalTrack: TrackObject | undefined;
    readonly videoTrack: TrackObject | undefined;
    readonly audioTracks: TrackObject[];
    readonly textTracks: TrackObject[];
    readonly imageTrack: TrackObject | undefined;
    constructor(info: string | MediaInfoObject);
    findTracks(trackType: TrackType): TrackObject[];
    findSingleTrack(trackType: TrackType): TrackObject | undefined;
    title(): string | undefined;
    width(): number | undefined;
    height(): number | undefined;
    duration(): number | undefined;
    videoBitrate(): number | undefined;
    bitrate(): number | undefined;
}
