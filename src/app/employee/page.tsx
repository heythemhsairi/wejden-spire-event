import type { Metadata } from "next";
import { Suspense } from "react";
import { EmployeeSpace } from "./employee-space";

export const metadata: Metadata = {
  title: "Your Wellbeing Space — WejdenSpire",
  description: "A private space to check in, understand how you're doing, and talk it through.",
};

export default function EmployeePage() {
  return (
    <Suspense fallback={null}>
      <EmployeeSpace />
    </Suspense>
  );
}
