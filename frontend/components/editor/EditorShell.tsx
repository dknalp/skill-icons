"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LibraryPanel } from "./LibraryPanel";
import { CanvasPanel } from "./CanvasPanel";
import { SettingsPanel } from "./SettingsPanel";

interface EditorShellProps {
  icons: string[];
}

export function EditorShell({ icons }: EditorShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialise state from URL params on first render
  const [selectedArr, setSelectedArr] = useState<string[]>(() => {
    const i = searchParams.get("i");
    if (!i) return [];
    const iconSet = new Set(icons);
    return i.split(",").filter((n) => iconSet.has(n));
  });

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const t = searchParams.get("t");
    return t === "light" ? "light" : "dark";
  });

  const [perline, setPerline] = useState(() => {
    const p = parseInt(searchParams.get("perline") ?? "", 10);
    return p >= 1 && p <= 50 ? p : 15;
  });

  // Debounced URL sync — write params back without adding history entries
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      const params = new URLSearchParams();
      if (selectedArr.length > 0) params.set("i", selectedArr.join(","));
      if (theme !== "dark") params.set("t", theme);
      if (perline !== 15) params.set("perline", String(perline));
      const qs = params.toString();
      router.replace(qs ? `/editor?${qs}` : "/editor", { scroll: false });
    }, 300);
    return () => { if (syncTimer.current) clearTimeout(syncTimer.current); };
  }, [selectedArr, theme, perline, router]);

  // Keep a Set for O(1) lookup in the library grid
  const selectedSet = new Set(selectedArr);

  const toggle = useCallback((name: string) => {
    setSelectedArr((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }, []);

  const remove = useCallback((name: string) => {
    setSelectedArr((prev) => prev.filter((n) => n !== name));
  }, []);

  const reorder = useCallback((fromIdx: number, toIdx: number) => {
    setSelectedArr((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── Left: Library ─────────────────────────── */}
      <div className="w-72 shrink-0 flex flex-col overflow-hidden">
        <LibraryPanel
          icons={icons}
          selected={selectedSet}
          theme={theme}
          onToggle={toggle}
        />
      </div>

      {/* ── Center: Canvas ────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <CanvasPanel
          selected={selectedArr}
          theme={theme}
          perline={perline}
          onRemove={remove}
          onReorder={reorder}
        />
      </div>

      {/* ── Right: Settings ───────────────────────── */}
      <div className="w-56 shrink-0 flex flex-col overflow-hidden">
        <SettingsPanel
          selected={selectedArr}
          theme={theme}
          perline={perline}
          onThemeChange={setTheme}
          onPerlineChange={setPerline}
        />
      </div>
    </div>
  );
}
