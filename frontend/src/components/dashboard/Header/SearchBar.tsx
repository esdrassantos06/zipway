"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export function SearchBar() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
      <Input
        type="search"
        placeholder="Search links..."
        className="w-[300px] pl-8"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
}
