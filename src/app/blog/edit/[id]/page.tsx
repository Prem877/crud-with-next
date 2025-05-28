import prisma from "@/lib/prisma"
import { BlogForm } from "@/components/blog/blog-form"
import { notFound } from "next/navigation"

// async function getPost(id: string) {
//     const post = await prisma.post.findUnique({
//         where: { id },
//     })

//     if (!post) {
//         notFound()
//     }

//     return post
// }

// export default async function EditBlogPage({
//     params,
// }: {
//     params: { id: string }
// }) {
//     const post = await getPost(params.id)

//     return (
//         <div className="container mx-auto px-4 py-8 max-w-4xl">
//             <div className="mb-8">
//                 <h1 className="text-4xl font-bold mb-2">Edit story</h1>
//                 <p className="text-muted-foreground">Update your story and share your latest thoughts.</p>
//             </div>

//             <BlogForm post={post} />
//         </div>
//     )
// }

interface PageProps {
    params: Promise<{
        id: string
    }>
    searchParams?: Promise<Record<string, string | string[] | undefined>>
}

async function getPost(id: string) {
    const post = await prisma.post.findUnique({
        where: { id },
    })

    if (!post) {
        notFound()
    }

    return post
}

export default async function EditBlogPage({ params }: PageProps) {
    const { id } = await params
    const post = await getPost(id)

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">Edit story</h1>
                <p className="text-muted-foreground">Update your story and share your latest thoughts.</p>
            </div>

            <BlogForm post={post} />
        </div>
    )
}
