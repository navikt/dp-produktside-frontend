import Config from "config";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Custom404() {
  const router = useRouter();

  useEffect(() => {
    router.replace(Config.appUrls.nav404);
  });

  return null;
}
