import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from "@/components/shared/table";
import Link from "next/link";
import { FileIcon } from "@/components/shared/icons";
import FileStatus from "./file-status";

const FileCard = ({
  href,
}:{
  href: string,
}) => {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${href}`;

  return (
    <Link
      href={url}
      target='_blank'
    >
      <div 
        className='w-[6rem] h-[6rem] rounded-xl border flex flex-col justify-center items-center space-y-2 cursor-pointer hover:bg-gray-100'
      >
        <FileIcon />
      </div>
    </Link>
  )
}

const FilesTable = ({
  application
}:{
  application: any
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>File</TableHead>
          <TableHead>Link</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TableRow key='parent-id'>
          <TableCell>Parent ID</TableCell>
          <TableCell><FileCard href={application?.parentIdUrl} /></TableCell>
          <TableCell><FileStatus slug='parentId' application={application} /></TableCell>
        </TableRow>

        <TableRow key='birth-certificate'>
          <TableCell>Birth Certificate</TableCell>
          <TableCell><FileCard href={application?.birthCertificateUrl} /></TableCell>
          <TableCell><FileStatus slug='birthCertificate' application={application} /></TableCell>
        </TableRow>

        <TableRow key='school-certificate'>
          <TableCell>School Certificate</TableCell>
          <TableCell><FileCard href={application?.schoolCertificateUrl} /></TableCell>
          <TableCell><FileStatus slug='schoolCertificate' application={application} /></TableCell>
        </TableRow>

        <TableRow key='grades'>
          <TableCell>Grades</TableCell>
          <TableCell><FileCard href={application?.gradesUrl} /></TableCell>
          <TableCell><FileStatus slug='grades' application={application} /></TableCell>
        </TableRow>

        <TableRow key='regulations'>
          <TableCell>Regulations</TableCell>
          <TableCell><FileCard href={application?.regulationsUrl} /></TableCell>
          <TableCell><FileStatus slug='regulations' application={application} /></TableCell>
        </TableRow>

        <TableRow key='parental-authorization'>
          <TableCell>Parental Authorization</TableCell>
          <TableCell><FileCard href={application?.parentalAuthorizationUrl} /></TableCell>
          <TableCell><FileStatus slug='parentalAuthorization' application={application} /></TableCell>
        </TableRow>

        <TableRow key='image-rights'>
          <TableCell>Image Rights</TableCell>
          <TableCell><FileCard href={application?.imageRightsUrl} /></TableCell>
          <TableCell><FileStatus slug='imageRights' application={application} /></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default FilesTable
