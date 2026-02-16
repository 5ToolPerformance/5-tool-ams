import { removeDrillFile } from "@/application/drills/removeDrillFile";
import { removeDrillFile as removeDrillFileQuery } from "@/db/queries/drills/removeDrillFile";

const deleteFileMock = jest.fn();

jest.mock("@/application/storage/azureBlobStorage", () => ({
  AzureBlobStorage: jest.fn().mockImplementation(() => ({
    deleteFile: deleteFileMock,
  })),
}));

jest.mock("@/db/queries/drills/removeDrillFile", () => ({
  removeDrillFile: jest.fn(),
}));

describe("removeDrillFile", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deletes blob when file becomes orphaned", async () => {
    (removeDrillFileQuery as jest.Mock).mockResolvedValue({
      removed: true,
      deletedFile: true,
      deletedStorageKey: "drills/facility/f1/drill/d1/file-1.mp4",
    });

    const result = await removeDrillFile("d1", "file-1");

    expect(result.removed).toBe(true);
    expect(deleteFileMock).toHaveBeenCalledWith(
      "drills/facility/f1/drill/d1/file-1.mp4"
    );
  });

  it("does not delete blob when file is still linked elsewhere", async () => {
    (removeDrillFileQuery as jest.Mock).mockResolvedValue({
      removed: true,
      deletedFile: false,
      deletedStorageKey: null,
    });

    await removeDrillFile("d1", "file-1");

    expect(deleteFileMock).not.toHaveBeenCalled();
  });
});
