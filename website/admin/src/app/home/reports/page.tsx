"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRecoilState } from 'recoil';
import { applicationsState } from '@/store/applicationsState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { putApplicationStatus } from '@/api/ApplicationApi';
import { toast } from '@/components/hooks/use-toast';

const statusOptions = [
	{ label: 'Tous', value: '' },
	{ label: 'Validé', value: 'VALID' },
	{ label: 'Non validé', value: 'NOT_VALID' },
	{ label: 'En attente', value: 'PENDING' },
];

function getBadgeClassname(status: string) {
	switch (status) {
		case 'VALID':
			return 'bg-[#79F2C0] text-black';
		case 'NOT_VALID':
			return 'bg-[#BF2600] text-white';
		case 'PENDING':
			return 'bg-yellow-200 text-black';
		default:
			return 'bg-gray-300 text-black';
	}
}

function ReportStatusSelector({ applicationId, currentStatus, onStatusChange }: { 
	applicationId: number; 
	currentStatus: string; 
	onStatusChange: (status: string) => void; 
}) {
	const [isLoading, setIsLoading] = useState(false);

	const handleStatusChange = async (newStatus: string) => {
		setIsLoading(true);
		try {
			const response = await putApplicationStatus(applicationId, {
				reportStatus: newStatus,
			}) as any;

			if (response?.statusCode === 200) {
				onStatusChange(newStatus);
				toast({
					title: 'Statut mis à jour',
					description: 'Le statut du rapport a été mis à jour avec succès',
				});
			} else {
				toast({
					title: 'Échec de la mise à jour',
					description: 'La mise à jour du statut a échoué. Veuillez réessayer.',
					variant: 'destructive',
				});
			}
		} catch (error) {
			console.error('Error updating report status:', error);
			toast({
				title: 'Erreur',
				description: 'Une erreur est survenue lors de la mise à jour du statut.',
				variant: 'destructive',
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Select defaultValue={currentStatus || 'PENDING'} onValueChange={handleStatusChange} disabled={isLoading}>
			<SelectTrigger className="w-full md:w-48">
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="PENDING">
					<Badge className={getBadgeClassname('PENDING')}>
						PENDING
					</Badge>
				</SelectItem>
				<SelectItem value="VALID">
					<Badge className={getBadgeClassname('VALID')}>
						VALID
					</Badge>
				</SelectItem>
				<SelectItem value="NOT_VALID">
					<Badge className={getBadgeClassname('NOT_VALID')}>
						NOT_VALID
					</Badge>
				</SelectItem>
			</SelectContent>
		</Select>
	);
}

function ReportLink({ reportUrl }: { reportUrl: string }) {
		const [presignedUrl, setPresignedUrl] = useState<string>("");
		const [loading, setLoading] = useState<boolean>(true);
		const [error, setError] = useState<string>("");

		useEffect(() => {
			if (!reportUrl) {
				setError("No report path provided");
				setLoading(false);
				return;
			}
			const getPresignedUrl = async () => {
				try {
					const token = localStorage.getItem('access_token');
					const response = await fetch('/api/media/get-presigned-url', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							...(token ? { 'Authorization': `Bearer ${token}` } : {}),
						},
						body: JSON.stringify({ key: reportUrl }),
					});
					const data = await response.json();
					if (data.url) {
						setPresignedUrl(data.url);
					} else {
						setError("Impossible d'obtenir le lien du rapport");
					}
				} catch (e) {
					setError("Erreur lors de la récupération du rapport");
				} finally {
					setLoading(false);
				}
			};
			getPresignedUrl();
		}, [reportUrl]);

		if (loading) return <span className="text-xs text-gray-400">Chargement...</span>;
		if (error) return <span className="text-xs text-red-500">{error}</span>;
		return (
			<Button
				asChild
				variant="secondary"
				size="sm"
				className="px-3 py-1 rounded-md border border-blue-500 text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors duration-150 flex items-center gap-1 shadow-sm"
			>
				<a
					href={presignedUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 font-medium"
				>
					<svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block mr-1">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h4a2 2 0 012 2v8a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h4m0-4v8m0-8l-3 3m3-3l3 3" />
					</svg>
					Voir le rapport
				</a>
			</Button>
		);
	}

export default function ReportsAdminPage() {	
	const [applications, setApplications] = useRecoilState(applicationsState);
	const [filtered, setFiltered] = useState<any[]>([]);
	const [statusFilter, setStatusFilter] = useState('');
	const [search, setSearch] = useState('');	
	const [loading, setLoading] = useState(false);
	const [totalReports, setTotalReports] = useState(0);
	const [reportStats, setReportStats] = useState({
		valid: 0,
		notValid: 0,
		pending: 0,
		noStatus: 0
	});
	const router = useRouter();

	const handleReportStatusChange = (applicationId: number, newStatus: string) => {
		setApplications(
			applications.map((app: any) => {
				if (app.id === applicationId) {
					return {
						...app,
						status: {
							...app.status,
							reportStatus: newStatus
						}
					};
				}
				return app;
			})
		);
	};useEffect(() => {
		if (!applications) return;
		const reportsWithFiles = (applications as any[]).filter((app: any) => app.reportUrl);
		setTotalReports(reportsWithFiles.length);
		
		// Calculate stats
		const stats = {
			valid: reportsWithFiles.filter(app => app.status?.reportStatus === 'VALID').length,
			notValid: reportsWithFiles.filter(app => app.status?.reportStatus === 'NOT_VALID').length,
			pending: reportsWithFiles.filter(app => app.status?.reportStatus === 'PENDING').length,
			noStatus: reportsWithFiles.filter(app => !app.status?.reportStatus).length
		};
		setReportStats(stats);
		
		const filteredApps = reportsWithFiles
			.filter((app: any) => !statusFilter || app.status?.reportStatus === statusFilter)
			.filter((app: any) => {
				if (!search) return true;
				return (
					app.user?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
					app.user?.lastName?.toLowerCase().includes(search.toLowerCase()) ||
					app.user?.email?.toLowerCase().includes(search.toLowerCase())
				);
			})
			.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()); // Sort by date desc
		setFiltered(filteredApps);
	}, [applications, statusFilter, search]);
	return (
		<div className="space-y-8">			<div className="flex items-center justify-between">
				<div className="from-black to-stone-500 bg-clip-text text-4xl font-medium">
					Rapports soumis
				</div>
				<div className="flex items-center gap-4">
					<div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
						<span className="text-sm text-blue-600 font-medium">
							{filtered.length} / {totalReports} rapports affichés
						</span>
					</div>
				</div>
			</div>
			
			{/* Statistics Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
				<div className="bg-green-50 border border-green-200 rounded-lg p-4">
					<div className="text-2xl font-bold text-green-700">{reportStats.valid}</div>
					<div className="text-sm text-green-600">Rapports validés</div>
				</div>
				<div className="bg-red-50 border border-red-200 rounded-lg p-4">
					<div className="text-2xl font-bold text-red-700">{reportStats.notValid}</div>
					<div className="text-sm text-red-600">Rapports non validés</div>
				</div>
				<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
					<div className="text-2xl font-bold text-yellow-700">{reportStats.pending}</div>
					<div className="text-sm text-yellow-600">Rapports en attente</div>
				</div>
				<div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
					<div className="text-2xl font-bold text-gray-700">{reportStats.noStatus}</div>
					<div className="text-sm text-gray-600">Sans statut</div>
				</div>
			</div>
			<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
				<Input
					placeholder="Recherche par nom, prénom ou email"
					value={search}
					onChange={e => setSearch(e.target.value)}
					className="w-full md:w-64"
				/>
				<select
					value={statusFilter}
					onChange={e => setStatusFilter(e.target.value)}
					className="border rounded px-2 py-1 bg-background text-foreground"
				>
					{statusOptions.map(opt => (
						<option key={opt.value} value={opt.value}>{opt.label}</option>
					))}
				</select>
			</div>
			<div className="rounded-md border bg-card">
				<div className="overflow-x-auto">
					<table className="min-w-full">
						<thead className="bg-muted">
							<tr>
								<th className="p-3 text-left font-semibold">Nom</th>
								<th className="p-3 text-left font-semibold">Email</th>
								<th className="p-3 text-left font-semibold">Statut du rapport</th>
								<th className="p-3 text-left font-semibold">Date de soumission</th>
								<th className="p-3 text-left font-semibold">Actions</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr><td colSpan={5} className="text-center p-4">Chargement...</td></tr>
							) : filtered.length === 0 ? (
								<tr><td colSpan={5} className="text-center p-4">Aucun rapport trouvé</td></tr>
							) : (
								filtered.map(app => (
									<tr key={app.id} className="even:bg-muted/50 hover:bg-accent transition-colors">
										<td className="p-3">{app.user?.firstName} {app.user?.lastName}</td>
										<td className="p-3">{app.user?.email}</td>										<td className="p-3">
											<ReportStatusSelector
												applicationId={app.id}
												currentStatus={app.status?.reportStatus}
												onStatusChange={(newStatus) => handleReportStatusChange(app.id, newStatus)}
											/>
										</td>
										<td className="p-3">{app.updatedAt ? new Date(app.updatedAt).toLocaleDateString('fr-FR') : ''}</td>
										<td className="p-3 flex gap-2 items-center">
											<Button size="sm" variant="outline" onClick={() => router.push(`/home/applications/${app.id}`)}>
												Voir la candidature
												</Button>
											{app.reportUrl && (
												<ReportLink reportUrl={app.reportUrl} />
											)}
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
