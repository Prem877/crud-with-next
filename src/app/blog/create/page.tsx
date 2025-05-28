import { BlogForm } from "@/components/blog/blog-form"

export default function CreateBlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Create a new story</h1>
        <p className="text-muted-foreground">Share your thoughts and ideas with the world.</p>
      </div>

      <BlogForm />
    </div>
  )
}
