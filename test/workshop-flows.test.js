import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createServer } from "vite";

test("Jornada 2 renders the original A and B flows with copy buttons", async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  try {
    const { GuideRenderer } = await server.ssrLoadModule("/src/components/guide-renderer.tsx");
    const content = await readFile(new URL("../docs/02-guia-workshop.md", import.meta.url), "utf8");
    const source = await readFile(new URL("../docs/Flujos (2).md", import.meta.url), "utf8");
    const html = renderToStaticMarkup(createElement(GuideRenderer, {
      guide: { id: "workshop", title: "Workshop", eyebrow: "Workshop", description: "", content },
    }));
    const flows = html.slice(html.indexOf('<div class="workshop-flows">'), html.indexOf('<h3 id="relacion-entre-gdd-y-specs"'));

    assert.equal((flows.match(/class="flow-node"/g) ?? []).length, 9);
    assert.equal((flows.match(/class="flow-connector"/g) ?? []).length, 7);
    assert.ok(flows.includes('class="flow-start"'));
    assert.ok(flows.includes('class="flow-decision"'));
    assert.ok(flows.includes('class="flow-branches"'));
    assert.ok(flows.includes('aria-label="Elegí el recorrido según tu GDD"'));
    assert.ok(flows.includes("Expandir pasos"));
    assert.equal((flows.match(/<details[^>]* open=""/g) ?? []).length, 0);
    assert.ok(flows.includes('aria-label="Recorrido visible"'));
    assert.ok(flows.includes('aria-controls="flow-branch-a"'));
    assert.ok(flows.includes('aria-controls="flow-branch-b"'));
    assert.equal((flows.match(/aria-label="Copiar comando"/g) ?? []).length, 8);
    assert.ok(flows.indexOf("Flujo de Trabajo A:") < flows.indexOf("Flujo de Trabajo B:"));

    for (const [, title] of source.matchAll(/^\*\*(Paso \d+: .+)\*\*\s*$/gm)) {
      assert.ok(flows.includes(title), `Missing original step: ${title}`);
    }
    for (const [, code] of source.matchAll(/```sh\r?\n([\s\S]*?)```/g)) {
      const escaped = renderToStaticMarkup(createElement("code", null, code.trim()));
      assert.ok(flows.includes(escaped.slice(6, -7)), `Changed original command or prompt: ${code}`);
    }
  } finally {
    await server.close();
  }
});
