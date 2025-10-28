import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  encryptedUploader: f({ blob: { maxFileSize: "16MB" } })
    .onUploadComplete(async ({ file }) => {
      console.log("Uploaded:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
