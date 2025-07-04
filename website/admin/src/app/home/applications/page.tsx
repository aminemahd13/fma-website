"use client"

import { ApplicationsTable } from "@/app/home/applications/components/applications-table";
import { applicationsState } from "@/store/applicationsState";
import { useRecoilValue } from "recoil";
import { columns } from "./components/columns";
import { ApplicationRow } from "./components/columns";
import { useEffect, useState } from "react";

export default function ApplicationsPage() {
  const applications = useRecoilValue(applicationsState);
  const [tableData, setTableData] = useState<ApplicationRow[]>([])
  const [filteredData, setFilteredData] = useState<ApplicationRow[]>([])

  useEffect(() => {
    if (applications) {
      const newTableData = applications.map((application: any) => {
          // Calculate document progress
          const requiredDocs = ['parentIdUrl', 'birthCertificateUrl', 'regulationsUrl', 'parentalAuthorizationUrl'];
          const validatedDocs = ['parentIdStatus', 'birthCertificateStatus', 'regulationsStatus', 'parentalAuthorizationStatus'];
          
          const submittedCount = requiredDocs.filter(doc => application[doc]).length;
          const validatedCount = validatedDocs.filter(status => application.status?.[status] === 'VALID').length;
          const documentProgress = Math.round((validatedCount / requiredDocs.length) * 100);

          // Calculate urgency level
          const rejectedCount = validatedDocs.filter(status => application.status?.[status] === 'NOT_VALID').length;
          const pendingCount = validatedDocs.filter(status => application.status?.[status] === 'PENDING').length;
          const missingCount = requiredDocs.filter(doc => !application[doc]).length;
          
          let urgencyLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
          
          if (rejectedCount >= 2 || (rejectedCount >= 1 && missingCount >= 2)) {
            urgencyLevel = 'critical';
          } else if (rejectedCount >= 1 || missingCount >= 3 || pendingCount >= 3) {
            urgencyLevel = 'high';
          } else if (missingCount >= 1 || pendingCount >= 1) {
            urgencyLevel = 'medium';
          }

          // Calculate last activity (use the most recent timestamp available)
          const timestamps = [
            application.updatedAt,
            application.createdAt,
            application.status?.updatedAt
          ].filter(Boolean);
          
          const lastActivity = timestamps.length > 0 
            ? new Date(Math.max(...timestamps.map((t: string) => new Date(t).getTime()))).toISOString()
            : application.createdAt || new Date().toISOString();

          return {
            id: application?.id,
            firstName: application?.firstName || application?.user?.firstName,
            lastName: application?.lastName || application?.user?.lastName,
            email: application?.user?.email,
            phoneNumber: application?.phoneNumber,
            dateOfBirth: application?.dateOfBirth,
            city: application?.city,
            highschool: application?.highschool,
            status: application?.status?.status,
            documentProgress,
            urgencyLevel,
            lastActivity,
            // Include full application object for advanced filtering
            application: application,
          };
        });
      
      setTableData(newTableData);
      setFilteredData(newTableData); // Initialize filtered data with all data
    }
  }, [applications])

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className='from-black to-stone-500 bg-clip-text text-4xl font-medium'>
          Applications
        </div>
        
        {/* Admin Quick Actions */}
        <div className="flex flex-col space-y-2">
          <div className="text-sm text-gray-600">Quick Stats & Actions</div>
          <div className="flex space-x-4 text-sm">
            <div className="bg-blue-50 px-3 py-1 rounded">
              <span className="text-blue-700">Total: </span>
              <span className="font-medium">{filteredData.length}</span>
            </div>
            <div className="bg-red-50 px-3 py-1 rounded">
              <span className="text-red-700">Critical: </span>
              <span className="font-medium">{filteredData.filter(app => app.urgencyLevel === 'critical').length}</span>
            </div>
            <div className="bg-orange-50 px-3 py-1 rounded">
              <span className="text-orange-700">High Priority: </span>
              <span className="font-medium">{filteredData.filter(app => app.urgencyLevel === 'high').length}</span>
            </div>
            <div className="bg-green-50 px-3 py-1 rounded">
              <span className="text-green-700">Validated: </span>
              <span className="font-medium">{filteredData.filter(app => app.documentProgress === 100).length}</span>
            </div>
          </div>
          
          {/* Export Functions */}
          <div className="flex space-x-2 mt-2">
            <button 
              className="px-3 py-1 text-xs bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded text-indigo-700"
              onClick={() => {
                // Export applications data as CSV
                const csvData = tableData.map(app => ({
                  ID: app.id,
                  'First Name': app.firstName,
                  'Last Name': app.lastName,
                  Email: app.email,
                  Phone: app.phoneNumber || 'N/A',
                  City: app.city,
                  Highschool: app.highschool,
                  Status: app.status,
                  'Document Progress': `${app.documentProgress}%`,
                  Priority: app.urgencyLevel,
                  'Last Activity': app.lastActivity
                }));
                
                const csv = [
                  Object.keys(csvData[0]).join(','),
                  ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
                ].join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `applications_export_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              📊 Export CSV
            </button>
            
            <button 
              className="px-3 py-1 text-xs bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded text-purple-700"
              onClick={() => {
                // Export critical applications for immediate action
                const criticalApps = tableData.filter(app => app.urgencyLevel === 'critical');
                const criticalData = criticalApps.map(app => ({
                  ID: app.id,
                  Name: `${app.firstName} ${app.lastName}`,
                  Phone: app.phoneNumber || 'N/A',
                  Email: app.email,
                  Issues: 'Multiple rejections or missing documents',
                  Priority: 'CRITICAL'
                }));
                
                if (criticalData.length === 0) {
                  alert('No critical applications found!');
                  return;
                }
                
                const csv = [
                  Object.keys(criticalData[0]).join(','),
                  ...criticalData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
                ].join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `critical_applications_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              🚨 Export Critical
            </button>
            
            <button 
              className="px-3 py-1 text-xs bg-green-50 hover:bg-green-100 border border-green-200 rounded text-green-700"
              onClick={() => {
                // Generate contact list for completed applications
                const completedApps = tableData.filter(app => app.documentProgress === 100);
                const contactData = completedApps.map(app => ({
                  Name: `${app.firstName} ${app.lastName}`,
                  Email: app.email,
                  Phone: app.phoneNumber || 'N/A',
                  Status: 'Documents Validated'
                }));
                
                if (contactData.length === 0) {
                  alert('No completed applications found!');
                  return;
                }
                
                const csv = [
                  Object.keys(contactData[0]).join(','),
                  ...contactData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
                ].join('\n');
                
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `validated_contacts_${new Date().toISOString().split('T')[0]}.csv`;
                a.click();
                window.URL.revokeObjectURL(url);
              }}
            >
              📞 Export Contacts
            </button>
          </div>
        </div>
      </div>

      {/* Alert Summary */}
      {(() => {
        const criticalCount = filteredData.filter(app => app.urgencyLevel === 'critical').length;
        
        if (criticalCount > 0) {
          return (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-red-800 font-semibold mb-2">⚠️ Admin Attention Required</h3>
              <div className="text-sm">
                <div className="text-red-700">
                  🔴 <strong>{criticalCount}</strong> applications with critical issues requiring immediate action
                </div>
              </div>
            </div>
          );
        }
        return null;
      })()}

      <ApplicationsTable 
        columns={columns} 
        data={tableData} 
        onFilteredDataChange={setFilteredData}
      />
    </div>
  );
}