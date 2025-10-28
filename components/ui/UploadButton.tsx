"use client";

import React from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function DocumentUploader() {
  return (
    <div className="flex flex-col items-center gap-3 p-6 border rounded-xl bg-white shadow-sm">
      <h3 className="font-semibold text-gray-800">Upload Encrypted Document</h3>

      <UploadButton<OurFileRouter, "encryptedUploader">
        endpoint="encryptedUploader"
        onClientUploadComplete={(res) => {
          if (!res || res.length === 0) {
            alert("No file uploaded.");
            return;
          }
          const fileUrl = res[0].url;
          alert("✅ Upload complete! File URL:\n" + fileUrl);
          console.log("Upload result:", res);
        }}
        onUploadError={(error) => {
          console.error("Upload error:", error);
          alert(`❌ Upload failed: ${error.message}`);
        }}
      />
    </div>
  );
}
