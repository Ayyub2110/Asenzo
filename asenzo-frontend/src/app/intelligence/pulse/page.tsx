import React from "react";
import { redirect } from "next/navigation";

export default function IntelligencePulseRedirect() {
  redirect("/intelligence");
  return null;
}
