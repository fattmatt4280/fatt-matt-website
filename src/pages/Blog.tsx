import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Tattoo Aftercare: The Ultimate Guide",
      excerpt: "Learn the essential steps to keep your new tattoo looking vibrant and healing properly.",
      date: "2025-01-15",
      category: "Aftercare",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Choosing Your First Tattoo Design",
      excerpt: "Tips and considerations for selecting a design that you'll love forever.",
      date: "2025-01-10",
      category: "Design Tips",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "The Art of Black & Grey Realism",
      excerpt: "Exploring the timeless technique that brings portraits and scenes to life.",
      date: "2025-01-05",
      category: "Styles",
      image: "/placeholder.svg"
    }
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ink <span className="text-primary">Stories</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Tattoo tips, artist insights, and industry trends
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                  </div>
                  <CardTitle className="hover:text-primary transition-colors cursor-pointer">
                    {post.title}
                  </CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <button className="text-primary hover:underline font-medium">
                    Read More →
                  </button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Blog;
