// components/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
// import { supabase } from '@/utils/supabase/client';
//img
import userImg from '@/assets/user.jpg';

export type User = {
    id: string;
    email: string;
    displayName: string;
    avatarUrl: string;
    role: string;
};

const deleteUser = async (id: any) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
        const res = await fetch(`/api/user/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            alert("User deleted successfully");
            window.location.reload();
        } else {
            alert("Failed to delete user");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

// Create a separate component for the Actions cell
const ActionsCell: React.FC<{ userId: string }> = ({ userId }) => {
    const router = useRouter(); // Now safe to use inside a React component

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => router.push(`/edit-user?id=${userId}`)}
                >
                    Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => deleteUser(userId)}
                >
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const columns: ColumnDef<User>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && 'indeterminate')
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'User ID',
        cell: ({ row }) => <div>{row.getValue('id')}</div>,
    },
    {
        accessorKey: 'displayName',
        header: 'Display Name',
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
                <Image
                    src={row.original.avatarUrl ? row.original.avatarUrl : userImg} // Use avatarUrl from the row data
                    alt={row.getValue('displayName')}
                    width={40}
                    height={40}
                    className="rounded-full"
                />
                {/* <Avatar className="h-8 w-8">
                    <AvatarImage src={row.original.avatarUrl} alt={row.getValue('email')} />
                    <AvatarFallback>
                        {row.original.avatarUrl}
                    </AvatarFallback>
                </Avatar> */}
                <span className="capitalize">{row.getValue('displayName')}</span>
            </div>

        ),
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
                Email
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        cell: ({ row }) => <div className="lowercase">{row.getValue('email')}</div>,
    },
    {
        accessorKey: 'role',
        header: 'Role',
        cell: ({ row }) => <div>{row.getValue('role')}</div>,
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => <ActionsCell userId={row.original.id} />,
        enableSorting: false,
        enableHiding: false,
    },
];