"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { API_BASE } from "@/lib/api";
import { cn } from "@/lib/utils";

// Mirror of shortNames from index.js — used for alias-aware search
const SHORT_NAMES: Record<string, string> = {
  js: "javascript", ts: "typescript", py: "python",
  tailwind: "tailwindcss", vue: "vuejs", nuxt: "nuxtjs",
  go: "golang", cf: "cloudflare", wasm: "webassembly",
  postgres: "postgresql", k8s: "kubernetes", next: "nextjs",
  mongo: "mongodb", md: "markdown", ps: "photoshop",
  ai: "illustrator", pr: "premiere", ae: "aftereffects",
  scss: "sass", sc: "scala", net: "dotnet",
  gatsbyjs: "gatsby", gql: "graphql", vlang: "v",
  amazonwebservices: "aws", bots: "discordbots",
  express: "expressjs", googlecloud: "gcp", mui: "materialui",
  windi: "windicss", unreal: "unrealengine", nest: "nestjs",
  ktorio: "ktor", pwsh: "powershell", au: "audition",
  rollup: "rollupjs", rxjs: "reactivex", rxjava: "reactivex",
  ghactions: "githubactions", sklearn: "scikitlearn",
  hf: "huggingface", lc: "langchain", rr: "reactrouter",
  davinci: "davinciresolve", scholar: "googlescholar",
  fm: "framermotion",
  yt: "youtube", tg: "telegram", fb: "facebook",
  wa: "whatsapp", ig: "instagram", tt: "tiktok",
  gh: "github", tw: "twitch", dc: "discord",
  bs: "bluesky", xd: "adobexd", iv: "invision",
  trbo: "turborepo",
};

// Alias map: canonical name → list of aliases that point to it
const ALIASES: Record<string, string[]> = {};
for (const [alias, target] of Object.entries(SHORT_NAMES)) {
  if (!ALIASES[target]) ALIASES[target] = [];
  ALIASES[target].push(alias);
}

function fuzzyFilter(icons: string[], q: string): string[] {
  if (!q) return icons;
  // If query exactly matches a shortName alias, expand it
  const aliasTarget = SHORT_NAMES[q];
  const resultSet = new Set<string>();

  // Priority 1: exact alias match (e.g. "ts" → add "typescript" first)
  if (aliasTarget && icons.includes(aliasTarget)) resultSet.add(aliasTarget);

  // Priority 2: prefix match on icon name
  for (const n of icons) if (n.startsWith(q)) resultSet.add(n);

  // Priority 3: substring match on icon name
  for (const n of icons) if (n.includes(q) && !resultSet.has(n)) resultSet.add(n);

  // Priority 4: query matches one of the icon's aliases
  for (const n of icons) {
    if (!resultSet.has(n)) {
      const aliases = ALIASES[n] ?? [];
      if (aliases.some((a) => a.includes(q))) resultSet.add(n);
    }
  }

  return [...resultSet];
}

interface LibraryPanelProps {
  icons: string[];
  selected: Set<string>;
  theme: "dark" | "light";
  onToggle: (name: string) => void;
}

export function LibraryPanel({ icons, selected, theme, onToggle }: LibraryPanelProps) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return fuzzyFilter(icons, search.toLowerCase().trim());
  }, [icons, search]);

  return (
    <div className="flex flex-col h-full bg-black border-r border-white/[0.08]">

      {/* ── Header ──────────────────────────────── */}
      <div className="px-4 py-5 border-b border-white/[0.06]">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">Library</p>
          <span className="text-xs font-mono text-white/30 tabular-nums">{icons.length}</span>
        </div>

        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            width="13" height="13" viewBox="0 0 13 13" fill="none"
          >
            <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          <Input
            type="text"
            placeholder="Search icons…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-9 text-sm bg-white/[0.04] border-white/[0.08] text-white placeholder-white/25 focus-visible:ring-white/20 focus-visible:border-white/25 rounded-lg"
          />
        </div>

        {/* Result count */}
        <p className="mt-2 text-xs text-white/30">
          {search
            ? `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`
            : `${selected.size} selected`}
        </p>
      </div>

      {/* ── Icon grid ───────────────────────────── */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 grid grid-cols-4 gap-1.5">
          {filtered.map((name) => {
            const isSelected = selected.has(name);
            return (
              <Tooltip key={name}>
                <TooltipTrigger
                  render={
                    <button
                      type="button"
                      onClick={() => onToggle(name)}
                      className={cn(
                        "relative flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-all cursor-pointer",
                        isSelected
                          ? "bg-white/[0.10] ring-1 ring-white/[0.25]"
                          : "hover:bg-white/[0.05]"
                      )}
                    />
                  }
                >
                  {isSelected && (
                    <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center z-10">
                      <svg width="7" height="5" viewBox="0 0 7 5" fill="none">
                        <path d="M1 2.5L2.5 4L6 1" stroke="black" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${API_BASE}/icons?i=${name}&t=${theme}&perline=1`}
                    alt={name}
                    className="w-9 h-9"
                    loading="lazy"
                  />
                  <span className="text-[10px] font-mono text-white/40 truncate w-full text-center leading-tight">
                    {name}
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="font-mono text-xs">{name}</span>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-xs text-white/20">
            No results for &ldquo;{search}&rdquo;
          </p>
        )}
      </ScrollArea>
    </div>
  );
}
