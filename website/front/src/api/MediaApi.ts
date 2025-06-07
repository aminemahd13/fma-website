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
    const response = await fetch(url, {
      method: 'PUT',
      body: file,
      mode: 'cors',
      headers: {
        "Content-Type": file.type
      }
    });
    
    console.log(`S3 upload response - Status: ${response.status}, StatusText: ${response.statusText}`);
    
    // CRITICAL: Strict validation - only 2xx status codes are success
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ S3 upload SUCCESS - File: ${file.name}, Status: ${response.status}`);
      return { 
        url: response.url, 
        statusCode: response.status, 
        success: true,
        timestamp: new Date().toISOString()
      };
    } else {
      console.error(`❌ S3 upload FAILED - File: ${file.name}, Status: ${response.status}, StatusText: ${response.statusText}`);
      throw new Error(`S3 upload failed with status: ${response.status} (${response.statusText})`);
    }
  } catch (error: any) {
    console.error(`❌ S3 upload NETWORK ERROR - File: ${file.name}, Error:`, error);
    throw new Error(`S3 upload network error: ${error.message}`);
  }
}