import { uploadDrillFile } from "@/application/drills/uploadDrillFile";
import { createDrillFileLink } from "@/db/queries/drills/createDrillFileLink";

const uploadFileMock = jest.fn();
const deleteFileMock = jest.fn();

jest.mock("uuid", () => ({
  v4: () => "file-uuid",
}));

jest.mock("@/application/storage/azureBlobStorage", () => ({
  AzureBlobStorage: jest.fn().mockImplementation(() => ({
    uploadFile: uploadFileMock,
    deleteFile: deleteFileMock,
  })),
}));

jest.mock("@/db/queries/drills/createDrillFileLink", () => ({
  createDrillFileLink: jest.fn(),
}));

describe("uploadDrillFile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects files over 500MB", async () => {
    await expect(
      uploadDrillFile({
        drillId: "drill-1",
        facilityId: "facility-1",
        uploadedBy: "coach-1",
        file: {
          buffer: Buffer.from("x"),
          originalFileName: "video.mp4",
          mimeType: "video/mp4",
          size: 500 * 1024 * 1024 + 1,
        },
      })
    ).rejects.toThrow("File too large");
  });

  it("rejects unsupported mime types", async () => {
    await expect(
      uploadDrillFile({
        drillId: "drill-1",
        facilityId: "facility-1",
        uploadedBy: "coach-1",
        file: {
          buffer: Buffer.from("x"),
          originalFileName: "notes.txt",
          mimeType: "text/plain",
          size: 100,
        },
      })
    ).rejects.toThrow("Only image and video files are allowed");
  });

  it("uploads and links valid media", async () => {
    (createDrillFileLink as jest.Mock).mockResolvedValue({
      id: "file-uuid",
      originalName: "clip.mp4",
      mimeType: "video/mp4",
      size: 1024,
      storageKey: "drills/facility/facility-1/drill/drill-1/file-uuid.mp4",
      createdOn: new Date("2026-02-16T00:00:00.000Z"),
    });

    const media = await uploadDrillFile({
      drillId: "drill-1",
      facilityId: "facility-1",
      uploadedBy: "coach-1",
      file: {
        buffer: Buffer.from("video"),
        originalFileName: "clip.mp4",
        mimeType: "video/mp4",
        size: 1024,
      },
    });

    expect(uploadFileMock).toHaveBeenCalledTimes(1);
    expect(createDrillFileLink).toHaveBeenCalledWith({
      drillId: "drill-1",
      fileId: "file-uuid",
      storageKey: "drills/facility/facility-1/drill/drill-1/file-uuid.mp4",
      originalName: "clip.mp4",
      mimeType: "video/mp4",
      size: 1024,
      uploadedBy: "coach-1",
    });
    expect(media.fileId).toBe("file-uuid");
  });
});
