
import React from "react";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  width?: string;
  collapsedWidth?: string;
}

export function Sidebar({
  className,
  children,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  width = "w-60", // Changed from w-64 to w-60
  collapsedWidth = "w-14",
  ...props
}: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background",
        collapsed ? collapsedWidth : width,
        "transition-width duration-300",
        className
      )}
      {...props}
    >
      <div className="flex flex-col flex-1 overflow-hidden">
        {collapsible && (
          <div className="flex justify-end p-2">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-accent"
            >
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-transform",
                  collapsed ? "" : "rotate-180"
                )}
              />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-auto">{children}</div>
        {footer && (
          <div className="mt-auto border-t p-4 overflow-hidden">{footer}</div>
        )}
      </div>
    </div>
  );
}
