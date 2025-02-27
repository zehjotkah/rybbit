"use client";

import { useSingleCol } from "@/hooks/api";
import { Compass } from "lucide-react";
import Image from "next/image";
import { StandardCard } from "../../../components/shared/StandardCard";

const BROWSER_TO_LOGO: Record<string, string> = {
  Chrome: "Chrome.svg",
  "Mobile Chrome": "Chrome.svg",
  "Chrome WebView": "Chrome.svg",
  "Chrome Headless": "Chromium.svg",
  Chromium: "Chromium.svg",
  GSA: "Chromium.svg",
  Firefox: "Firefox.svg",
  "Mobile Firefox": "Firefox.svg",
  Safari: "Safari.svg",
  "Mobile Safari": "Safari.svg",
  Edge: "Edge.svg",
  Opera: "Opera.svg",
  "Opera Touch": "Opera.svg",
  "Opera GX": "OperaGX.svg",
  "Samsung Internet": "SamsungInternet.svg",
  Yandex: "Yandex.svg",
  QQBrowser: "QQ.webp",
  Whale: "Whale.svg",
  Baidu: "Baidu.svg",
  WebKit: "WebKit.svg",
  DuckDuckGo: "DuckDuckGo.svg",
  Facebook: "Facebook.svg",
  "Sogou Explorer": "Sogou.png",
  "Avast Secure Browser": "Avast.png",
  NAVER: "Naver.webp",
  UCBrowser: "UCBrowser.svg",
  "Android Browser": "Android.svg",
  "AVG Secure Browser": "AVG.svg",
  "Smart Lenovo Browser": "Lenovo.png",
  "Vivo Browser": "Vivo.webp",
  Instagram: "Instagram.svg",
  Silk: "Silk.png",
  KAKAOTALK: "KAKAOTALK.svg",
  Iron: "Iron.png",
  Sleipnir: "Sleipnir.webp",
  HeyTap: "HeyTap.png",
  Line: "Line.svg",
  "Oculus Browser": "Oculus.svg",
  Wolvic: "Wolvic.png",
  "360": "360.png",
  PaleMoon: "PaleMoon.png",
  WeChat: "WeChat.svg",
  "Coc Coc": "CocCoc.svg",
  "Huawei Browser": "Huawei.svg",
  IE: "IE.svg",
};

export function Browsers() {
  const { data, isFetching } = useSingleCol({ parameter: "browser" });

  return (
    <StandardCard
      title="Browsers"
      data={data}
      isFetching={isFetching}
      getKey={(e) => e.value}
      getLabel={(e) => (
        <div className="flex gap-2 items-center">
          {BROWSER_TO_LOGO[e.value] ? (
            <Image
              src={`/browsers/${BROWSER_TO_LOGO[e.value]}`}
              alt={e.value || "Other"}
              className="w-4 h-4"
              width={16}
              height={16}
            />
          ) : (
            <Compass width={16} />
          )}
          {e.value || "Other"}
        </div>
      )}
      getValue={(e) => e.value}
      filterParameter="browser"
    />
  );
}
