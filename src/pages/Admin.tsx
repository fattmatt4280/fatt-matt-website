import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import AdminGuard from "@/components/AdminGuard";
import { LogOut, Save, Plus, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SiteContent {
  id: string;
  section: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
}

interface PortfolioItem {
  id: string;
  category: string;
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<SiteContent | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: content } = await supabase
      .from("site_content")
      .select("*")
      .order("section");
    
    const { data: portfolio } = await supabase
      .from("portfolio_items")
      .select("*")
      .order("display_order");

    if (content) setSiteContent(content);
    if (portfolio) setPortfolioItems(portfolio);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleUpdateContent = async (content: SiteContent) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("site_content")
        .update({
          title: content.title,
          subtitle: content.subtitle,
          description: content.description,
          image_url: content.image_url,
        })
        .eq("id", content.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Content updated successfully",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddPortfolioItem = async () => {
    const newItem = {
      category: "black-grey",
      title: "New Portfolio Item",
      description: "Description",
      image_url: "https://placehold.co/600x400",
      display_order: portfolioItems.length,
    };

    setLoading(true);
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .insert(newItem);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio item added",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePortfolioItem = async (item: PortfolioItem) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .update({
          category: item.category,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          display_order: item.display_order,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio item updated",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("portfolio_items")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio item deleted",
      });
      
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <h1 className="text-2xl font-orbitron font-bold text-primary">Admin Dashboard</h1>
            <Button onClick={handleSignOut} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </header>

        <main className="container py-8">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList>
              <TabsTrigger value="content">Site Content</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {siteContent.map((content) => (
                  <Card key={content.id}>
                    <CardHeader>
                      <CardTitle className="capitalize">{content.section}</CardTitle>
                      <CardDescription>Edit {content.section} section content</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={content.title || ""}
                          onChange={(e) => {
                            const updated = siteContent.map((c) =>
                              c.id === content.id ? { ...c, title: e.target.value } : c
                            );
                            setSiteContent(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={content.subtitle || ""}
                          onChange={(e) => {
                            const updated = siteContent.map((c) =>
                              c.id === content.id ? { ...c, subtitle: e.target.value } : c
                            );
                            setSiteContent(updated);
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={content.description || ""}
                          onChange={(e) => {
                            const updated = siteContent.map((c) =>
                              c.id === content.id ? { ...c, description: e.target.value } : c
                            );
                            setSiteContent(updated);
                          }}
                        />
                      </div>
                      <Button
                        onClick={() => handleUpdateContent(content)}
                        disabled={loading}
                        className="w-full"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="portfolio" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Portfolio Items</h2>
                <Button onClick={handleAddPortfolioItem} disabled={loading}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              <Card>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Image URL</TableHead>
                        <TableHead>Order</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolioItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <Input
                              value={item.category}
                              onChange={(e) => {
                                const updated = portfolioItems.map((i) =>
                                  i.id === item.id ? { ...i, category: e.target.value } : i
                                );
                                setPortfolioItems(updated);
                              }}
                              className="w-32"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.title}
                              onChange={(e) => {
                                const updated = portfolioItems.map((i) =>
                                  i.id === item.id ? { ...i, title: e.target.value } : i
                                );
                                setPortfolioItems(updated);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.description || ""}
                              onChange={(e) => {
                                const updated = portfolioItems.map((i) =>
                                  i.id === item.id ? { ...i, description: e.target.value } : i
                                );
                                setPortfolioItems(updated);
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              value={item.image_url}
                              onChange={(e) => {
                                const updated = portfolioItems.map((i) =>
                                  i.id === item.id ? { ...i, image_url: e.target.value } : i
                                );
                                setPortfolioItems(updated);
                              }}
                              className="w-48"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              value={item.display_order}
                              onChange={(e) => {
                                const updated = portfolioItems.map((i) =>
                                  i.id === item.id ? { ...i, display_order: parseInt(e.target.value) } : i
                                );
                                setPortfolioItems(updated);
                              }}
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleUpdatePortfolioItem(item)}
                                disabled={loading}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeletePortfolioItem(item.id)}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
};

export default Admin;
