import { basefilenameWithoutExt } from "zilla-util";

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

export class MediaInfo {
    readonly info: MediaInfoObject;
    readonly generalTrack: TrackObject | undefined;
    readonly videoTrack: TrackObject | undefined;
    readonly audioTracks: TrackObject[];
    readonly textTracks: TrackObject[];
    readonly imageTrack: TrackObject | undefined;

    constructor(info: string | MediaInfoObject) {
        this.info = typeof info === "string" ? JSON.parse(info) : info;
        this.generalTrack = this.findSingleTrack("General");
        this.videoTrack = this.findSingleTrack("Video");
        this.audioTracks = this.findTracks("Audio");
        this.textTracks = this.findTracks("Text");
        this.imageTrack = this.findSingleTrack("Image");
    }

    findTracks(trackType: TrackType): TrackObject[] {
        const tracks = this.info?.media?.track;
        if (!tracks || !Array.isArray(tracks) || tracks.length === 0) return [] as TrackObject[];
        return tracks.filter((t) => t["@type"] === trackType) as TrackObject[];
    }

    findSingleTrack(trackType: TrackType): TrackObject | undefined {
        const tracks = this.findTracks(trackType);
        return tracks.length === 1 ? tracks[0] : undefined;
    }

    title(): string | undefined {
        if (this.generalTrack?.Title) return this.generalTrack.Title;
        if (this.generalTrack?.Movie) return this.generalTrack.Movie;
        if (this.info.media["@ref"]) return basefilenameWithoutExt(this.info.media["@ref"]);
        return undefined;
    }

    width(): number | undefined {
        return this.videoTrack?.Width ? +this.videoTrack.Width : undefined;
    }

    height(): number | undefined {
        return this.videoTrack?.Height ? +this.videoTrack.Height : undefined;
    }

    duration(): number | undefined {
        return this.videoTrack?.Duration ? parseFloat(this.videoTrack.Duration) : undefined;
    }

    videoBitrate(): number | undefined {
        return this.videoTrack?.BitRate ? +this.videoTrack.BitRate : undefined;
    }

    bitrate(): number | undefined {
        if (this.generalTrack?.OverallBitRate) return +this.generalTrack.OverallBitRate;
        if (this.videoTrack?.BitRate) return +this.videoTrack.BitRate;
        if (this.audioTracks.length > 0) {
            const highestBitrateTrack = this.audioTracks.reduce((prev, current) => {
                const prevBitrate = typeof prev.BitRate === "string" ? +prev.BitRate : -Infinity;
                const currentBitrate = typeof current.BitRate === "string" ? +current.BitRate : -Infinity;
                return prevBitrate > currentBitrate ? prev : current;
            });
            return +highestBitrateTrack.BitRate;
        }
        return undefined;
    }
}
