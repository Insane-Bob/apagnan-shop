export class URLUtils {
    static removeLastSlash(url) {
        return url.replace(/\/$/, '')
    }
}
