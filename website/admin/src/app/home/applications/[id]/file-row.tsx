import {
  TableRow,
  TableCell
} from "@/components/shared/table";
import { FileStatus } from "./file-status";
import Link from "next/link";
import { FileIcon } from "@/components/shared/icons";
import { useState, useEffect } from "react";
import { getToken } from '@/lib/utils';

const FileCard = ({
  href,
}:{
  href: string,
}) => {
  const [presignedUrl, setPresignedUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Create a function to get presigned URL
    const getFileUrl = async () => {
      if (!href) {
        console.log("No href provided for FileCard");
        setError("No file path provided");
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        console.log("Getting presigned URL for:", href);
        
        // Call your API endpoint to get a presigned URL
        const response = await fetch('/api/media/get-presigned-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ key: href }),
        });
        
        const data = await response.json();
        console.log("Presigned URL response:", data);
        
        if (data.url) {
          setPresignedUrl(data.url);
        } else {
          setError("Failed to get file URL");
          console.error("No URL in response:", data);
        }
      } catch (error) {
        setError("Error retrieving file");
        console.error("Error getting presigned URL:", error);
      } finally {
        setLoading(false);
      }
    };

    getFileUrl();
  }, [href]);

  return (
    <Link
      href={presignedUrl || "#"}
      target='_blank'
      className={loading || !presignedUrl ? "pointer-events-none opacity-50" : ""}
    >
      <div 
        className='w-[6rem] h-[6rem] rounded-xl border flex flex-col justify-center items-center space-y-2 cursor-pointer hover:bg-gray-100'
      >
        {loading ? (
          <span className="animate-pulse">Loading...</span>
        ) : error ? (
          <span className="text-xs text-red-500 text-center px-1">{error}</span>
        ) : (
          <FileIcon />
        )}
      </div>
    </Link>
  )
}

const FileRow = ({
  key,
  fileName,
  fileUrl,
  fileStatus,
}:{
  key: string,
  fileName: string
  fileUrl: string,
  fileStatus: FileStatus,
}) => {
  return (
    <TableRow key={key}>
      <TableCell>{fileName}</TableCell>
      <TableCell><FileCard href={fileUrl} /></TableCell>
      <TableCell>{fileStatus}</TableCell>
    </TableRow>
  )
}

export default FileRow
