"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createTeamMember, CreateTeamMemberData } from '@/lib/api/team-members';
import TeamMemberForm from '@/components/team-members/team-member-form';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Head from 'next/head';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewTeamMemberPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (data: CreateTeamMemberData) => {
    setIsLoading(true);
    try {
      await createTeamMember(data);
      toast.success('Team member created successfully');
      router.push('/home/team-members');
    } catch (error) {
      console.error('Failed to create team member:', error);
      toast.error('Failed to create team member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Add Team Member | FMA Admin</title>
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
            <CardTitle>Add New Team Member</CardTitle>
            <CardDescription>
              Create a new team member to display on the organizing team page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TeamMemberForm 
              onSubmit={handleSubmit} 
              isLoading={isLoading} 
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}