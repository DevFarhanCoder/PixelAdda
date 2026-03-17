import React, { useState, useEffect } from "react";
import axios from "axios";
import { Download, Check } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";

const API_URL = process.env.REACT_APP_BACKEND_URL;

export function DownloadOptionsDialog({
  productId,
  token,
  productTitle,
  className,
  isFree = false,
}) {
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedSize, setSelectedSize] = useState("original");
  const [downloading, setDownloading] = useState(false);
  const [open, setOpen] = useState(false);

  const buttonClass = isFree
    ? "w-full bg-green-600 hover:bg-green-700"
    : className || "w-full";

  useEffect(() => {
    if (open) {
      fetchDownloadOptions();
    }
  }, [open]);

  const fetchDownloadOptions = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/api/downloads/${productId}/options`,
      );
      setOptions(response.data.options || []);
      if (response.data.options && response.data.options.length > 0) {
        setSelectedOption(
          response.data.options[0].key || response.data.options[0].type,
        );
      }
    } catch (error) {
      console.error("Error fetching download options:", error);
    }
  };

  const handleDownload = async () => {
    if (!selectedOption) return;

    setDownloading(true);
    try {
      const response = await axios.post(
        `${API_URL}/api/downloads/${productId}/download`,
        {
          optionKey: selectedOption,
          size: selectedSize,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        },
      );

      // Download the ZIP file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${productTitle}_${selectedSize}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch (error) {
      console.error("Error downloading:", error);
      alert("Error downloading file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const sizeOptions = [
    { value: "small", label: "Small - 714 × 1000px" },
    { value: "medium", label: "Medium - 1071 × 1500px" },
    { value: "large", label: "Large - 1428 × 2000px" },
    { value: "original", label: "Original Size" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={buttonClass} size="lg">
          <Download className="h-5 w-5 mr-2" strokeWidth={1.5} />
          {isFree ? "Free Download" : "Download Files"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Download Options</DialogTitle>
          <DialogDescription>
            Choose your preferred format and size
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="format">File Format</Label>
            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger id="format">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem
                    key={option.key || `option-${index}`}
                    value={option.key || option.type}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Image Size</Label>
            <Select value={selectedSize} onValueChange={setSelectedSize}>
              <SelectTrigger id="size">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sizeOptions.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleDownload}
            disabled={downloading || !selectedOption}
            className="w-full"
          >
            {downloading ? (
              "Preparing Download..."
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
