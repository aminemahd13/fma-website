"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchTeamMember, updateTeamMember, TeamMember, UpdateTeamMemberData } from '@/lib/api/team-members';
import TeamMemberForm from '@/components/team-members/team-member-form';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EditTeamMemberPage() {
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const loadTeamMember = async () => {
      if (!id || typeof id !== 'string') return;
      
      try {
        setIsLoadingData(true);
        const data = await fetchTeamMember(parseInt(id));
        setTeamMember(data);
      } catch (error) {
        console.error('Failed to load team member:', error);
        toast.error('Failed to load team member');
        router.push('/home/team-members');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadTeamMember();
  }, [id, router]);

  const handleSubmit = async (data: UpdateTeamMemberData) => {
    if (!teamMember) return;

    setIsLoading(true);
    try {
      await updateTeamMember(teamMember.id, data);
      toast.success('Team member updated successfully');
      router.push('/home/team-members');
    } catch (error) {
      console.error('Failed to update team member:', error);
      toast.error('Failed to update team member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Team Member | MTYM Admin</title>
      </Head>

      <div className="container mx-auto py-10">
        <Button 
          variant="outline" 
          asChild 
          className="mb-4"
        >
          <Link href="/home/team-members">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Team Members
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Edit Team Member</CardTitle>
            <CardDescription>
              Update the details of a team member in the organizing team
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingData ? (
              <div className="text-center p-4">Loading...</div>
            ) : teamMember ? (
              <TeamMemberForm 
                initialData={teamMember}
                onSubmit={handleSubmit} 
                isLoading={isLoading} 
              />
            ) : (
              <div className="text-center p-4">Team member not found</div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}