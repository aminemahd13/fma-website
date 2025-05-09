"use client"

import { ColumnDef } from '@tanstack/react-table'
import ApplicationStatus from './application-status'
import { Button } from '@/components/shared/button'
import { useRouter } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export type ApplicationRow = {
  id: string
  firstName: string,
  lastName: string,
  email: string,
  dateOfBirth: string,
  city: string,
  highschool: string,
  status: string,
  // Add full application object for advanced filtering
  application?: any
}

const ActionButton = ({
  applicationId,
}:{
  applicationId: string,
}) => {
  const router = useRouter()

  return (
    <Button onClick={() => router.push(`/home/applications/${applicationId}`)}>Show Details</Button>
  )
}

export const columns: ColumnDef<ApplicationRow>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "dateOfBirth",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date of Birth
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => formatDate(row.getValue('dateOfBirth')),
  },
  {
    accessorKey: "city",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          City
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "highschool",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Highschool
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const applicatonId = parseFloat(row.getValue("id"));
      const status = row.getValue("status") as string;
      
      return <ApplicationStatus applicationId={applicatonId} status={status} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    // Hidden column for advanced filtering
    accessorKey: "advancedFilter",
    enableHiding: true,
    header: "Advanced Filter",
    filterFn: (row, id, value: string[]) => {
      if (!value?.length) return true;
      
      const application = row.original.application;
      if (!application) return false;

      return value.some(filterValue => {
        switch (filterValue) {
          case "ACCEPTED_NO_DOCUMENTS":
            return application.status?.status === 'ACCEPTED' && 
              (!application.parentIdUrl || 
               !application.birthCertificateUrl || 
               !application.regulationsUrl || 
               !application.parentalAuthorizationUrl || 
               !application.imageRightsUrl);
            
          case "DOCUMENTS_PENDING_VALIDATION":
            return application.status?.status === 'ACCEPTED' && 
              ((application.parentIdUrl && application.status?.parentIdStatus === 'PENDING') ||
               (application.birthCertificateUrl && application.status?.birthCertificateStatus === 'PENDING') ||
               (application.regulationsUrl && application.status?.regulationsStatus === 'PENDING') ||
               (application.parentalAuthorizationUrl && application.status?.parentalAuthorizationStatus === 'PENDING') ||
               (application.imageRightsUrl && application.status?.imageRightsStatus === 'PENDING'));

          case "MISSING_PARENT_ID":
            return application.status?.status === 'ACCEPTED' && !application.parentIdUrl;

          case "MISSING_BIRTH_CERTIFICATE":
            return application.status?.status === 'ACCEPTED' && !application.birthCertificateUrl;

          case "MISSING_REGULATIONS":
            return application.status?.status === 'ACCEPTED' && !application.regulationsUrl;

          case "MISSING_PARENTAL_AUTH":
            return application.status?.status === 'ACCEPTED' && !application.parentalAuthorizationUrl;

          case "MISSING_IMAGE_RIGHTS":
            return application.status?.status === 'ACCEPTED' && !application.imageRightsUrl;

          case "MISSING_REPORT":
            return application.status?.status === 'ACCEPTED' && !application.reportUrl;

          default:
            return false;
        }
      });
    },
  },
  {
    id: "actionButton",
    cell: ({ row }) => {
      const applicationId = row.original?.id;
 
      return <div className='flex justify-end'>
        <ActionButton applicationId={applicationId} />
      </div>
    }
  },
]
