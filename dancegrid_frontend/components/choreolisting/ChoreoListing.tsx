"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getUsersChoreos, getSharedWithChoreos } from "@/api/users";

interface ChoreoItem {
  _id: string;
  name: string;
  mode: string;
  gridSize: [number, number];
  updatedAt?: string;
  createdAt?: string;
}

const ChoreoListing = () => {
  const params = useParams();
  const userId = params?.id as string | undefined;

  const [myChoreos, setMyChoreos] = useState<ChoreoItem[]>([]);
  const [sharedChoreos, setSharedChoreos] = useState<ChoreoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchChoreos = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [myChoreos, sharedChoreos] = await Promise.all([
          getUsersChoreos(userId),
          getSharedWithChoreos(userId),
        ]);

        setMyChoreos(myChoreos);
        setSharedChoreos(sharedChoreos);
      } catch (err: any) {
        console.error("Failed to load choreographies:", err);
        setError(
          err?.response?.data?.message ||
            err.message ||
            "Failed to load choreographies",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchChoreos();
  }, [userId]);

  const renderChoreoCard = (choreo: ChoreoItem) => {
    const choreoId = choreo._id;
    const modeLabel = choreo.mode[0].toLocaleUpperCase() + choreo.mode.slice(1);

    return (
      <Link
        key={choreoId}
        href={`/choreos/${choreoId}`}
        className="flex flex-col justify-between p-4 rounded-xl border border-border bg-card hover:border-accent hover:shadow-md transition-all group">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-accent transition-colors line-clamp-1">
            {choreo.name || "Untitled Choreography"}
          </h3>
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            Mode: {modeLabel}
          </p>
          {choreo.gridSize && (
            <p className="text-xs text-muted-foreground">
              Floor: {choreo.gridSize[0]} × {choreo.gridSize[1]}
            </p>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between text-xs text-accent font-medium">
          <span>Open editor</span>
          <span>→</span>
        </div>
      </Link>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 text-muted-foreground">
        Loading choreographies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-950/20 rounded-md my-4">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto py-4">
      {/* My Choreographies Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Choreographies</h2>
          <Link
            href="/choreos"
            className="bg-accent text-white px-3 py-1.5 rounded-md text-sm hover:opacity-90 transition-opacity">
            + New Choreography
          </Link>
        </div>

        {myChoreos.length === 0 ? (
          <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            You haven&apos;t created any choreographies yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {myChoreos.map(renderChoreoCard)}
          </div>
        )}
      </section>

      {/* Shared With Me Section */}
      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold">Shared With Me</h2>

        {sharedChoreos.length === 0 ? (
          <div className="p-6 border border-dashed rounded-lg text-center text-muted-foreground">
            No choreographies have been shared with you yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sharedChoreos.map(renderChoreoCard)}
          </div>
        )}
      </section>
    </div>
  );
};

export default ChoreoListing;
