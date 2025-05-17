'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authClient } from '@/lib/auth-client';
import { FullOrganization } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import InviteMemberDialog from './dialogs/invite-member-dialog';
import { InvitationsList } from './invitations-list';
import { MembersList } from './members-list';
import { Spinner } from './spinner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';

const updateOrganisationSchema = z.object({
  name: z.string().min(2).max(50),
  logo: z.string().max(255).optional(),
});

// TODO: only admins should edit

export function OrganizationSettingsContent({
  organization,
  activeUserRole,
}: {
  organization: FullOrganization;
  activeUserRole: string;
}) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const form = useForm<z.infer<typeof updateOrganisationSchema>>({
    resolver: zodResolver(updateOrganisationSchema),
    defaultValues: {
      name: organization.name,
      logo: organization.logo ?? '',
    },
  });

  async function onSubmit(values: z.infer<typeof updateOrganisationSchema>) {
    setIsLoading(true);

    const { error } = await authClient.organization.update({
      data: {
        name: values.name,
        logo: values.logo && values.logo.length > 0 ? values.logo : undefined,
      },
      organizationId: organization.id,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to update organization', {
        description: error.message,
      });
      return;
    }

    router.refresh();
    toast.success('Successfully update organization');
  }

  async function deleteOrganisation() {
    setIsLoading(true);

    const { error } = await authClient.organization.delete({
      organizationId: organization.id,
    });

    setIsLoading(false);

    if (error) {
      toast.error('Failed to delete organization', {
        description: error.message,
      });
      return;
    }

    router.push('/dashboard');
    setIsDeleteDialogOpen(false);
    toast.success('Successfully deleted organization');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Organization Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your organization details, members, and invitations.
        </p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">Invitations</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
              <CardDescription>
                Update your organization&apos;s name and logo.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="grid gap-4">
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="My Organization" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logo"
                    render={({ field }) => (
                      <FormItem className="grid gap-1">
                        <FormLabel>Logo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/logo.png"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="mt-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <Spinner className="text-white dark:text-black" />
                    ) : null}
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>

          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Permanently delete this organization and all of its data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 text-sm">
                This action cannot be undone. This will permanently delete the
                organization, projects, and remove all members.
              </p>
              <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Organization
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Organization</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this organization? This
                      action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <p className="mb-2 text-sm font-medium">
                      Please type{' '}
                      <span className="font-bold">{organization.name}</span> to
                      confirm:
                    </p>
                    <Input
                      onChange={(e) => setDeleteConfirmation(e.target.value)}
                      placeholder={`Type "${organization.name}" to confirm`}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      disabled={isLoading}
                      onClick={() => setIsDeleteDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => await deleteOrganisation()}
                      disabled={
                        isLoading || deleteConfirmation !== organization.name
                      }>
                      {isLoading ? (
                        <Spinner className="text-white dark:text-black" />
                      ) : null}
                      Delete Organization
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <MembersList
            members={organization.members}
            activeUserRole={activeUserRole}
          />
        </TabsContent>

        <TabsContent value="invitations">
          <div className="space-y-6">
            <InviteMemberDialog organizationId={organization.id} />
            <InvitationsList invitations={organization.invitations} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
