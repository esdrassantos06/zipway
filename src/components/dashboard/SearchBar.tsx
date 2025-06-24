"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Link } from "@/generated/prisma";
import { usePathname } from "next/navigation";

interface SearchBarProps {
  userId: string;
  onSearchResults: (links: Link[] | null) => void;
}

export default function SearchBar({ userId, onSearchResults }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      onSearchResults(null);
      return;
    }

    let isCancelled = false;

    const fetchLinks = async () => {
      try {
        const res = await fetch(
          `/api/user-links/search?userId=${userId}&q=${encodeURIComponent(debouncedSearchTerm)}`,
        );

        if (!res.ok) throw new Error("Error in request");

        const data = await res.json();

        if (!isCancelled) {
          onSearchResults(data);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error(err);
          onSearchResults([]);
        }
      }
    };

    fetchLinks();

    return () => {
      isCancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm, userId]);

  const pathname = usePathname();

  if (pathname !== "/dashboard/links") return null;

  return (
    <div className="relative mb-2 w-full">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
      <Input
        type="search"
        placeholder="Search links..."
        className="w-full pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
