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
  return new Promise((resolve, reject) => {
    // Add timeout to prevent infinite hanging
    const timeoutId = setTimeout(() => {
      console.error('S3 upload timeout - file may be too large or connection is slow');
      reject(new Error('Upload timeout - request took longer than 60 seconds'));
    }, 60000); // 60 second timeout

    console.log(`Starting S3 upload for file: ${file.name}, size: ${file.size} bytes`);

    fetch(url, {
      method: 'PUT',
      body: file,
      mode: 'cors',
      headers: {
        "Content-Type": file.type
      }
    })
      .then(res => {
        clearTimeout(timeoutId);
        
        console.log(`S3 upload response - Status: ${res.status}, StatusText: ${res.statusText}`);
        
        // CRITICAL: Strict validation - only 2xx status codes are success
        if (res.status >= 200 && res.status < 300) {
          console.log(`✅ S3 upload SUCCESS - File: ${file.name}, Status: ${res.status}`);
          resolve({ 
            url: res.url, 
            statusCode: res.status, 
            success: true,
            timestamp: new Date().toISOString()
          });
        } else {
          console.error(`❌ S3 upload FAILED - File: ${file.name}, Status: ${res.status}, StatusText: ${res.statusText}`);
          reject(new Error(`S3 upload failed with status: ${res.status} (${res.statusText})`));
        }
      })
      .catch(error => {
        clearTimeout(timeoutId);
        console.error(`❌ S3 upload NETWORK ERROR - File: ${file.name}, Error:`, error);
        reject(new Error(`S3 upload network error: ${error.message}`));
      });
  }) 
}