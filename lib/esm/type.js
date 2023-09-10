import { basefilenameWithoutExt } from "zilla-util";
export class MediaInfo {
    constructor(info) {
        this.info = typeof info === "string" ? JSON.parse(info) : info;
        this.generalTrack = this.findSingleTrack("General");
        this.videoTrack = this.findSingleTrack("Video");
        this.audioTracks = this.findTracks("Audio");
        this.textTracks = this.findTracks("Text");
        this.imageTrack = this.findSingleTrack("Image");
    }
    findTracks(trackType) {
        var _a, _b;
        const tracks = (_b = (_a = this.info) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b.track;
        if (!tracks || !Array.isArray(tracks) || tracks.length === 0)
            return [];
        return tracks.filter((t) => t["@type"] === trackType);
    }
    findSingleTrack(trackType) {
        const tracks = this.findTracks(trackType);
        return tracks.length === 1 ? tracks[0] : undefined;
    }
    title() {
        var _a, _b;
        if ((_a = this.generalTrack) === null || _a === void 0 ? void 0 : _a.Title)
            return this.generalTrack.Title;
        if ((_b = this.generalTrack) === null || _b === void 0 ? void 0 : _b.Movie)
            return this.generalTrack.Movie;
        if (this.info.media["@ref"])
            return basefilenameWithoutExt(this.info.media["@ref"]);
        return undefined;
    }
    width() {
        var _a;
        return ((_a = this.videoTrack) === null || _a === void 0 ? void 0 : _a.Width) ? +this.videoTrack.Width : undefined;
    }
    height() {
        var _a;
        return ((_a = this.videoTrack) === null || _a === void 0 ? void 0 : _a.Height) ? +this.videoTrack.Height : undefined;
    }
    duration() {
        var _a;
        return ((_a = this.videoTrack) === null || _a === void 0 ? void 0 : _a.Duration) ? parseFloat(this.videoTrack.Duration) : undefined;
    }
    videoBitrate() {
        var _a;
        return ((_a = this.videoTrack) === null || _a === void 0 ? void 0 : _a.BitRate) ? +this.videoTrack.BitRate : undefined;
    }
    bitrate() {
        var _a, _b;
        if ((_a = this.generalTrack) === null || _a === void 0 ? void 0 : _a.OverallBitRate)
            return +this.generalTrack.OverallBitRate;
        if ((_b = this.videoTrack) === null || _b === void 0 ? void 0 : _b.BitRate)
            return +this.videoTrack.BitRate;
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
