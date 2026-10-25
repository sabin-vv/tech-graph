"use client"

import Image from "next/image"
import { TechGraphStage } from "@/components/graph/TechGraphStage"

export function AuthMarketingSection() {
  return (
    <div className="mx-auto w-full max-w-160 space-y-6">
      <Image src="/image/brandLogo.png" alt="logo" width={300} height={180} />
      <TechGraphStage className="mx-auto border-0" width={480} height={320} />
      <div className="copy relative z-10 mt-6">
        <h1 className="max-w-[16ch] font-[Space_Grotesk] text-[28px] leading-[1.14] font-bold tracking-[-0.015em] sm:text-[34px]">
          See how your stack{" "}
          <em className="from-teal to-blue bg-linear-to-r bg-clip-text text-transparent not-italic">
            connects.
          </em>
        </h1>
        <p className="text-ink-dim mt-3 max-w-[52ch] text-sm leading-relaxed">
          TechGraph turns scattered docs, frameworks, and half-remembered notes
          into one living map of everything you know.
        </p>
        <div className="stats mt-6 flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <b className="block font-[Space_Grotesk] text-[17px]">40K+</b>
            <span className="text-ink-dim block font-[JetBrains_Mono] text-[9px] tracking-[0.09em]">
              NODES MAPPED DAILY
            </span>
          </div>
          <div>
            <b className="block font-[Space_Grotesk] text-[17px]">180+</b>
            <span className="text-ink-dim block font-[JetBrains_Mono] text-[9px] tracking-[0.09em]">
              FRAMEWORKS INDEXED
            </span>
          </div>
          <div>
            <b className="block font-[Space_Grotesk] text-[17px]">2.1M</b>
            <span className="text-ink-dim block font-[JetBrains_Mono] text-[9px] tracking-[0.09em]">
              DEVS ON TECHGRAPH
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
