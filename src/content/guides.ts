export type GuideId = "marco-conceptual" | "workshop" | "referencia-cli";

export type Guide = {
  id: GuideId;
  title: string;
  eyebrow: string;
  description: string;
  content: string;
};

const markdownFiles = import.meta.glob("../../docs/*.md", {
  eager: true,
  import: "default",
  query: "?raw",
}) as Record<string, string>;

function cleanFrontmatter(content: string) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
}

function source(name: string) {
  return cleanFrontmatter(markdownFiles[`../../docs/${name}`] ?? "");
}

export const guides: Guide[] = [
  {
    id: "marco-conceptual",
    title: "Desarrollo guiado por agentes",
    eyebrow: "Marco conceptual",
    description: "Principios, vocabulario, riesgos y uso académico responsable.",
    content: source("01-marco-conceptual.md"),
  },
  {
    id: "workshop",
    title: "Del GDD a una spec",
    eyebrow: "Workshop",
    description: "Dos jornadas para pasar de una idea de juego a un cambio verificable.",
    content: source("02-guia-workshop.md"),
  },
  {
    id: "referencia-cli",
    title: "Referencia rápida del CLI",
    eyebrow: "Referencia",
    description: "Niveles, opciones, archivos generados y comandos frecuentes.",
    content: source("03-referencia-cli.md"),
  },
];

export function findGuide(id: string | null) {
  return guides.find((guide) => guide.id === id);
}

export function guideHref(id: GuideId) {
  return `?guia=${id}`;
}
