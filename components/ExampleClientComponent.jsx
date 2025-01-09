"use client";

import { useTranslation } from "react-i18next";

export default function ExampleClientComponent() {
  const { t } = useTranslation();
  return <p>{t("Have")}</p>;
}
