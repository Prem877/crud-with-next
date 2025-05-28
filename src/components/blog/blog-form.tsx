"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createPost, updatePost } from "./action"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface Post {
    id: string
    title: string
    content: string
    excerpt: string | null
    published: boolean
}

interface BlogFormProps {
    post?: Post
}

export function BlogForm({ post }: BlogFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const isEditing = !!post

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)
        try {
            if (isEditing) {
                await updatePost(post.id, formData)
            } else {
                await createPost(formData)
            }
            router.push("/blog")
        } catch (error) {
            console.error("Error saving post:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" asChild>
                    <Link href="/blog">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to blog
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{isEditing ? "Edit Story" : "Create New Story"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter your story title..."
                                defaultValue={post?.title || ""}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="excerpt">Excerpt (Optional)</Label>
                            <Textarea
                                id="excerpt"
                                name="excerpt"
                                placeholder="A brief description of your story..."
                                rows={3}
                                defaultValue={post?.excerpt || ""}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                                id="content"
                                name="content"
                                placeholder="Tell your story..."
                                rows={15}
                                defaultValue={post?.content || ""}
                                required
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Switch id="published" name="published" defaultChecked={post?.published || false} />
                            <Label htmlFor="published">Publish immediately</Label>
                        </div>

                        <div className="flex gap-4">
                            <Button type="submit" disabled={isSubmitting}>
                                <Save className="mr-2 h-4 w-4" />
                                {isSubmitting
                                    ? isEditing
                                        ? "Updating..."
                                        : "Creating..."
                                    : isEditing
                                        ? "Update Story"
                                        : "Create Story"}
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/blog">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
