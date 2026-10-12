import { Suspense } from "react";
import { iconNameList } from "@/lib/icons";
import { EditorShell } from "@/components/editor/EditorShell";

export const revalidate = 0; // never cache — always serve the latest icon list

export const metadata = {
  title: "Editor — Skill Icons",
  description: "Build your skill badge visually. Search, select and configure 326+ icons.",
};

export default async function EditorPage() {
  const icons = iconNameList;

  return (
    // Takes the full remaining viewport height (100dvh minus the 56px navbar)
    <div className="flex flex-col" style={{ height: "calc(100dvh - 56px)" }}>
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-white/20 text-sm">Loading editor…</div>}>
        <EditorShell icons={icons} />
      </Suspense>
    </div>
  );
}
