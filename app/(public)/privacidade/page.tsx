import { privacyContent } from "@/lib/content/static-pages";

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">{privacyContent.title}</h1>
      <div className="mt-6 grid gap-4 text-slate-700">
        {privacyContent.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
