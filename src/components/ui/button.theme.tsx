"use client";
import { Button } from "./button";
import { useEffect } from "react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { Sun } from "lucide-react";
import { Moon } from "lucide-react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <Button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      size="icon"
      variant="outline"
      className="rounded-md p-2 hover:bg-accent"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  ); 
}