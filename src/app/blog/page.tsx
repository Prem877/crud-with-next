import prisma from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { PlusCircle, Calendar, User } from "lucide-react"

async function getPosts() {
    return await prisma.post.findMany({
        where: { published: true },
        include: { author: true },
        orderBy: { createdAt: "desc" },
    })
}

export default async function BlogPage() {
    const posts = await getPosts()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-4xl font-bold mb-2">Blog</h1>
                    <p className="text-muted-foreground">Discover stories, thinking, and expertise from writers on any topic.</p>
                </div>
                <Button asChild>
                    <Link href="/blog/create">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Write a story
                    </Link>
                </Button>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <h2 className="text-2xl font-semibold mb-4">No posts yet</h2>
                    <p className="text-muted-foreground mb-6">Be the first to share your story with the world.</p>
                    <Button asChild>
                        <Link href="/blog/create">Create your first post</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => (
                        <Card key={post.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">Published</Badge>
                                </div>
                                <CardTitle className="line-clamp-2">
                                    <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                                        {post.title}
                                    </Link>
                                </CardTitle>
                                {post.excerpt && <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>}
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <User className="h-3 w-3" />
                                        {post.author.name || "Anonymous"}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
