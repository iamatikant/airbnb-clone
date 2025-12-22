import Image from "./Image";
import { Place } from "./types";

interface PlaceImgProps {
  place: Place;
  index?: number;
  className?: string | null;
}

export default function PlaceImg({ place, index = 0, className = null }: PlaceImgProps) {
  if (!place.photos?.length) {
    return "";
  }
  if (!className) {
    className = "object-cover";
  }
  return <Image className={className} src={place.photos[index]} alt="" />;
}
