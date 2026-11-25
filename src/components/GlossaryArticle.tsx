"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GLOSSARY } from "@/lib/glossary";

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wrapGlossaryTerms(html: string): string {
  if (typeof window === "undefined") return html;
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const keys = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
  const pattern = new RegExp(`\\b(${keys.map(escapeRegExp).join("|")})\\b`, "g");

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  const textNodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (!parent) continue;
    if (
      parent.closest("a") ||
      parent.closest("abbr") ||
      parent.closest("code") ||
      parent.closest("pre")
    ) {
      continue;
    }
    if (node.textContent && pattern.test(node.textContent)) {
      textNodes.push(node as Text);
    }
    pattern.lastIndex = 0;
  }

  for (const tNode of textNodes) {
    const text = tNode.textContent ?? "";
    pattern.lastIndex = 0;
    let lastIndex = 0;
    const frag = doc.createDocumentFragment();
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIndex) {
        frag.appendChild(
          doc.createTextNode(text.slice(lastIndex, match.index))
        );
      }
      const abbr = doc.createElement("abbr");
      abbr.className = "abbr-term";
      abbr.setAttribute("data-abbr", match[1]);
      abbr.setAttribute("tabindex", "0");
      abbr.textContent = match[1];
      frag.appendChild(abbr);
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      frag.appendChild(doc.createTextNode(text.slice(lastIndex)));
    }
    tNode.parentNode?.replaceChild(frag, tNode);
  }

  return doc.body.innerHTML;
}

export function GlossaryArticle({ htmlContent }: { htmlContent: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [enhancedHtml, setEnhancedHtml] = useState(htmlContent);
  const [activeTerm, setActiveTerm] = useState<{
    term: string;
    def: string;
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    setEnhancedHtml(wrapGlossaryTerms(htmlContent));
  }, [htmlContent]);

  const glossaryKeys = useMemo(() => GLOSSARY, []);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const showTip = (el: HTMLElement) => {
      const term = el.getAttribute("data-abbr");
      if (!term || !glossaryKeys[term]) return;
      const rect = el.getBoundingClientRect();
      const left = Math.min(
        Math.max(16, rect.left + rect.width / 2 - 140),
        window.innerWidth - 296
      );
      const top =
        rect.bottom + 8 + 110 > window.innerHeight
          ? Math.max(16, rect.top - 96)
          : rect.bottom + 8;
      setActiveTerm({
        term,
        def: glossaryKeys[term],
        top,
        left,
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-abbr]") as HTMLElement | null;
      if (target) showTip(target);
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-abbr]");
      if (target) setActiveTerm(null);
    };

    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("[data-abbr]") as HTMLElement | null;
      if (target) {
        e.stopPropagation();
        showTip(target);
      } else {
        setActiveTerm(null);
      }
    };

    root.addEventListener("mouseover", onMouseOver);
    root.addEventListener("mouseout", onMouseOut);
    root.addEventListener("click", onClick);
    const closeOnScroll = () => setActiveTerm(null);
    window.addEventListener("scroll", closeOnScroll, { passive: true });

    return () => {
      root.removeEventListener("mouseover", onMouseOver);
      root.removeEventListener("mouseout", onMouseOut);
      root.removeEventListener("click", onClick);
      window.removeEventListener("scroll", closeOnScroll);
    };
  }, [glossaryKeys, enhancedHtml]);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="prose-intel"
        dangerouslySetInnerHTML={{ __html: enhancedHtml }}
      />
      {activeTerm && (
        <div
          role="tooltip"
          style={{ top: activeTerm.top, left: activeTerm.left }}
          className="fixed z-50 w-[280px] rounded-lg border border-[#1e3a5f] bg-[#121417] text-white p-3 shadow-xl pointer-events-none"
        >
          <div className="text-[11px] font-mono font-bold text-[#93c5fd] mb-1">
            {activeTerm.term}
          </div>
          <div className="text-xs leading-relaxed text-gray-100">
            {activeTerm.def}
          </div>
        </div>
      )}
    </div>
  );
}
