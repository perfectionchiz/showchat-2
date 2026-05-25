import { Image, ImageProps, ImageSource } from "expo-image";
import React, { useEffect, useState } from "react";

interface FallbackImageProps extends Omit<ImageProps, "source"> {
  uri?: string | null;
  fallback?: ImageSource;
}

const PLACEHOLDER_IMAGE = require("@/assets/images/placeholder.jpg");

export default function FallbackImage({
  uri,
  fallback = PLACEHOLDER_IMAGE,
  style,
  ...props
}: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [uri]);

  const imageSource =
    !hasError && uri && uri.startsWith("http") ? uri : fallback;

  return (
    <Image
      {...props}
      source={imageSource}
      style={style}
      contentFit={props.contentFit || "cover"}
      transition={200}
      cachePolicy="none"
      onError={(err) => {
        console.log(err, "image err");

        setHasError(true);
      }}
    />
  );
}
