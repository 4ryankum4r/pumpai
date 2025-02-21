import api from "../lib/axios";
import {
  UploadToPumpFunIPFSResponse,
  PumpFunMetadata,
} from "../types/api/ipfs";

export const ipfsClient = {
  uploadToPumpFun: async (
    file: File,
    metadata: PumpFunMetadata
  ): Promise<UploadToPumpFunIPFSResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", metadata.name);
    formData.append("symbol", metadata.symbol);
    formData.append("description", metadata.description);

    if (metadata.twitter) formData.append("twitter", metadata.twitter);
    if (metadata.telegram) formData.append("telegram", metadata.telegram);
    if (metadata.website) formData.append("website", metadata.website);

    const { data } = await api.post<UploadToPumpFunIPFSResponse>(
      "/api/ipfs/upload-pumpfun",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data;
  },
};
