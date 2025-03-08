import { cn } from "@/lib/utils";
import React, { createContext, useContext, useState, useEffect } from "react";
import styles from "./avatar.module.css";

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error";

type AvatarContextType = {
  status: ImageLoadingStatus;
  setStatus: React.Dispatch<React.SetStateAction<ImageLoadingStatus>>;
};

const AvatarContext = createContext<AvatarContextType | undefined>(undefined);

function useAvatarContext() {
  const context = useContext(AvatarContext);
  if (!context) {
    throw new Error("useAvatarContext should be used within <Avatar>");
  }
  return context;
}

type AvatarProps = {
  children: React.ReactNode;
};

function Avatar({ children }: AvatarProps) {
  const [status, setStatus] = useState<ImageLoadingStatus>("idle");

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      {children}
    </AvatarContext.Provider>
  );
}

Avatar.displayName = "Avatar";

type AvatarImageProps = React.ComponentPropsWithoutRef<"img"> & {
  src: string;
  alt: string;
};

function AvatarImage({ src, alt, className, ...props }: AvatarImageProps) {
  const { setStatus } = useAvatarContext();
  const [loadingStatus, setLoadingStatus] =
    useState<ImageLoadingStatus>("idle");

  useEffect(() => {
    setLoadingStatus("loading");
    setStatus("loading");

    const img = new Image();
    img.src = src;
    img.onload = () => {
      setLoadingStatus("loaded");
      setStatus("loaded");
    };
    img.onerror = () => {
      setLoadingStatus("error");
      setStatus("error");
    };
  }, [src, setStatus]);

  if (loadingStatus === "loading" || loadingStatus === "error") {
    return null; // AvatarFallback will be used instead
  }

  return (
    <img
      className={cn(styles["avatar-fallback"], className)}
      src={src}
      alt={alt}
      {...props}
    />
  );
}

AvatarImage.displayName = "AvatarImage";

type AvatarFallbackProps = React.ComponentPropsWithoutRef<"span">;

function AvatarFallback({
  className,
  children,
  ...props
}: AvatarFallbackProps) {
  const { status } = useAvatarContext();

  if (status === "loaded") return null; // If the image is loaded, don't show fallback

  return (
    <span className={cn(styles["avatar-fallback"], className)} {...props}>
      {children}
    </span>
  );
}

AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
