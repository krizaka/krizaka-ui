/** @krizaka/ui/media-carousel — `MediaCarousel` (`slides`, `label`; v2, ADR-010: `autoplay`, `sound`, `frame`, `caption`, `textVersion`): a sequence of clips, screen demos and stills given as data, one at a time; `carouselDwell`, `chapterAt`. Its files are checked by `@krizaka/ui/media-guard`. Client. */
export {
  CAROUSEL_MAX_DWELL,
  CAROUSEL_MIN_DWELL,
  type CarouselAutoplay,
  type CarouselChapter,
  carouselDwell,
  type CarouselSlide,
  type CarouselSlideKind,
  chapterAt,
  MediaCarousel,
  mediaCarousel,
  type MediaCarouselLabels,
  mediaCarouselLabels,
  type MediaCarouselProps,
} from "./media-carousel";
