import Image from "next/image";
import { ImageStyle } from "@/data/works";

/**
 * Data-driven photograph frame. The frame owns the aspect ratio and the
 * image's focal point comes from the data layer, so crops stay intentional.
 */
export function PhotoFrame({
  src,
  alt,
  imageStyle,
  aspect,
  sizes,
  priority = false,
  rounded = "rounded-[1.75rem]",
  className = "",
  zoomOnHover = false,
}: {
  src: string;
  alt: string;
  imageStyle?: ImageStyle;
  /** Override the data aspect (e.g. for a deliberate crop). */
  aspect?: string;
  sizes: string;
  priority?: boolean;
  rounded?: string;
  className?: string;
  zoomOnHover?: boolean;
}) {
  return (
    <div
      className={`relative w-full overflow-hidden bg-foreground/5 ${rounded} ${aspect ?? imageStyle?.aspect ?? "aspect-[4/5]"} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover", objectPosition: imageStyle?.objectPosition ?? "center" }}
        className={
          zoomOnHover
            ? "transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            : undefined
        }
      />
    </div>
  );
}
