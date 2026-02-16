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
import { LogOut, Save, Plus, Trash2, Upload, Image as ImageIcon, Users, Mail, Phone, MapPin } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

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
  category: string[];
  title: string;
  description: string | null;
  image_url: string;
  display_order: number;
  artist_name: string | null;
  duration_hours: number | null;
  placement: string | null;
  size: string | null;
  color_type: string | null;
  notes: string | null;
}

interface LocationRegistration {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  location: string;
  created_at: string;
}

const LOCATION_LABELS: Record<string, string> = {
  "montgomery-il": "Montgomery, IL",
  "portage-in": "Portage, IN",
  "clearwater-fl": "Clearwater, FL",
};
interface PortfolioImage {
  id: string;
  portfolio_item_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

const TATTOO_STYLES = [
  "Black & Grey",
  "Traditional",
  "Neo-Traditional",
  "Realism",
  "Watercolor",
  "Japanese",
  "Tribal",
  "Geometric",
  "Minimalist",
  "Portraits",
  "Cover-Ups",
  "Custom/Other",
] as const;

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [subscribers, setSubscribers] = useState<LocationRegistration[]>([]);

  useEffect(() => {
    fetchData();

    // Realtime subscription for new sign-ups
    const channel = supabase
      .channel('location_registrations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'location_registrations',
        },
        () => {
          fetchData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

    const { data: images } = await supabase
      .from("portfolio_images")
      .select("*")
      .order("display_order");

    const { data: registrations } = await supabase
      .from("location_registrations")
      .select("*")
      .order("created_at", { ascending: false });

    if (content) setSiteContent(content);
    if (portfolio) setPortfolioItems(portfolio);
    if (images) setPortfolioImages(images);
    if (registrations) setSubscribers(registrations);
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

  const handleMultipleImageUpload = async (files: FileList, itemId: string) => {
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    let successCount = 0;
    let errorCount = 0;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "Error",
            description: `${file.name}: File size must be less than 5MB`,
            variant: "destructive",
          });
          errorCount++;
          continue;
        }

        if (!file.type.startsWith("image/")) {
          toast({
            title: "Error",
            description: `${file.name}: File must be an image`,
            variant: "destructive",
          });
          errorCount++;
          continue;
        }

        try {
          const fileExt = file.name.split(".").pop();
          const fileName = `${itemId}-${Date.now()}-${i}.${fileExt}`;
          const filePath = `${fileName}`;

          // Upload to storage
          const { error: uploadError } = await supabase.storage
            .from("portfolio-images")
            .upload(filePath, file, { upsert: true });

          if (uploadError) throw uploadError;

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from("portfolio-images")
            .getPublicUrl(filePath);

          // Get current max display_order for this item
          const currentImages = portfolioImages.filter(img => img.portfolio_item_id === itemId);
          const maxOrder = currentImages.length > 0 
            ? Math.max(...currentImages.map(img => img.display_order))
            : -1;

          // Insert into portfolio_images table
          const { error: insertError } = await supabase
            .from("portfolio_images")
            .insert({
              portfolio_item_id: itemId,
              image_url: publicUrl,
              display_order: maxOrder + 1 + i
            });

          if (insertError) throw insertError;
          successCount++;
        } catch (error: any) {
          console.error(`Error uploading ${file.name}:`, error);
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} image(s) uploaded successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        });
        fetchData();
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      const { error } = await supabase
        .from("portfolio_images")
        .delete()
        .eq("id", imageId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted",
      });
      fetchData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleAddPortfolioItem = async () => {
    const newItem = {
      category: ["Black & Grey"],
      title: "New Portfolio Item",
      description: "Add description here",
      image_url: "https://placehold.co/600x400",
      display_order: portfolioItems.length,
      artist_name: null,
      duration_hours: null,
      placement: null,
      size: null,
      color_type: null,
      notes: null,
    };

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("portfolio_items")
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio item added",
      });
      
      fetchData();
      if (data) {
        setEditingItem(data);
        setDialogOpen(true);
      }
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
    // Validate required fields
    if (!item.title || !item.category || item.category.length === 0) {
      toast({
        title: "Validation Error",
        description: "Title and at least one style are required",
        variant: "destructive",
      });
      return;
    }

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
          artist_name: item.artist_name,
          duration_hours: item.duration_hours,
          placement: item.placement,
          size: item.size,
          color_type: item.color_type,
          notes: item.notes,
        })
        .eq("id", item.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Portfolio item updated",
      });
      
      setDialogOpen(false);
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
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="content">Site Content</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="subscribers" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Subscribers
              </TabsTrigger>
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

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {portfolioItems.map((item) => {
                  const itemImages = portfolioImages.filter(img => img.portfolio_item_id === item.id);
                  const displayImage = itemImages.length > 0 
                    ? itemImages.sort((a, b) => a.display_order - b.display_order)[0].image_url
                    : item.image_url;
                  
                  return (
                    <Card key={item.id} className="overflow-hidden">
                      <div className="relative bg-muted">
                        <img
                          src={displayImage}
                          alt={item.title}
                          className="w-full h-auto object-contain mx-auto"
                        />
                        {itemImages.length > 1 && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur"
                          >
                            <ImageIcon className="h-3 w-3 mr-1" />
                            {itemImages.length}
                          </Badge>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{item.title}</CardTitle>
                        <CardDescription>
                        <div className="flex flex-wrap gap-1">
                          {item.category.map(cat => (
                            <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                          ))}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        <Dialog open={dialogOpen && editingItem?.id === item.id} onOpenChange={(open) => {
                          setDialogOpen(open);
                          if (!open) setEditingItem(null);
                        }}>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => setEditingItem(item)}
                            >
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Edit Portfolio Item</DialogTitle>
                              <DialogDescription>
                                Update the details and upload multiple images
                              </DialogDescription>
                            </DialogHeader>
                            {editingItem && (
                              <div className="space-y-4">
                                {/* Image Upload Section */}
                                <div className="space-y-2">
                                  <Label>Images (Multiple)</Label>
                                  
                                  {/* Display all images for this item */}
                                  {(() => {
                                    const itemImages = portfolioImages.filter(
                                      img => img.portfolio_item_id === editingItem.id
                                    );
                                    return itemImages.length > 0 ? (
                                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                        {itemImages.map((img) => (
                                          <div key={img.id} className="relative group">
                                            <div className="relative bg-muted rounded-lg overflow-hidden">
                                              <img
                                                src={img.image_url}
                                                alt={`Image ${img.display_order + 1}`}
                                                className="w-full h-48 object-contain"
                                              />
                                            </div>
                                            <Button
                                              variant="destructive"
                                              size="sm"
                                              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                              onClick={() => handleDeleteImage(img.id)}
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <p className="text-xs text-center mt-1 text-muted-foreground">
                                              Image {img.display_order + 1}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="bg-muted rounded-lg p-8 text-center text-muted-foreground">
                                        <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No images uploaded yet</p>
                                      </div>
                                    );
                                  })()}

                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      disabled={uploadingImage}
                                      onClick={() => document.getElementById(`file-upload-${editingItem.id}`)?.click()}
                                      className="flex-1"
                                    >
                                      <Upload className="mr-2 h-4 w-4" />
                                      {uploadingImage ? "Uploading..." : "Upload Images"}
                                    </Button>
                                    <input
                                      id={`file-upload-${editingItem.id}`}
                                      type="file"
                                      accept="image/jpeg,image/png,image/webp"
                                      multiple
                                      className="hidden"
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                          handleMultipleImageUpload(files, editingItem.id);
                                          e.target.value = ''; // Reset input
                                        }
                                      }}
                                    />
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    Max size: 5MB per file. Formats: JPG, PNG, WEBP. Select multiple files at once.
                                  </p>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                  <Label>Title *</Label>
                                  <Input
                                    value={editingItem.title}
                                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                    placeholder="Enter tattoo title"
                                  />
                                </div>

                                {/* Style Multi-Select */}
                                <div className="space-y-2">
                                  <Label>Styles * (select all that apply)</Label>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button variant="outline" className="w-full justify-start">
                                        {editingItem.category.length === 0 
                                          ? "Select styles..." 
                                          : `${editingItem.category.length} selected`}
                                      </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-4">
                                      <div className="space-y-2">
                                        {TATTOO_STYLES.map((style) => (
                                          <div key={style} className="flex items-center space-x-2">
                                            <Checkbox 
                                              id={`style-${style}`}
                                              checked={editingItem.category.includes(style)}
                                              onCheckedChange={(checked) => {
                                                if (checked) {
                                                  setEditingItem({ 
                                                    ...editingItem, 
                                                    category: [...editingItem.category, style] 
                                                  });
                                                } else {
                                                  setEditingItem({ 
                                                    ...editingItem, 
                                                    category: editingItem.category.filter(s => s !== style) 
                                                  });
                                                }
                                              }}
                                            />
                                            <label 
                                              htmlFor={`style-${style}`}
                                              className="text-sm cursor-pointer"
                                            >
                                              {style}
                                            </label>
                                          </div>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                  {editingItem.category.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {editingItem.category.map(cat => (
                                        <Badge key={cat} variant="secondary">{cat}</Badge>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={editingItem.description || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    placeholder="Describe the tattoo"
                                    rows={3}
                                  />
                                </div>

                                {/* Two Column Layout for Details */}
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Artist Name</Label>
                                    <Input
                                      value={editingItem.artist_name || ""}
                                      onChange={(e) => setEditingItem({ ...editingItem, artist_name: e.target.value })}
                                      placeholder="Artist name"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Duration (hours)</Label>
                                    <Input
                                      type="number"
                                      step="0.5"
                                      value={editingItem.duration_hours || ""}
                                      onChange={(e) => setEditingItem({ ...editingItem, duration_hours: parseFloat(e.target.value) || null })}
                                      placeholder="Hours"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Placement</Label>
                                    <Input
                                      value={editingItem.placement || ""}
                                      onChange={(e) => setEditingItem({ ...editingItem, placement: e.target.value })}
                                      placeholder="e.g., Arm, Back, Leg"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Size</Label>
                                    <Input
                                      value={editingItem.size || ""}
                                      onChange={(e) => setEditingItem({ ...editingItem, size: e.target.value })}
                                      placeholder="e.g., Small, 6x4 inches"
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Color Type</Label>
                                    <Select
                                      value={editingItem.color_type || ""}
                                      onValueChange={(value) => setEditingItem({ ...editingItem, color_type: value })}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select color type" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Black & Grey">Black & Grey</SelectItem>
                                        <SelectItem value="Full Color">Full Color</SelectItem>
                                        <SelectItem value="Mixed">Mixed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label>Display Order</Label>
                                    <Input
                                      type="number"
                                      value={editingItem.display_order}
                                      onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) })}
                                    />
                                  </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-2">
                                  <Label>Notes</Label>
                                  <Textarea
                                    value={editingItem.notes || ""}
                                    onChange={(e) => setEditingItem({ ...editingItem, notes: e.target.value })}
                                    placeholder="Additional notes or special details"
                                    rows={2}
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 pt-4">
                                  <Button
                                    onClick={() => handleUpdatePortfolioItem(editingItem)}
                                    disabled={loading}
                                    className="flex-1"
                                  >
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => setDialogOpen(false)}
                                    disabled={loading}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeletePortfolioItem(item.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="subscribers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Subscribers</h2>
                <Badge variant="secondary" className="text-sm">
                  {subscribers.length} total
                </Badge>
              </div>

              {subscribers.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No subscribers yet.</p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Signed Up</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell className="font-medium">{sub.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                                {sub.email}
                              </div>
                            </TableCell>
                            <TableCell>
                              {sub.phone ? (
                                <div className="flex items-center gap-1.5">
                                  <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                                  {sub.phone}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                {LOCATION_LABELS[sub.location] || sub.location}
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {new Date(sub.created_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AdminGuard>
  );
};

export default Admin;
