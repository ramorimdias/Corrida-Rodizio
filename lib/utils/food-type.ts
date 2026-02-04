import { type FoodType } from "@/types/database";
import { type Language } from "@/lib/i18n/translations";

const foodTypeLabels: Record<Language, Record<FoodType, string>> = {
  pt: {
    pizza: "Pizza",
    sushi: "Rodízio Japa",
    burger: "Burger",
    drinks: "Bebida",
  },
  en: {
    pizza: "Pizza",
    sushi: "Sushi",
    burger: "Burger",
    drinks: "Drinks",
  },
  es: {
    pizza: "Pizza",
    sushi: "Sushi",
    burger: "Burger",
    drinks: "Bebidas",
  },
  fr: {
    pizza: "Pizza",
    sushi: "Sushi",
    burger: "Burger",
    drinks: "Boissons",
  },
};

const foodTypeUnits: Record<Language, Record<FoodType, [string, string]>> = {
  pt: {
    pizza: ["pedaço", "pedaços"],
    sushi: ["peça", "peças"],
    burger: ["burger", "burgers"],
    drinks: ["dose", "doses"],
  },
  en: {
    pizza: ["slice", "slices"],
    sushi: ["piece", "pieces"],
    burger: ["burger", "burgers"],
    drinks: ["drink", "drinks"],
  },
  es: {
    pizza: ["porción", "porciones"],
    sushi: ["pieza", "piezas"],
    burger: ["hamburguesa", "hamburguesas"],
    drinks: ["trago", "tragos"],
  },
  fr: {
    pizza: ["part", "parts"],
    sushi: ["pièce", "pièces"],
    burger: ["burger", "burgers"],
    drinks: ["boisson", "boissons"],
  },
};

export const getFoodTypeLabel = (foodType: FoodType, language: Language) => {
  const labels = foodTypeLabels[language] ?? foodTypeLabels.pt;
  return labels[foodType];
};

export const getFoodTypeUnit = (
  foodType: FoodType,
  language: Language,
  count: number,
) => {
  const units = foodTypeUnits[language] ?? foodTypeUnits.pt;
  const [singular, plural] = units[foodType];
  return count === 1 ? singular : plural;
};
