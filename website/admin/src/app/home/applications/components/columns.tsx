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
  phoneNumber: string,
  dateOfBirth: string,
  city: string,
  highschool: string,
  status: string,
  // Add derived fields for admin features
  documentProgress: number,
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical',
  lastActivity: string,
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
    // Global filter column for search functionality
    accessorKey: "globalFilter",
    enableHiding: true,
    header: "Global Filter",
    filterFn: (row, id, value: string) => {
      if (!value) return true;
      
      const searchTerm = value.toLowerCase();
      const firstName = (row.getValue("firstName") as string)?.toLowerCase() || "";
      const lastName = (row.getValue("lastName") as string)?.toLowerCase() || "";
      const email = (row.getValue("email") as string)?.toLowerCase() || "";
      const phoneNumber = (row.getValue("phoneNumber") as string)?.toLowerCase() || "";
      const city = (row.getValue("city") as string)?.toLowerCase() || "";
      const highschool = (row.getValue("highschool") as string)?.toLowerCase() || "";
      
      return firstName.includes(searchTerm) ||
             lastName.includes(searchTerm) ||
             email.includes(searchTerm) ||
             phoneNumber.includes(searchTerm) ||
             city.includes(searchTerm) ||
             highschool.includes(searchTerm);
    },
  },
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
    accessorKey: "phoneNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
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
    accessorKey: "documentProgress",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doc Progress
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const progress = row.getValue("documentProgress") as number;
      const application = row.original.application;
      
      // Count rejected documents
      const rejectedCount = [
        application?.status?.parentIdStatus,
        application?.status?.birthCertificateStatus,
        application?.status?.regulationsStatus,
        application?.status?.parentalAuthorizationStatus
      ].filter(status => status === 'NOT_VALID').length;
      
      const progressColor = 
        progress === 100 ? 'text-green-600' :
        progress >= 75 ? 'text-blue-600' :
        progress >= 50 ? 'text-yellow-600' :
        'text-red-600';
      
      return (
        <div className="flex flex-col items-center">
          <div className={`font-medium ${progressColor}`}>
            {progress}%
          </div>
          {rejectedCount > 0 && (
            <div className="text-xs text-red-500 flex items-center">
              ❌ {rejectedCount} rejected
            </div>
          )}
        </div>
      );
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "urgencyLevel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Priority
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const urgency = row.getValue("urgencyLevel") as string;
      const urgencyConfig = {
        critical: { icon: '🔴', label: 'Critical', color: 'text-red-600 bg-red-50' },
        high: { icon: '🟠', label: 'High', color: 'text-orange-600 bg-orange-50' },
        medium: { icon: '🟡', label: 'Medium', color: 'text-yellow-600 bg-yellow-50' },
        low: { icon: '🟢', label: 'Low', color: 'text-green-600 bg-green-50' }
      };
      
      const config = urgencyConfig[urgency as keyof typeof urgencyConfig];
      
      return (
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${config.color} flex items-center justify-center`}>
          <span className="mr-1">{config.icon}</span>
          {config.label}
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      const a = urgencyOrder[rowA.original.urgencyLevel as keyof typeof urgencyOrder];
      const b = urgencyOrder[rowB.original.urgencyLevel as keyof typeof urgencyOrder];
      return a - b;
    },
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Activity
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastActivity = row.getValue("lastActivity") as string;
      const daysSince = Math.floor((new Date().getTime() - new Date(lastActivity).getTime()) / (1000 * 3600 * 24));
      
      const activityColor = 
        daysSince <= 1 ? 'text-green-600' :
        daysSince <= 7 ? 'text-yellow-600' :
        daysSince <= 14 ? 'text-orange-600' :
        'text-red-600';
      
      return (
        <div className={`text-sm ${activityColor}`}>
          <div>{formatDate(lastActivity)}</div>
          <div className="text-xs opacity-75">
            {daysSince === 0 ? 'Today' : 
             daysSince === 1 ? '1 day ago' : 
             `${daysSince} days ago`}
          </div>
        </div>
      );
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
               !application.parentalAuthorizationUrl);
            
          case "DOCUMENTS_PENDING_VALIDATION":
            return application.status?.status === 'ACCEPTED' && 
              ((application.parentIdUrl && application.status?.parentIdStatus === 'PENDING') ||
               (application.birthCertificateUrl && application.status?.birthCertificateStatus === 'PENDING') ||
               (application.regulationsUrl && application.status?.regulationsStatus === 'PENDING') ||
               (application.parentalAuthorizationUrl && application.status?.parentalAuthorizationStatus === 'PENDING'));

          case "DOCUMENTS_REJECTED":
            return application.status?.status === 'ACCEPTED' && 
              (application.status?.parentIdStatus === 'NOT_VALID' ||
               application.status?.birthCertificateStatus === 'NOT_VALID' ||
               application.status?.regulationsStatus === 'NOT_VALID' ||
               application.status?.parentalAuthorizationStatus === 'NOT_VALID');

          case "DOCUMENTS_FULLY_VALIDATED":
            return application.status?.status === 'ACCEPTED' && 
              application.parentIdUrl && application.status?.parentIdStatus === 'VALID' &&
              application.birthCertificateUrl && application.status?.birthCertificateStatus === 'VALID' &&
              application.regulationsUrl && application.status?.regulationsStatus === 'VALID' &&
              application.parentalAuthorizationUrl && application.status?.parentalAuthorizationStatus === 'VALID';

          case "MISSING_PARENT_ID":
            return application.status?.status === 'ACCEPTED' && !application.parentIdUrl;

          case "MISSING_BIRTH_CERTIFICATE":
            return application.status?.status === 'ACCEPTED' && !application.birthCertificateUrl;

          case "MISSING_REGULATIONS":
            return application.status?.status === 'ACCEPTED' && !application.regulationsUrl;

          case "MISSING_PARENTAL_AUTH":
            return application.status?.status === 'ACCEPTED' && !application.parentalAuthorizationUrl;

          case "REJECTED_PARENT_ID":
            return application.status?.status === 'ACCEPTED' && application.status?.parentIdStatus === 'NOT_VALID';

          case "REJECTED_BIRTH_CERTIFICATE":
            return application.status?.status === 'ACCEPTED' && application.status?.birthCertificateStatus === 'NOT_VALID';

          case "REJECTED_REGULATIONS":
            return application.status?.status === 'ACCEPTED' && application.status?.regulationsStatus === 'NOT_VALID';

          case "REJECTED_PARENTAL_AUTH":
            return application.status?.status === 'ACCEPTED' && application.status?.parentalAuthorizationStatus === 'NOT_VALID';

          case "HIGH_PRIORITY":
            return application.status?.status === 'ACCEPTED' && 
              (row.original.urgencyLevel === 'high' || row.original.urgencyLevel === 'critical');

          case "CRITICAL_PRIORITY":
            return application.status?.status === 'ACCEPTED' && row.original.urgencyLevel === 'critical';

          case "STALE_APPLICATIONS":
            const lastActivity = new Date(row.original.lastActivity);
            const daysSinceActivity = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 3600 * 24));
            return application.status?.status === 'ACCEPTED' && daysSinceActivity > 14;

          case "RECENT_ACTIVITY":
            const recentActivity = new Date(row.original.lastActivity);
            const daysSinceRecent = Math.floor((new Date().getTime() - recentActivity.getTime()) / (1000 * 3600 * 24));
            return application.status?.status === 'ACCEPTED' && daysSinceRecent <= 3;

          case "LOW_DOCUMENT_PROGRESS":
            return application.status?.status === 'ACCEPTED' && row.original.documentProgress < 50;

          case "MULTIPLE_REJECTIONS":
            const rejectedCount = [
              application.status?.parentIdStatus,
              application.status?.birthCertificateStatus,
              application.status?.regulationsStatus,
              application.status?.parentalAuthorizationStatus
            ].filter(status => status === 'NOT_VALID').length;
            return application.status?.status === 'ACCEPTED' && rejectedCount >= 2;

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
