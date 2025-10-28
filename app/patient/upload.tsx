"use client";

import { UploadButton } from "@uploadthing/react";
import type { ourFileRouter } from "../api/uploadthing/core";

export default function UploadDocument() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-lg font-semibold">Upload Patient Document</h2>

      <UploadButton<ourFileRouter>
        endpoint="documentUploader"
        onUploadBegin={() => console.log("Uploading started...")}
        onClientUploadComplete={(res) => {
          if (res && res[0]?.url) {
            alert(`✅ Upload successful! File URL: ${res[0].url}`);
          }
        }}
        onUploadError={(error: Error) => {
          alert(`❌ Upload error: ${error.message}`);
        }}
      />
    </div>
  );
}
