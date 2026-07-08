import { getCollection, type CollectionEntry } from "astro:content";

function getSnippetCategory(id: string): string {
  const parts = id.split("/");
  if (parts.length === 1) {
    return "uncategorized";
  }
  return parts.at(-2) || "uncategorized";
}

export type SnippetPages = Map<string, CollectionEntry<"snippets">[]>;
export async function getSnippetPages(): Promise<SnippetPages> {
  const collection = await getCollection("snippets");
  const pages: Map<string, CollectionEntry<"snippets">[]> = new Map();

  for (const page of collection) {
    if (page.data.draft && import.meta.env.MODE === "production") continue;
    const category = getSnippetCategory(page.id);
    const list = pages.get(category) || [];
    list.push(page);
    pages.set(category, list);
  }

  const sortedPages = new Map([...pages.entries()].sort());
  for (const [_, value] of sortedPages) {
    value.sort((a, b) => a.data.title.localeCompare(b.data.title));
  }

  return sortedPages;
}
