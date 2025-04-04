// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     await prisma.user.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json(
//       { message: "User deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return NextResponse.json(
//       { error: "Failed to delete user" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, context: any) {
  const { params } = context;
  const id = params.id as string; // Assert id as string

  try {
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
