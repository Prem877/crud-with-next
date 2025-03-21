// // pages/users.tsx
// 'use client';

// import { DataTable } from '@/components/ui/data-table';
// import { useUserData } from '@/hooks/dashboard/useUserData';
// import { ColumnDef } from '@tanstack/react-table';

// // types/user.ts
// export interface UserData {
//     uid: string;
//     email: string | undefined;
//     displayName: string;
// }

// export const columns: ColumnDef<UserData>[] = [
//     {
//         accessorKey: 'uid',
//         header: 'User ID',
//     },
//     {
//         accessorKey: 'email',
//         header: 'Email',
//     },
//     {
//         accessorKey: 'displayName',
//         header: 'Display Name',
//     },
// ];

// export default function DemoTable() {
//     const userData = useUserData();

//     if (!userData) return <div>Loading...</div>;

//     const tableData = [userData]; // Wrap single user in array

//     return (
//         <div className="flex-col justify-start gap-6">
//             <DataTable columns={columns} data={tableData} />
//         </div>
//     );
// }