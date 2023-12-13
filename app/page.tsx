"use client";
import React from "react";
import SyncSearch from "@/components/Search/SyncSearch";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        SearchSwift
      </div>

      <div>
        <SyncSearch />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        THREE
      </div>
    </main>
  );
}
