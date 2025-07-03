"use client"

import { Label } from '@/components/shared/label'
import Separator from '@/components/shared/separator';
import { formatDate } from '@/lib/utils'
import { applicationsState } from '@/store/applicationsState';
import React, { ReactNode, useEffect, useState } from 'react'
import { useRecoilState } from 'recoil';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/shared/tabs";
import { useRouter } from 'next/navigation';
import { ExpandingArrow } from '@/components/shared/icons';
import ApplicationStatus from '../components/application-status';
import FilesTable from './files-table';
import AdminReportUpload from '@/components/AdminReportUpload';

const regionLabels = {
  'tanger-tetouan-al-houceima': "Tanger-Tétouan-Al Hoceïma",
  'oriental': "Oriental",
  'fes-meknes': "Fès-Meknès",
  'rabat-sale-kenitra': "Rabat-Salé-Kénitra",
  'beni-mellal-khenifra': "Béni Mellal-Khénifra",
  'casablanca-settat': "Casablanca-Settat",
  'marrakech-safi': "Marrakech-Safi",
  'draa-tafilalet': "Drâa-Tafilalet",
  'souss-massa': "Souss-Massa",
  'guelmim-oued-noun': "Guelmim-Oued Noun",
  'laayoune-sakia-el-hamra': "Laâyoune-Sakia El Hamra",
  'dakhla-oued-eddahab': "Dakhla-Oued Eddahab",
  'abroad': "Abroad",
} as any;

const relationshipWithGuardianLabels = {
  'father': 'Père',
  'mother': 'Mère',
  'guardian': 'Tuteur'
} as any;

const educationLevelLabels = {
  "tronc-commun": "Tronc commun",
  "1bac": "1ère année Bac",
  "2bac": "2ème année Bac",
 } as any;

const educationFieldLabels = {
  "tc-sciences": "TC sciences",
  "tc-technologique": "TC technologique",
  "1bac-sciences-economiques-et-gestion": "1BAC Sciences Economiques et Gestion",
  "1bac-arts-appliques": "1BAC Arts Appliqués",
  "1bac-sciences-experimentales": "1BAC Sciences Expérimentales",
  "1bac-sciences-mathematiques": "1BAC Sciences Mathématiques",
  "1bac-sciences-et-technologies-electriques": "1BAC Sciences et Technologies Electriques",
  "1bac-sciences-et-technologies-mecaniques": "1BAC Sciences et Technologies Mécaniques",
  "2bac-sciences-economiques": "2BAC Sciences Economiques",
  "2bac-sciences-de-gestion-et-comptabilite": "2BAC Sciences de Gestion et Comptabilité",
  "2bac-arts-appliques": "2BAC Arts Appliqués",
  "2bac-sciences-de-la-vie-et-de-la-terre": "2BAC Sciences de la Vie et de la Terre",
  "2bac-sciences-physique-chimie": "2BAC Sciences Physique Chimie",
  "2bac-sciences-agronomiques": "2BAC Sciences Agronomiques",
  "2bac-sciences-mathematiques-a": "2BAC Sciences Mathématiques A",
  "2bac-sciences-mathematiques-b": "2BAC Sciences Mathématiques B",
  "2bac-sciences-et-technologies-electrique": "2BAC Sciences et Technologies Electrique",
  "2bac-sciences-et-technologies-mecanique": "2BAC Sciences et Technologies Mécanique",
  "autre": "Autre",
} as any;

const booleanLabels = {
  "yes": "Oui",
  "no": "Non",
  "not-selected": "J'ai postulé, mais je n'ai pas été sélectionné."
} as any;

const renderText = (value: any) => {
  return value
    ? value
    : <span className='text-gray-400'>(empty)</span>
}

const Field = ({
  label,
  children,
}: {
  label: string,
  children: ReactNode,
}) => {
  return <div>
    <Label className='text-[#272162] font-semibold'>{label}</Label>
    <p>{children}</p>
  </div>
}

