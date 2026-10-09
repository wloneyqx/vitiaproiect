"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Locale = "ro" | "ru" | "en";

export const languages: { code: Locale; short: string; label: string; flag: string }[] = [
  { code: "ro", short: "RO", label: "Romana", flag: "🇷🇴" },
  { code: "ru", short: "RU", label: "Русский", flag: "🇷🇺" },
  { code: "en", short: "EN", label: "English", flag: "🇬🇧" },
];

const dictionary = {
  ro: {
    home: "Acasa",
    catalog: "Catalog",
    products: "Produse",
    promo: "Produse promotionale",
    reviews: "Recenzii",
    contact: "Contact",
    bag: "Bag",
    menu: "Meniu",
    heroTitle: "Momente care raman.",
    heroCopy: "Portrete si printuri personalizate create din fotografiile tale.",
    heroNote: "Canvas, metal, ata, fotografii si printuri realizate cu atentie de studio.",
    discover: "Descopera colectia",
    productIntro: "Categorii",
    explore: "Exploreaza",
    allProducts: "Toate produsele",
    showcase: "Showcase automat",
    showcaseCopy: "Produse personalizate din toate categoriile, gandite pentru amintiri vizibile in casa.",
    from: "de la",
    lei: "lei",
    chooseSize: "Marime",
    quantity: "Cantitate",
    uploadPhoto: "Incarca fotografia",
    uploadHint: "JPG / PNG / WEBP / HEIC",
    photoReady: "Fotografie incarcata.",
    note: "Note pentru artist",
    addToBag: "Adauga in cos",
    viewCart: "Vezi cosul",
    sizeStandard: "Standard 50 x 50 cm",
    oldPrice: "pret vechi",
    newPrice: "pret nou",
    emptyPromo: "Momentan nu exista produse reduse.",
  },
  ru: {
    home: "Главная",
    catalog: "Каталог",
    products: "Товары",
    promo: "Акционные товары",
    reviews: "Отзывы",
    contact: "Контакты",
    bag: "Корзина",
    menu: "Меню",
    heroTitle: "Моменты, которые остаются.",
    heroCopy: "Персональные портреты и принты, созданные по вашим фотографиям.",
    heroNote: "Холст, металл, нити, фотографии и принты с вниманием студии.",
    discover: "Открыть коллекцию",
    productIntro: "Категории",
    explore: "Смотреть",
    allProducts: "Все товары",
    showcase: "Автоматическая витрина",
    showcaseCopy: "Персональные изделия из всех категорий для воспоминаний, которые живут дома.",
    from: "от",
    lei: "лей",
    chooseSize: "Размер",
    quantity: "Количество",
    uploadPhoto: "Загрузить фото",
    uploadHint: "JPG / PNG / WEBP / HEIC",
    photoReady: "Фото загружено.",
    note: "Заметки для мастера",
    addToBag: "Добавить в корзину",
    viewCart: "Перейти в корзину",
    sizeStandard: "Стандарт 50 x 50 см",
    oldPrice: "старая цена",
    newPrice: "новая цена",
    emptyPromo: "Сейчас нет товаров со скидкой.",
  },
  en: {
    home: "Home",
    catalog: "Catalog",
    products: "Products",
    promo: "Promotional products",
    reviews: "Reviews",
    contact: "Contact",
    bag: "Bag",
    menu: "Menu",
    heroTitle: "Moments that stay.",
    heroCopy: "Personalized portraits and prints created from your photographs.",
    heroNote: "Canvas, metal, thread, photographs, and prints finished with studio care.",
    discover: "Discover collection",
    productIntro: "Categories",
    explore: "Explore",
    allProducts: "All products",
    showcase: "Automatic showcase",
    showcaseCopy: "Personalized pieces across every category, made for memories you can live with.",
    from: "from",
    lei: "lei",
    chooseSize: "Size",
    quantity: "Quantity",
    uploadPhoto: "Upload photo",
    uploadHint: "JPG / PNG / WEBP / HEIC",
    photoReady: "Photo uploaded.",
    note: "Notes for the artist",
    addToBag: "Add to bag",
    viewCart: "View cart",
    sizeStandard: "Standard 50 x 50 cm",
    oldPrice: "old price",
    newPrice: "new price",
    emptyPromo: "There are no sale products right now.",
  },
} as const;

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof typeof dictionary.ro) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === "undefined") return "ro";
    const stored = window.localStorage.getItem("svidanie_art:locale") as Locale | null;
    return stored && ["ro", "ru", "en"].includes(stored) ? stored : "ro";
  });

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("svidanie_art:locale", next);
    document.documentElement.lang = next;
  };

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => dictionary[locale][key] ?? dictionary.ro[key],
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function localizeCategory(material: string, locale: Locale) {
  const labels = {
    canvas: { ro: "Portret pe panza", ru: "Портрет на холсте", en: "Canvas portrait" },
    metal: { ro: "Portret pe metal", ru: "Портрет на метале", en: "Metal portrait" },
    string: { ro: "Portret din ata", ru: "Портрет из нитей", en: "Thread portrait" },
    promo: { ro: "Produse promotionale", ru: "Акционные товары", en: "Promotional products" },
  } as const;
  return labels[material as keyof typeof labels]?.[locale] ?? material;
}
