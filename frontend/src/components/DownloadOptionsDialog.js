import React, { useState } from "react";
import axios from "axios";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { toast } from "sonner";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function DownloadOptionsDialog({
  productId,
  token,
  productTitle,
  className,
  isFree = false,
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadingSize, setDownloadingSize] = useState(null);

  const buttonClass = isFree
    ? "w-full bg-green-600 hover:bg-green-700"
    : className || "w-full";

  const handleDownload = async (size) => {
    setDownloading(true);
    setDownloadingSize(size);

    try {
      const response = await axios.post(
        `${API_URL}/api/downloads/${productId}/download`,
        {
          optionKey: "default",
          size: size,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      // Download the file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${productTitle}_${size}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Download started!");
    } catch (error) {
      console.error("Error downloading:", error);
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloading(false);
      setDownloadingSize(null);
    }
  };

  const sizeOptions = [
    { value: "small", label: "Small", dimensions: "1000 × 667px" },
    { value: "medium", label: "Medium", dimensions: "1500 × 1000px" },
    { value: "large", label: "Large", dimensions: "2000 × 1334px" },
    { value: "original", label: "Original", dimensions: "Full Size" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`${buttonClass} justify-between gap-2`}
          size="lg"
          disabled={downloading}
        >
          <div className="flex items-center">
            <Download className="h-5 w-5 mr-2" strokeWidth={1.5} />
            <span>
              {downloading
                ? "Downloading..."
                : isFree
                  ? "Free Download"
                  : "Download"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4" strokeWidth={2} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
          FILE SIZE
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {sizeOptions.map((size) => (
          <DropdownMenuItem
            key={size.value}
            onClick={() => handleDownload(size.value)}
            disabled={downloading}
            className="cursor-pointer py-3 px-4"
          >
            <div className="flex items-center gap-2 w-full">
              <span className="font-semibold text-base">{size.label}</span>
              <span className="text-muted-foreground">-</span>
              <span className="text-sm text-muted-foreground">
                {size.dimensions}
              </span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
