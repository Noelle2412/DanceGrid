import { Suspense } from "react";
import ChoreoEditor from "@/components/canvas/ChoreoEditor";

export default function NewChoreoPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-muted-foreground">Loading editor...</div>
      }>
      <ChoreoEditor />
    </Suspense>
  );
}
