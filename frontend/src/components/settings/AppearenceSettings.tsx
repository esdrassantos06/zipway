"use client";

import { ChevronDown, Palette } from "lucide-react";
import React, { useState } from "react";
import { Label } from "../ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

export const AppearenceSettings = () => {
  const { setTheme } = useTheme();
  const [language, setLanguage] = useState("Choose Language");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="size-5 text-blue-600" />
          Appearance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative" size="default">
                <span className="dark:hidden">Light Mode</span>
                <span className="hidden dark:flex">Dark Mode</span>
                <ChevronDown size={20} />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-2">
          <Label>Language</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="relative" size="default">
                <span>{language}</span>
                <ChevronDown size={20} />
                <span className="sr-only">Toggle language menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setLanguage("Portuguese")}>
                Portuguese
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLanguage("English")}>
                English
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setLanguage("Español")}>
                Español
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