export default function ApplicationDetailsPage({ params }: { params: { id: string } }) {
  const [applications, setApplications] = useRecoilState(applicationsState);
  const [application, setApplication] = useState<any>(undefined);
  const id = parseInt(params.id);
  const router = useRouter();
  useEffect(() => {
    if (applications) {
      setApplication(applications.find((application: any) => application?.id === id))
    }
  }, [applications, id])

  return (
    <>
      {application
        ? (
          <Tabs defaultValue="personal-informations" className='space-y-8'>
            <div 
              className='font-semibold flex cursor-pointer'
              onClick={() => router.push('/home/applications')}
            >
              <ExpandingArrow className='rotate-180 mr-2'/> {"  "} Back
            </div>

            <div 
              className='font-semibold text-2xl flex justify-between'
            >
              <div>
                Application of <span className='bg-gradient-to-br from-sky-800 to-[#272162] inline-block text-transparent bg-clip-text'>{application?.firstName} {application?.lastName}</span>
              </div>

              <ApplicationStatus applicationId={application?.id} status={application?.status?.status} />
            </div>

            {/* Quick Summary Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-blue-700 font-medium">Contact Info</div>
                  <div className="text-sm">📧 {application?.email}</div>
                  <div className="text-sm">📱 {application?.phoneNumber || 'No phone'}</div>
                  <div className="text-sm">🏠 {application?.city}, {regionLabels[application?.region]}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-blue-700 font-medium">Academic Info</div>
                  <div className="text-sm">🏫 {application?.highschool}</div>
                  <div className="text-sm">📊 Average: {application?.averageGrade || 'N/A'}</div>
                  <div className="text-sm">⚗️ Physics: {application?.physicsAverageGrade || 'N/A'}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-blue-700 font-medium">Document Status</div>
                  <div className="space-y-1">
                    {[
                      { key: 'parentIdStatus', label: 'Parent ID', url: 'parentIdUrl' },
                      { key: 'birthCertificateStatus', label: 'Birth Cert', url: 'birthCertificateUrl' },
                      { key: 'regulationsStatus', label: 'Regulations', url: 'regulationsUrl' },
                      { key: 'parentalAuthorizationStatus', label: 'Parental Auth', url: 'parentalAuthorizationUrl' }
                    ].map(doc => {
                      const status = application?.status?.[doc.key];
                      const hasFile = !!application?.[doc.url];
                      const statusColor = 
                        status === 'VALID' ? 'text-green-600' :
                        status === 'NOT_VALID' ? 'text-red-600' :
                        status === 'PENDING' ? 'text-yellow-600' :
                        'text-gray-400';
                      const statusIcon = 
                        status === 'VALID' ? '✅' :
                        status === 'NOT_VALID' ? '❌' :
                        status === 'PENDING' ? '⏳' :
                        hasFile ? '📄' : '❌';
                      
                      return (
                        <div key={doc.key} className={`text-xs flex items-center ${statusColor}`}>
                          <span className="mr-1">{statusIcon}</span>
                          {doc.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Action Center */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🛠️ Admin Action Center</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Quick Document Actions */}
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-sm text-blue-700 mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <button 
                      className="w-full text-left px-3 py-2 text-xs bg-green-50 hover:bg-green-100 rounded border border-green-200 text-green-700"
                      onClick={() => {
                        // Implement bulk approve all valid documents
                        console.log('Approve all valid documents');
                      }}
                    >
                      ✅ Approve All Valid
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-xs bg-yellow-50 hover:bg-yellow-100 rounded border border-yellow-200 text-yellow-700"
                      onClick={() => {
                        // Implement mark all as pending
                        console.log('Mark all as pending review');
                      }}
                    >
                      ⏳ Mark Pending Review
                    </button>
                    <button 
                      className="w-full text-left px-3 py-2 text-xs bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 text-blue-700"
                      onClick={() => {
                        // Implement send reminder email
                        console.log('Send reminder email');
                      }}
                    >
                      📧 Send Reminder
                    </button>
                  </div>
                </div>

                {/* Application Timeline */}
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-sm text-purple-700 mb-3">Timeline</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                      Applied: {formatDate(application?.createdAt)}
                    </div>
                    {application?.status?.updatedAt && (
                      <div className="flex items-center text-gray-600">
                        <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                        Status: {formatDate(application?.status?.updatedAt)}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                      Last Update: {formatDate(application?.updatedAt)}
                    </div>
                  </div>
                </div>

                {/* Communication Log */}
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-sm text-orange-700 mb-3">Communication</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      📱 Phone: {application?.phoneNumber || 'Not provided'}
                    </div>
                    <div className="text-xs text-gray-600">
                      📧 Email: {application?.email || application?.user?.email}
                    </div>
                    <div className="text-xs text-gray-600">
                      👤 Guardian: {application?.guardianPhoneNumber || 'Not provided'}
                    </div>
                    <button 
                      className="w-full mt-2 px-2 py-1 text-xs bg-orange-50 hover:bg-orange-100 rounded border border-orange-200 text-orange-700"
                      onClick={() => {
                        // Copy contact info to clipboard
                        navigator.clipboard.writeText(`Name: ${application?.firstName} ${application?.lastName}\nPhone: ${application?.phoneNumber}\nEmail: ${application?.email || application?.user?.email}\nGuardian: ${application?.guardianPhoneNumber}`);
                      }}
                    >
                      📋 Copy Contact Info
                    </button>
                  </div>
                </div>

                {/* Application Metrics */}
                <div className="bg-white p-4 rounded border">
                  <h4 className="font-medium text-sm text-green-700 mb-3">Metrics</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Academic Avg:</span>
                      <span className="font-medium">{application?.averageGrade || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Physics Avg:</span>
                      <span className="font-medium">{application?.physicsAverageGrade || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ranking:</span>
                      <span className="font-medium">{application?.ranking || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Physics Rank:</span>
                      <span className="font-medium">{application?.physicsRanking || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Analysis */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4">📊 Application Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Academic Performance */}
                <div className="bg-white p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-700 mb-3">🎓 Academic Performance</h4>
                  <div className="space-y-2">
                    {(() => {
                      const avgGrade = parseFloat(application?.averageGrade || '0');
                      const physicsGrade = parseFloat(application?.physicsAverageGrade || '0');
                      
                      const getGradeColor = (grade: number) => {
                        if (grade >= 16) return 'text-green-600 bg-green-50';
                        if (grade >= 14) return 'text-blue-600 bg-blue-50';
                        if (grade >= 12) return 'text-yellow-600 bg-yellow-50';
                        return 'text-red-600 bg-red-50';
                      };
                      
                      const getGradeLabel = (grade: number) => {
                        if (grade >= 16) return 'Excellent';
                        if (grade >= 14) return 'Good';
                        if (grade >= 12) return 'Average';
                        return 'Below Average';
                      };
                      
                      return (
                        <>
                          <div className={`px-2 py-1 rounded text-xs ${getGradeColor(avgGrade)}`}>
                            Overall: {avgGrade.toFixed(1)} - {getGradeLabel(avgGrade)}
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${getGradeColor(physicsGrade)}`}>
                            Physics: {physicsGrade.toFixed(1)} - {getGradeLabel(physicsGrade)}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Document Completion Status */}
                <div className="bg-white p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-700 mb-3">📋 Document Status</h4>
                  <div className="space-y-2">
                    {(() => {
                      const docs = [
                        { key: 'parentIdStatus', label: 'Parent ID', url: 'parentIdUrl' },
                        { key: 'birthCertificateStatus', label: 'Birth Cert', url: 'birthCertificateUrl' },
                        { key: 'regulationsStatus', label: 'Regulations', url: 'regulationsUrl' },
                        { key: 'parentalAuthorizationStatus', label: 'Parental Auth', url: 'parentalAuthorizationUrl' }
                      ];
                      
                      const validCount = docs.filter(doc => application?.status?.[doc.key] === 'VALID').length;
                      const pendingCount = docs.filter(doc => application?.status?.[doc.key] === 'PENDING').length;
                      const rejectedCount = docs.filter(doc => application?.status?.[doc.key] === 'NOT_VALID').length;
                      const missingCount = docs.filter(doc => !application?.[doc.url]).length;
                      
                      return (
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>✅ Validated:</span>
                            <span className="font-medium text-green-600">{validCount}/4</span>
                          </div>
                          <div className="flex justify-between">
                            <span>⏳ Pending:</span>
                            <span className="font-medium text-yellow-600">{pendingCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>❌ Rejected:</span>
                            <span className="font-medium text-red-600">{rejectedCount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>📄 Missing:</span>
                            <span className="font-medium text-gray-600">{missingCount}</span>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Risk Assessment */}
                <div className="bg-white p-4 rounded-lg border border-indigo-100">
                  <h4 className="font-medium text-indigo-700 mb-3">⚠️ Risk Assessment</h4>
                  <div className="space-y-2">
                    {(() => {
                      const risks = [];
                      
                      // Check for academic risks
                      const avgGrade = parseFloat(application?.averageGrade || '0');
                      if (avgGrade < 12) risks.push({ level: 'high', message: 'Low academic performance' });
                      
                      // Check for document risks
                      const rejectedDocs = [
                        application?.status?.parentIdStatus,
                        application?.status?.birthCertificateStatus,
                        application?.status?.regulationsStatus,
                        application?.status?.parentalAuthorizationStatus
                      ].filter(status => status === 'NOT_VALID').length;
                      
                      if (rejectedDocs >= 2) risks.push({ level: 'critical', message: 'Multiple document rejections' });
                      else if (rejectedDocs >= 1) risks.push({ level: 'medium', message: 'Document rejections' });
                      
                      // Check for communication risks
                      if (!application?.phoneNumber) risks.push({ level: 'low', message: 'Missing phone number' });
                      
                      // Check for activity risks
                      const lastActivity = new Date(application?.updatedAt || application?.createdAt);
                      const daysSince = Math.floor((new Date().getTime() - lastActivity.getTime()) / (1000 * 3600 * 24));
                      if (daysSince > 14) risks.push({ level: 'medium', message: 'Inactive for 14+ days' });
                      
                      if (risks.length === 0) {
                        return <div className="text-xs text-green-600 bg-green-50 p-2 rounded">✅ No risks identified</div>;
                      }
                      
                      return risks.map((risk, index) => {
                        const colors = {
                          critical: 'text-red-600 bg-red-50',
                          high: 'text-orange-600 bg-orange-50',
                          medium: 'text-yellow-600 bg-yellow-50',
                          low: 'text-blue-600 bg-blue-50'
                        };
                        
                        return (
                          <div key={index} className={`text-xs p-2 rounded ${colors[risk.level as keyof typeof colors]}`}>
                            {risk.message}
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Verification Alerts */}
            {(() => {
              const rejectedDocs = [
                { key: 'parentIdStatus', label: 'Parent ID', url: 'parentIdUrl' },
                { key: 'birthCertificateStatus', label: 'Birth Certificate', url: 'birthCertificateUrl' },
                { key: 'regulationsStatus', label: 'Regulations', url: 'regulationsUrl' },
                { key: 'parentalAuthorizationStatus', label: 'Parental Authorization', url: 'parentalAuthorizationUrl' }
              ].filter(doc => application?.status?.[doc.key] === 'NOT_VALID');

              const missingDocs = [
                { key: 'parentIdStatus', label: 'Parent ID', url: 'parentIdUrl' },
                { key: 'birthCertificateStatus', label: 'Birth Certificate', url: 'birthCertificateUrl' },
                { key: 'regulationsStatus', label: 'Regulations', url: 'regulationsUrl' },
                { key: 'parentalAuthorizationStatus', label: 'Parental Authorization', url: 'parentalAuthorizationUrl' }
              ].filter(doc => !application?.[doc.url] && application?.status?.status === 'ACCEPTED');

              const pendingDocs = [
                { key: 'parentIdStatus', label: 'Parent ID', url: 'parentIdUrl' },
                { key: 'birthCertificateStatus', label: 'Birth Certificate', url: 'birthCertificateUrl' },
                { key: 'regulationsStatus', label: 'Regulations', url: 'regulationsUrl' },
                { key: 'parentalAuthorizationStatus', label: 'Parental Authorization', url: 'parentalAuthorizationUrl' }
              ].filter(doc => application?.status?.[doc.key] === 'PENDING');

              return (
                <>
                  {rejectedDocs.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="text-red-800 font-semibold mb-2 flex items-center">
                        ❌ Rejected Documents ({rejectedDocs.length})
                      </h4>
                      <div className="text-sm text-red-700">
                        The following documents need to be resubmitted: {rejectedDocs.map(doc => doc.label).join(', ')}
                      </div>
                    </div>
                  )}

                  {missingDocs.length > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                      <h4 className="text-orange-800 font-semibold mb-2 flex items-center">
                        📋 Missing Required Documents ({missingDocs.length})
                      </h4>
                      <div className="text-sm text-orange-700">
                        Missing documents: {missingDocs.map(doc => doc.label).join(', ')}
                      </div>
                    </div>
                  )}

                  {pendingDocs.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="text-yellow-800 font-semibold mb-2 flex items-center">
                        ⏳ Pending Validation ({pendingDocs.length})
                      </h4>
                      <div className="text-sm text-yellow-700">
                        Documents awaiting review: {pendingDocs.map(doc => doc.label).join(', ')}
                      </div>
                    </div>
                  )}

                  {rejectedDocs.length === 0 && missingDocs.length === 0 && pendingDocs.length === 0 && application?.status?.status === 'ACCEPTED' && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="text-green-800 font-semibold mb-2 flex items-center">
                        ✅ All Required Documents Validated
                      </h4>
                      <div className="text-sm text-green-700">
                        All required documents have been submitted and validated successfully.
                      </div>
                    </div>
                  )}
                </>
              );
            })()}

            <TabsList className="flex justify-start space-x-8 h-[4rem] bg-slate-200 text-black">
              <TabsTrigger value="personal-informations" className='text-base h-full'>Personal Informations</TabsTrigger>
              <TabsTrigger value="education" className='text-base h-full'>Education</TabsTrigger>
              <TabsTrigger value="competition" className='text-base h-full'>Competition</TabsTrigger>
              <TabsTrigger value="uploads" className='text-base h-full'>Uploads</TabsTrigger>
            </TabsList>
            <Separator className="my-6" />

            {/* PERSONAL INFORMARIONS */}
            <TabsContent value="personal-informations">
              <div className='space-y-6'>
                <Field label='First name'>{renderText(application?.firstName)}</Field>
                <Field label='Last name'>{renderText(application?.lastName)}</Field>
                <Field label='Date of birth'>{renderText(formatDate(application?.dateOfBirth))}</Field>
                <Field label='City of residence'>{renderText(application?.city)}</Field>
                <Field label='Region of residence'>{renderText(regionLabels[application?.region])}</Field>
                <Field label='Phone number'>{renderText(application?.phoneNumber)}</Field>
                <Separator className="my-6" />
                <Field label='Guardian full name'>{renderText(application?.guardianFullName)}</Field>
                <Field label='Guardian phone number'>{renderText(application?.guardianPhoneNumber)}</Field>
                <Field label='Relationship with guardian'>{renderText(relationshipWithGuardianLabels[application?.relationshipWithGuardian])}</Field>
                <Field label='Special conditions'>{renderText(application?.specialConditions)}</Field>
              </div>
            </TabsContent>
            
            {/* EDUCATION */}
            <TabsContent value="education">
              <div className='space-y-6'>
                <Field label='Highschool'>{renderText(application?.highschool)}</Field>
                <Separator className="my-6" />

                <Field label='Average grade'>{renderText(application?.averageGrade)}</Field>
                <Field label='Physics average grade'>{renderText(application?.physicsAverageGrade)}</Field>
                <Field label='Ranking'>{renderText(application?.ranking)}</Field>
                <Field label='Physics ranking'>{renderText(application?.physicsRanking)}</Field>
              </div>
            </TabsContent>
              
            {/* COMPETTION */}
            <TabsContent value="competition">
              <div className='space-y-6'>
                <Field label='Have you participated in competitions before (Olympiads, national contests...) ?'>{renderText(booleanLabels[application?.hasPreviouslyParticipated])}</Field>
                <Field label='If yes, please specify which ones and the achieved result.'>{renderText(application?.previousCompetitions)}</Field>
                <Field label='Physics Olympiads participation'>{renderText(application?.physicsOlympiadsParticipation)}</Field>
                <Field label='Olympiads training selection'>{renderText(application?.olympiadsTrainingSelection)}</Field>
                <Separator className="my-6" />
                <Field label='Comments'>{renderText(application?.comments)}</Field>
              </div>
            </TabsContent>
              {/* UPLOADS */}
            <TabsContent value="uploads">
              <div className='space-y-6'>
                <div className='md:flex space-y-4 md:space-x-4 md:space-y-0'>
                  <FilesTable application={application} />
                </div>
                  {/* Admin Report Upload Section - always show for admins */}
                <div className='mt-6'>
                  <AdminReportUpload 
                    applicationId={application?.id}
                    currentReportUrl={application?.reportUrl}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )
        : <></>
      }
    </>
  )
}
