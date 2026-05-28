import { requireAdmin } from "@/lib/admin-guard";
import {
  LANGUAGES,
  TRANSLATIONS,
  type LanguageCode,
  type TranslationKey,
} from "@/lib/preferences-data";
import { getAllOverrides } from "@/lib/content";
import { saveContent } from "../actions";
import { ContentEditor } from "@/components/admin/ContentEditor";

export const dynamic = "force-dynamic";

type FieldSpec = {
  key: TranslationKey;
  label: string;
  type?: "text" | "textarea" | "image";
};
type Section = {
  id: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  previewHref?: string;
  fields: FieldSpec[];
};

const SECTIONS: Section[] = [
  {
    id: "hero",
    title: "Hero",
    description: "Top of the homepage — the show.",
    defaultOpen: true,
    previewHref: "/",
    fields: [
      { key: "imgHeroBg", label: "Background image", type: "image" },
      { key: "imgHeroModel", label: "Foreground model image", type: "image" },
      { key: "heroKicker", label: "Kicker (above wordmark)" },
      { key: "urbanUniform", label: "Wordmark / brand tagline" },
      { key: "subPart1", label: "Subline – part 1" },
      { key: "subPart2", label: "Subline – part 2 (accent)" },
      { key: "subPart3", label: "Subline – part 3" },
      { key: "shopTheDrop", label: "Primary CTA" },
      { key: "seeLookbook", label: "Secondary CTA" },
      { key: "newCollection", label: 'Live "new collection" badge' },
      { key: "scrollToEnter", label: "Scroll hint" },
    ],
  },
  {
    id: "manifesto",
    title: "Manifesto",
    description: "The dedicated manifesto section on the homepage.",
    previewHref: "/",
    fields: [
      { key: "manifesto", label: "Section label" },
      { key: "manifestoText", label: "Body", type: "textarea" },
    ],
  },
  {
    id: "featured",
    title: "Featured grid",
    description: "Heading above the homepage product grid.",
    previewHref: "/",
    fields: [
      { key: "featured", label: "Section label" },
      { key: "coreDrop", label: "Section title" },
      { key: "seeAll", label: "See-all link" },
    ],
  },
  {
    id: "marquee",
    title: "Marquee",
    description: "Tokens used in the scrolling ticker.",
    fields: [{ key: "newDrop", label: "Token: new drop" }],
  },
  {
    id: "drops",
    title: "Next drop / countdown",
    description: "The countdown block on the homepage.",
    previewHref: "/",
    fields: [
      { key: "imgDrops", label: "Image", type: "image" },
      { key: "nextDrop", label: "Section label" },
      { key: "dropBody", label: "Body", type: "textarea" },
      { key: "notifyMe", label: "Notify-me CTA" },
      { key: "days", label: "Days unit" },
      { key: "hours", label: "Hours unit" },
      { key: "mins", label: "Mins unit" },
      { key: "secs", label: "Secs unit" },
    ],
  },
  {
    id: "lookbookHome",
    title: "Lookbook (homepage)",
    description: "Horizontal-scroll strip on the homepage with four chapters.",
    previewHref: "/",
    fields: [
      { key: "lookbookLabel", label: "Section label" },
      { key: "chapter", label: '"Chapter" word' },
      { key: "imgLbHome1", label: "Chapter 1 image", type: "image" },
      { key: "lbHomeTitle1", label: "Chapter 1 title" },
      { key: "lbHomeBody1", label: "Chapter 1 body", type: "textarea" },
      { key: "imgLbHome2", label: "Chapter 2 image", type: "image" },
      { key: "lbHomeTitle2", label: "Chapter 2 title" },
      { key: "lbHomeBody2", label: "Chapter 2 body", type: "textarea" },
      { key: "imgLbHome3", label: "Chapter 3 image", type: "image" },
      { key: "lbHomeTitle3", label: "Chapter 3 title" },
      { key: "lbHomeBody3", label: "Chapter 3 body", type: "textarea" },
      { key: "imgLbHome4", label: "Chapter 4 image", type: "image" },
      { key: "lbHomeTitle4", label: "Chapter 4 title" },
      { key: "lbHomeBody4", label: "Chapter 4 body", type: "textarea" },
    ],
  },
  {
    id: "lookbookStory",
    title: "Lookbook page (/lookbook)",
    description: "Chapter sections on /lookbook.",
    previewHref: "/lookbook",
    fields: [
      { key: "lookbookLabelStory", label: "Section label" },
      { key: "storyTitleOne", label: "Title line 1" },
      { key: "storyTitleTwo", label: "Title line 2" },
      { key: "imgLbStory1", label: "Chapter 1 image", type: "image" },
      { key: "storyChapter1H", label: "Chapter 1 heading" },
      { key: "storyChapter1B", label: "Chapter 1 body", type: "textarea" },
      { key: "imgLbStory2", label: "Chapter 2 image", type: "image" },
      { key: "storyChapter2H", label: "Chapter 2 heading" },
      { key: "storyChapter2B", label: "Chapter 2 body", type: "textarea" },
      { key: "imgLbStory3", label: "Chapter 3 image", type: "image" },
      { key: "storyChapter3H", label: "Chapter 3 heading" },
      { key: "storyChapter3B", label: "Chapter 3 body", type: "textarea" },
      { key: "imgLbStory4", label: "Chapter 4 image", type: "image" },
      { key: "storyChapter4H", label: "Chapter 4 heading" },
      { key: "storyChapter4B", label: "Chapter 4 body", type: "textarea" },
    ],
  },
  {
    id: "about",
    title: "About page",
    description: "/about page content.",
    previewHref: "/about",
    fields: [
      { key: "imgAbout", label: "Studio image", type: "image" },
      { key: "studio", label: "Section label" },
      { key: "aboutTitle", label: "Page title" },
      { key: "aboutP1", label: "Paragraph 1", type: "textarea" },
      { key: "aboutP2", label: "Paragraph 2", type: "textarea" },
      { key: "aboutP3", label: "Paragraph 3", type: "textarea" },
      { key: "valueFunctionTitle", label: "Value 01 title" },
      { key: "valueFunctionBody", label: "Value 01 body", type: "textarea" },
      { key: "valueNoLogoTitle", label: "Value 02 title" },
      { key: "valueNoLogoBody", label: "Value 02 body", type: "textarea" },
      { key: "valueBuiltTitle", label: "Value 03 title" },
      { key: "valueBuiltBody", label: "Value 03 body", type: "textarea" },
      { key: "valueRunsTitle", label: "Value 04 title" },
      { key: "valueRunsBody", label: "Value 04 body", type: "textarea" },
    ],
  },
  {
    id: "shop",
    title: "Shop page",
    description: "Header and category labels on /shop.",
    previewHref: "/shop",
    fields: [
      { key: "collection", label: "Section label" },
      { key: "shopTitle", label: "Page title" },
      { key: "shopIntro", label: "Page intro", type: "textarea" },
      { key: "items", label: 'Plural "items"' },
      { key: "item", label: 'Singular "item"' },
      { key: "catAll", label: "Category: all" },
      { key: "catOuterwear", label: "Category: outerwear" },
      { key: "catTops", label: "Category: tops" },
      { key: "catBottoms", label: "Category: bottoms" },
      { key: "catFootwear", label: "Category: footwear" },
      { key: "catAccessories", label: "Category: accessories" },
    ],
  },
  {
    id: "product",
    title: "Product detail",
    description: "Strings shown on /shop/[slug].",
    fields: [{ key: "addToCart", label: "Add-to-cart button" }],
  },
  {
    id: "nav",
    title: "Navigation & Cart",
    description: "Top-bar links and cart drawer labels.",
    fields: [
      { key: "shop", label: "Shop link" },
      { key: "lookbook", label: "Lookbook link" },
      { key: "about", label: "About link" },
      { key: "cart", label: "Cart button" },
      { key: "yourBag", label: "Cart heading" },
      { key: "empty", label: "Empty cart title" },
      { key: "emptyHint", label: "Empty cart subtitle", type: "textarea" },
      { key: "checkout", label: "Checkout button" },
      { key: "close", label: "Close button" },
      { key: "remove", label: "Remove item label" },
      { key: "subtotal", label: "Subtotal label" },
      { key: "demoNoCheckout", label: "Demo notice", type: "textarea" },
    ],
  },
];

export default async function AdminContentPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  await requireAdmin();
  const { lang } = await searchParams;
  const activeLang: LanguageCode =
    (LANGUAGES.find((l) => l.code === lang)?.code as LanguageCode) ?? "en";

  const overrides = await getAllOverrides();
  const overrideMap = overrides[activeLang] ?? {};
  const defaults: Record<string, string> = TRANSLATIONS.en;

  return (
    <ContentEditor
      languages={LANGUAGES.map((l) => ({ code: l.code, label: l.label }))}
      activeLang={activeLang}
      sections={SECTIONS.map((s) => ({
        ...s,
        fields: s.fields.map((f) => ({
          ...f,
          defaultValue: overrideMap[f.key] ?? "",
          fallback: defaults[f.key] ?? "",
        })),
      }))}
      action={saveContent}
    />
  );
}
