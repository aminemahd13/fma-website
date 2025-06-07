import ApiMethods from "./ApiMethods";

export const getSignedURL = (
  filename: string, 
  type: string, 
  size: number, 
  checksum: string
) => {
  const url = 'media/signed-url';
  return ApiMethods.post(url, {
    filename, 
    type, 
    size, 
    checksum,
  });
}

export const uploadFile = async (url: string, file: File) => {
  console.log(`Starting S3 upload for file: ${file.name}, size: ${file.size} bytes`);

  try {
    const res = await fetch(url, {
      method: 'PUT',
      body: file,
      mode: 'cors',
      headers: {
        "Content-Type": file.type
      }
    });
    
    console.log(`S3 upload response - Status: ${res.status}, StatusText: ${res.statusText}`);
    
    // CRITICAL: Strict validation - only 2xx status codes are success
    if (res.status >= 200 && res.status < 300) {
      console.log(`✅ S3 upload SUCCESS - File: ${file.name}, Status: ${res.status}`);
      return { 
        url: res.url, 
        statusCode: res.status, 
        success: true,
        timestamp: new Date().toISOString()
      };
    } else {
      console.error(`❌ S3 upload FAILED - File: ${file.name}, Status: ${res.status}, StatusText: ${res.statusText}`);
      throw new Error(`S3 upload failed with status: ${res.status} (${res.statusText})`);
    }
  } catch (error: any) {
    console.error(`❌ S3 upload NETWORK ERROR - File: ${file.name}, Error:`, error);
    throw new Error(`S3 upload network error: ${error.message}`);
  }
}