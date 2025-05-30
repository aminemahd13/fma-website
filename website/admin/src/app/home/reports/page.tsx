"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useRecoilValue } from 'recoil';
import { applicationsState } from '@/store/applicationsState';

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
	const applications = useRecoilValue(applicationsState);
	const [filtered, setFiltered] = useState<any[]>([]);
	const [statusFilter, setStatusFilter] = useState('');
	const [search, setSearch] = useState('');
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (!applications) return;
		const filteredApps = (applications as any[])
			.filter((app: any) => app.reportUrl)
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
		<div className="space-y-8">
			<div className="from-black to-stone-500 bg-clip-text text-4xl font-medium">
				Rapports soumis
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
										<td className="p-3">{app.user?.email}</td>
										<td className="p-3">
											<Badge className={getBadgeClassname(app.status?.reportStatus)}>
												{app.status?.reportStatus || 'N/A'}
											</Badge>
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
