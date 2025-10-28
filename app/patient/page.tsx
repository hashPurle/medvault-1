"use client";

import React, { useState, useEffect } from "react";
import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "../api/uploadthing/core";
import { encryptFile } from "../utils/encryption";
import { db, auth } from "../utils/firebase";
import { addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";

export default function PatientPage() {
  const [user, setUser] = useState<User | null>(null);
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // 🔒 Track Firebase user state once (avoid re-render loop)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // ✅ File encryption + UploadThing upload + Firestore save
  const handleFileUpload = async (file: File) => {
    try {
      setUploading(true);

      // Step 1: Encrypt the file locally
      const { encryptedFile, key, iv } = await encryptFile(file);

      // Step 2: Create a Blob for UploadThing
      const blob = new Blob([encryptedFile], { type: "application/octet-stream" });

      // Step 3: Upload using UploadThing endpoint
      const formData = new FormData();
      formData.append("file", blob, file.name);

      const res = await fetch("/api/uploadthing/encryptedUploader", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const url = data?.url || data?.fileUrl;

      if (!url) throw new Error("Upload failed — no URL returned");

      // Step 4: Save metadata to Firestore
      if (!user) throw new Error("User not authenticated");

      await addDoc(collection(db, "documents"), {
        userId: user.uid,
        fileName: file.name,
        fileUrl: url,
        key,
        iv,
        access: [],
        uploadedAt: new Date(),
      });

      setUploadUrl(url);
      alert("✅ File encrypted and uploaded successfully!");
    } catch (error: any) {
      console.error(error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold text-blue-600 mb-4">Patient Dashboard</h1>

      {!user && (
        <p className="text-red-600">
          Please log in to upload your encrypted medical documents.
        </p>
      )}

      {user && (
        <>
          <div className="border rounded-lg p-6 bg-white dark:bg-gray-800 shadow-md">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
              Upload a document (auto-encrypted)
            </label>
            <input
              type="file"
              className="border border-gray-300 rounded-md p-2 w-full cursor-pointer dark:bg-gray-700 dark:text-gray-200"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) await handleFileUpload(file);
              }}
              disabled={uploading}
            />

            {uploading && (
              <p className="text-gray-500 mt-2">Encrypting and uploading...</p>
            )}
          </div>

          {uploadUrl && (
            <div className="mt-6 bg-green-50 dark:bg-green-900 p-4 rounded-md">
              <p className="text-green-700 dark:text-green-300">
                ✅ File uploaded successfully!
              </p>
              <a
                href={uploadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-words"
              >
                {uploadUrl}
              </a>
            </div>
          )}
        </>
      )}
    </div>
  );
}
