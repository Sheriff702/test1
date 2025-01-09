import ExampleClientComponent from "@/components/ExampleClientComponent";
import initTranslations from "../i18n";
import TranslationsProvider from "@/components/TranslationsProvider";

export default async function Home({ params: { locale } }) {
  const { t } = await initTranslations(locale, ["Test"]);
  return (
    <TranslationsProvider locale={locale} namespaces={["Test"]}>
      <main className="h-[100vh]  w-100% flex flex-col text-8xl justify-center items-center bg-gradient-to-t from-slate-400 to-slate-600">
        <h1 className="text-red-500 ">{t("Welcome")}</h1>
        <ExampleClientComponent />
      </main>
    </TranslationsProvider>
  );
}
