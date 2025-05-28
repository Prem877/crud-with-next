import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Calendar, User, Edit } from "lucide-react"

async function getPost(slug: string) {
    const post = await prisma.post.findUnique({
        where: { slug },
        include: { author: true },
    })

    if (!post) {
        notFound()
    }

    return post
}

export default async function BlogPostPage({
    params,
}: {
    params: { slug: string }
}) {
    const post = await getPost(params.slug)

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="mb-8">
                <Button variant="ghost" asChild className="mb-4">
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to blog
                    </Link>
                </Button>

                <div className="flex items-center gap-2 mb-4">
                    <Badge variant={post.published ? "default" : "secondary"}>{post.published ? "Published" : "Draft"}</Badge>
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/blog/edit/${post.id}`}>
                            <Edit className="mr-2 h-3 w-3" />
                            Edit
                        </Link>
                    </Button>
                </div>

                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                {post.excerpt && <p className="text-xl text-muted-foreground mb-6">{post.excerpt}</p>}

                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-8">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{post.author.name || "Anonymous"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <Separator />
            </div>

            <article className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap">{post.content}</div>
            </article>
        </div>
    )
}
