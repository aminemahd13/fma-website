"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchTeamMembers, TeamMember, deleteTeamMember } from '@/lib/api/team-members';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from '@/components/ui/switch';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import Head from 'next/head';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

export default function TeamMembersPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const router = useRouter();

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await fetchTeamMembers();
      setTeamMembers(data);
    } catch (error) {
      console.error('Failed to load team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const handleEdit = (id: number) => {
    router.push(`/home/team-members/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;
    
    try {
      await deleteTeamMember(memberToDelete.id);
      toast.success('Team member deleted successfully');
      setDeleteConfirmOpen(false);
      loadTeamMembers();
    } catch (error) {
      console.error('Failed to delete team member:', error);
      toast.error('Failed to delete team member');
    }
  };

  const confirmDelete = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteConfirmOpen(true);
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'organizingCommittee':
        return <Badge className="bg-blue-500">Organizing Committee</Badge>;
      case 'staff':
        return <Badge className="bg-green-500">Staff</Badge>;
      case 'webDevelopment':
        return <Badge className="bg-purple-500">Web Development</Badge>;
      case 'brandDesign':
        return <Badge className="bg-yellow-500">Brand & Design</Badge>;
      case 'um6p':
        return <Badge className="bg-red-500">UM6P</Badge>;
      default:
        return <Badge>{category}</Badge>;
    }
  };

  return (
    <>
      <Head>
        <title>Team Members Management | FMA Admin</title>
      </Head>

      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>Manage your organizing team members here</CardDescription>
              </div>
              <Button asChild>
                <Link href="/home/team-members/new">Add New Team Member</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center p-4">Loading...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No team members found
                      </TableCell>
                    </TableRow>
                  ) : (
                    teamMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.id}</TableCell>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>
                          {member.imageSrc && (
                            <img 
                              src={member.imageSrc} 
                              alt={member.name} 
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                        </TableCell>
                        <TableCell>{getCategoryBadge(member.category)}</TableCell>
                        <TableCell>
                          <Switch checked={member.isActive} disabled />
                        </TableCell>
                        <TableCell>{member.order}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEdit(member.id)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => confirmDelete(member)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{memberToDelete?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}