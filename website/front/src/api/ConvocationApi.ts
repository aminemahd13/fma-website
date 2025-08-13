import { getToken } from "@/lib/utils";

export const downloadConvocation = async () => {
  const url = process.env.NEXT_PUBLIC_API_ENDPOINT + 'convocation/download';
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to download convocation');
  }

  const blob = await response.blob();
  return {
    status: response.status,
    data: blob
  };
}
