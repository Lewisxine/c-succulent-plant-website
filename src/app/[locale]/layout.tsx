import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// The layout reads `params` (URL data) to resolve the locale and load the
// matching messages for the whole tree. This blocks the static shell, so we
// opt the segment out of instant-navigation validation.
export const instant = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </AuthProvider>
    </NextIntlClientProvider>
  );
}
