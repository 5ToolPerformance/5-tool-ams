import {
  assertAllowedAttachmentFile,
  assertAllowedDrillFile,
  buildDrillStorageKey,
} from "../fileUploadPolicy";

describe("fileUploadPolicy", () => {
  it("allows known attachment MIME and extension pairs", () => {
    expect(
      assertAllowedAttachmentFile("file_pdf", {
        originalFileName: "evaluation.pdf",
        mimeType: "application/pdf",
        size: 1024,
      })
    ).toBe("pdf");
  });

  it("rejects mismatched attachment extensions", () => {
    expect(() =>
      assertAllowedAttachmentFile("file_pdf", {
        originalFileName: "evaluation.exe",
        mimeType: "application/pdf",
        size: 1024,
      })
    ).toThrow("File extension is not allowed");
  });

  it("uses facility and drill scoped storage keys for drill uploads", () => {
    const extension = assertAllowedDrillFile({
      originalFileName: "swing.mp4",
      mimeType: "video/mp4",
      size: 1024,
    });

    expect(
      buildDrillStorageKey({
        facilityId: "facility-1",
        drillId: "drill-1",
        fileId: "file-1",
        extension,
      })
    ).toBe("drills/facility/facility-1/drill/drill-1/file-1.mp4");
  });
});
