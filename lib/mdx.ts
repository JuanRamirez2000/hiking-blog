import fs from "fs";
import path from "path";
import matter from "gray-matter";

const HIKES_DIR = path.join(process.cwd(), "content/hikes");

export function getHikeContent(slug: string) {
  const filePath = path.join(HIKES_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(raw);

  return { frontmatter, content };
}

export function getAllHikeSlugs(): string[] {
  if (!fs.existsSync(HIKES_DIR)) return [];
  return fs
    .readdirSync(HIKES_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));
}
