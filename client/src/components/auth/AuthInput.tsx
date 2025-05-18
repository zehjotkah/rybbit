"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AuthInputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
}

export function AuthInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  className = "",
}: AuthInputProps) {
  return (
    <div className={`grid gap-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="h-10 transition-all bg-neutral-800/50 border-neutral-700"
      />
    </div>
  );
}
