import { Suspense } from "react";
import PeminjamanClient from "./PeminjamanClient"; // langsung import biasa

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PeminjamanClient />
    </Suspense>
  );
}
