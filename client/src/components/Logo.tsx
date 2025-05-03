import { Tilt_Warp } from "next/font/google";
import Image from "next/image";

const tilt_wrap = Tilt_Warp({
  subsets: ["latin"],
  weight: "400",
});

export function Logo({
  size = "small",
}: {
  size?: "small" | "medium" | "large" | "xlarge" | "xxlarge";
}) {
  if (size === "small") {
    return (
      <div
        className={`flex items-center gap-1.5 ${tilt_wrap.className} text-lg`}
      >
        <Image src="/rybbit.png" alt="Rybbit" width={22} height={22} />
        rybbit.
      </div>
    );
  }

  if (size === "medium") {
    return (
      <div
        className={`flex items-center gap-1.5 ${tilt_wrap.className} text-xl`}
      >
        <Image src="/rybbit.png" alt="Rybbit" width={24} height={24} />
        rybbit.
      </div>
    );
  }

  if (size === "large") {
    return (
      <div
        className={`flex items-center gap-1.5 ${tilt_wrap.className} text-2xl`}
      >
        <Image src="/rybbit.png" alt="Rybbit" width={27} height={27} />
        rybbit.
      </div>
    );
  }

  if (size === "xlarge") {
    return (
      <div
        className={`flex items-center gap-2 ${tilt_wrap.className} text-3xl`}
      >
        <Image src="/rybbit.png" alt="Rybbit" width={34} height={34} />
        rybbit.
      </div>
    );
  }

  if (size === "xxlarge") {
    return (
      <div
        className={`flex items-center gap-2 ${tilt_wrap.className} text-4xl`}
      >
        <Image src="/rybbit.png" alt="Rybbit" width={38} height={38} />
        rybbit.
      </div>
    );
  }
}
