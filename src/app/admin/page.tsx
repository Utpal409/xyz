
"use client";

import { useState, useEffect, type FormEvent, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';
import { auth, database } from '@/lib/firebase';
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ref, set, push, onValue, off } from 'firebase/database';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, FileJson, FileText, Info, Plus, Edit, Trash2, Save, Settings, Upload, Database, ChevronDown, ChevronUp, LogOut, Loader2, UserCircle, Server, Binary } from 'lucide-react';
import type { Article } from '@/lib/types';
// PLACEHOLDER_ARTICLES removed as data is now from Firebase

type ArticleFormData = Omit<Article, 'id' | 'publishedAt' | 'categoryName'> & { publishedAt?: string };

const MANAGED_DB_PATHS_KEY = 'admin/config/managedDbPaths';
const DEFAULT_DB_PATHS = ['articles', 'settings/theme']; 

export default function AdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPathsLoading, setIsPathsLoading] = useState(true);

  const [dbPaths, setDbPaths] = useState<string[]>([]);
  const [selectedDbPath, setSelectedDbPath] = useState<string>('');
  const [newPathInput, setNewPathInput] = useState('');
  const [editingPath, setEditingPath] = useState<{ index: number; value: string } | null>(null);

  const [articleForm, setArticleForm] = useState<Partial<ArticleFormData>>({
    title: '',
    summary: '',
    content: '',
    imageUrl: '',
    categorySlug: '',
    author: '',
    dataAiHint: '',
  });

  const [showPathManagement, setShowPathManagement] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const [showDataStructureSection, setShowDataStructureSection] = useState(false);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/login');
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const saveDbPathsToFirebase = useCallback(async (pathsToSave: string[]) => {
    if (!currentUser) {
      toast({ title: 'Authentication Error', description: 'You must be logged in to save paths.', variant: 'destructive' });
      return false;
    }
    try {
      const dbPathsRef = ref(database, MANAGED_DB_PATHS_KEY);
      await set(dbPathsRef, pathsToSave);
      return true;
    } catch (error: any) {
      console.error("Error saving paths to Firebase:", error);
      toast({ title: 'Error Saving Paths', description: error.message || 'Could not save paths to database.', variant: 'destructive' });
      return false;
    }
  }, [toast, currentUser]);

  useEffect(() => {
    if (!currentUser) return; 

    setIsPathsLoading(true);
    const dbPathsRef = ref(database, MANAGED_DB_PATHS_KEY);
    
    const listener = onValue(dbPathsRef, (snapshot) => {
      const pathsFromDb = snapshot.val();
      let currentPaths = DEFAULT_DB_PATHS;
      if (pathsFromDb && Array.isArray(pathsFromDb) && pathsFromDb.length > 0) {
        currentPaths = pathsFromDb;
      } else if (currentUser) { 
          saveDbPathsToFirebase(DEFAULT_DB_PATHS);
          toast({ title: 'Paths Initialized', description: 'Default database paths have been set up.' });
      }
      
      setDbPaths(currentPaths);

      if (!currentPaths.includes(selectedDbPath) && currentPaths.length > 0) {
        setSelectedDbPath(currentPaths[0]);
      } else if (currentPaths.length === 0) {
        setSelectedDbPath('');
      }
      setIsPathsLoading(false);
    }, (error) => {
      console.error("Error fetching paths from Firebase:", error);
      toast({ title: 'Error Fetching Paths', description: 'Could not load paths from database. Using defaults.', variant: 'destructive' });
      let fallbackPaths = DEFAULT_DB_PATHS;
      setDbPaths(fallbackPaths); 
      setSelectedDbPath(fallbackPaths[0] || '');
      setIsPathsLoading(false);
    });

    return () => {
      off(dbPathsRef, 'value', listener);
    };
  }, [currentUser, selectedDbPath, toast, saveDbPathsToFirebase]);


  const handleAddPath = async () => {
    if (newPathInput.trim() && !dbPaths.includes(newPathInput.trim())) {
      const updatedPaths = [...dbPaths, newPathInput.trim()];
      const success = await saveDbPathsToFirebase(updatedPaths);
      if (success) {
        if (!selectedDbPath) {
          setSelectedDbPath(newPathInput.trim());
        }
        setNewPathInput('');
        toast({ title: 'Success', description: 'Database path added successfully.' });
      }
    } else if (dbPaths.includes(newPathInput.trim())) {
      toast({ title: 'Error', description: 'This path already exists.', variant: 'destructive' });
    } else {
      toast({ title: 'Error', description: 'Please enter a valid path.', variant: 'destructive' });
    }
  };

  const handleOpenEditModal = (path: string, index: number) => {
    setEditingPath({ index, value: path });
  };

  const handleSaveEditedPath = async () => {
    if (editingPath && editingPath.value.trim()) {
      const updatedPaths = [...dbPaths];
      const oldPath = updatedPaths[editingPath.index];
      updatedPaths[editingPath.index] = editingPath.value.trim();
      
      const success = await saveDbPathsToFirebase(updatedPaths);
      if (success) {
        if (selectedDbPath === oldPath) {
          setSelectedDbPath(editingPath.value.trim());
        }
        toast({ title: 'Success', description: 'Database path updated successfully.' });
        setEditingPath(null);
      }
    } else {
      toast({ title: 'Error', description: 'Please enter a valid path.', variant: 'destructive' });
    }
  };

  const handleDeletePath = async (pathToDeleteConfirmed: string) => {
    const updatedPaths = dbPaths.filter(p => p !== pathToDeleteConfirmed);
    const success = await saveDbPathsToFirebase(updatedPaths);
    if (success) {
      if (selectedDbPath === pathToDeleteConfirmed) {
        setSelectedDbPath(updatedPaths.length > 0 ? updatedPaths[0] : '');
      }
      toast({ title: 'Success', description: `Database path '${pathToDeleteConfirmed}' removed.` });
    }
  };


  const handleJsonUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) {
      toast({ title: 'Authentication Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    if (!selectedDbPath) {
      toast({ title: 'Error', description: 'Please select a database path.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonInput);
    } catch (error) {
      toast({ title: 'JSON Parsing Error', description: 'The provided JSON is invalid.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    try {
      const dataRef = ref(database, selectedDbPath);
      await set(dataRef, parsedJson);
      toast({ title: 'Success!', description: `JSON data successfully uploaded to '${selectedDbPath}'.` });
      setJsonInput('');
    } catch (error: any) {
      toast({ title: 'Upload Error', description: error.message || 'Failed to upload data to Firebase.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleArticleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticleForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFormUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) {
      toast({ title: 'Authentication Error', description: 'You must be logged in.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);

    if (!selectedDbPath) {
      toast({ title: 'Error', description: 'Please select a database path.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }

    if (!articleForm.title || !articleForm.categorySlug) {
      toast({ title: 'Error', description: 'Title and Category Slug are required.', variant: 'destructive' });
      setIsLoading(false);
      return;
    }
    // categoryName will be derived by the app when fetching data
    const newArticleData: Omit<Article, 'id' | 'categoryName'> & { publishedAt: string } = {
      title: articleForm.title || '',
      summary: articleForm.summary || '',
      content: articleForm.content || '',
      imageUrl: articleForm.imageUrl || 'https://placehold.co/600x400.png',
      dataAiHint: articleForm.dataAiHint || 'news placeholder',
      categorySlug: articleForm.categorySlug || '',
      author: articleForm.author || 'Admin',
      publishedAt: new Date().toISOString(),
    };

    try {
      const collectionRef = ref(database, selectedDbPath); // Assuming selectedDbPath is like 'articles'
      await push(collectionRef, newArticleData); // push() generates a unique ID
      toast({ title: 'Success!', description: `Article successfully uploaded to '${selectedDbPath}'.` });
      setArticleForm({ title: '', summary: '', content: '', imageUrl: '', categorySlug: '', author: '', dataAiHint: '' });
    } catch (error: any) {
      toast({ title: 'Upload Error', description: error.message || 'Failed to upload article to Firebase.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const exampleJsonStructureForUpload = `
[
  {
    // "id": "Firebase will auto-generate this if you 'push' to a list/collection node.",
    // "categoryName": "This is derived from categorySlug automatically when data is fetched.",
    "title": "Example Article Title 1",
    "summary": "This is a brief summary of the article.",
    "content": "This is the detailed content of the article...\\n\\nIt can have multiple paragraphs.",
    "imageUrl": "https://placehold.co/600x400.png",
    "dataAiHint": "example content",
    "categorySlug": "politics", 
    "publishedAt": "2024-08-01T10:00:00Z", 
    "author": "Author Name"
  }
  // ... more articles if uploading an array to SET at a path (e.g., /articles)
]
// If you are uploading a single article using push, you'd upload just the object:
// { "title": "...", ... } 
// to the '/articles' path, and Firebase generates the ID.
// If uploading an object with your own keys (e.g. for settings), it would look like:
// {
//   "someUniqueArticleId123": { "title": "...", ... },
//   "anotherUniqueId456": { "title": "...", ... }
// }
  `;

  const getSingleArticleStructureDescription = () => {
    const structure: Record<string, string> = {};
    const fieldDescriptions: Partial<Record<keyof Article, string>> = {
      id: "string (Unique identifier. Auto-generated by Firebase push or provided if setting data by specific key.)",
      title: "string (Required: The main headline of the article)",
      summary: "string (Recommended: A brief summary of the article)",
      content: "string (Required: The full content. Use '\\n\\n' for paragraphs in JSON strings)",
      imageUrl: "string (Optional: URL for the article's primary image. Defaults to placeholder)",
      dataAiHint: "string (Optional: 1-2 keywords for AI image search, e.g., 'technology abstract')",
      categorySlug: "string (Required: URL-friendly identifier for the category, e.g., 'politics')",
      categoryName: "string (Derived: Display name of the category. Automatically derived from categorySlug in the app when fetched)",
      publishedAt: "string (Required: ISO 8601 date-time format, e.g., '2024-07-30T10:00:00Z')",
      author: "string (Optional: Name of the article's author)",
    };
    
    // Create a prototype based on Article keys to ensure all are listed
    const articlePrototype: Record<keyof Article, any> = {
      id: "", title: "", summary: "", content: "", imageUrl: "",
      dataAiHint: "", categorySlug: "", categoryName: "", publishedAt: "", author: ""
    };
    
    const allPossibleKeys = Object.keys(articlePrototype) as Array<keyof Article>;

    for (const key of allPossibleKeys) {
       structure[key] = fieldDescriptions[key] || `Type: unknown (Define in Article type and descriptions)`;
    }
    return JSON.stringify(structure, null, 2);
  };


  const togglePathManagement = () => {
    setShowPathManagement(!showPathManagement);
    if (!showPathManagement) { setShowUploadSection(false); setShowDataStructureSection(false); }
  };

  const toggleUploadSection = () => {
    setShowUploadSection(!showUploadSection);
    if (!showUploadSection) { setShowPathManagement(false); setShowDataStructureSection(false); }
  };

  const toggleDataStructureSection = () => {
    setShowDataStructureSection(!showDataStructureSection);
    if (!showDataStructureSection) { setShowPathManagement(false); setShowUploadSection(false); }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
      router.push('/login');
    } catch (error: any) {
      toast({ title: 'Logout Error', description: error.message || 'Failed to log out.', variant: 'destructive' });
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
       <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center pb-2 border-b-2 border-primary">
          <h1 className="text-3xl font-headline font-bold">
            Admin Panel
          </h1>
          <div className="flex items-center space-x-2">
            {currentUser.email && (
                <span className="text-sm text-muted-foreground hidden sm:flex items-center">
                    <UserCircle className="h-4 w-4 mr-1"/> {currentUser.email}
                </span>
            )}
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Button onClick={togglePathManagement} variant="outline" size="lg" className="w-full py-6 text-lg">
            <Database className="h-5 w-5 mr-2" />
            Manage Paths
            {showPathManagement ? <ChevronUp className="ml-auto h-5 w-5"/> : <ChevronDown className="ml-auto h-5 w-5"/>}
          </Button>
          <Button onClick={toggleUploadSection} variant="outline" size="lg" className="w-full py-6 text-lg">
            <Upload className="h-5 w-5 mr-2" />
            Upload Content
            {showUploadSection ? <ChevronUp className="ml-auto h-5 w-5"/> : <ChevronDown className="ml-auto h-5 w-5"/>}
          </Button>
          <Button onClick={toggleDataStructureSection} variant="outline" size="lg" className="w-full py-6 text-lg">
            <Binary className="h-5 w-5 mr-2" />
            Article Structure
            {showDataStructureSection ? <ChevronUp className="ml-auto h-5 w-5"/> : <ChevronDown className="ml-auto h-5 w-5"/>}
          </Button>
        </div>

        {showPathManagement && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-6 w-6 mr-2 text-primary" />
                Database Path Management
              </CardTitle>
              <CardDescription>Add, edit, delete, and select database paths for data uploads. Paths are saved to Firebase at <code>{MANAGED_DB_PATHS_KEY}</code>.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="New path (e.g. articles)"
                  value={newPathInput}
                  onChange={(e) => setNewPathInput(e.target.value)}
                  className="flex-grow"
                />
                <Button onClick={handleAddPath} variant="outline" disabled={isPathsLoading}>
                  <Plus className="h-4 w-4 mr-1" /> Add Path
                </Button>
              </div>
              {isPathsLoading && <div className="flex items-center text-sm text-muted-foreground"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading paths...</div>}
              {!isPathsLoading && dbPaths.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="selectDbPath">Select active path for uploads:</Label>
                  <Select value={selectedDbPath} onValueChange={setSelectedDbPath} disabled={dbPaths.length === 0}>
                    <SelectTrigger id="selectDbPath">
                      <SelectValue placeholder="Select a path" />
                    </SelectTrigger>
                    <SelectContent>
                      {dbPaths.map(path => (
                        <SelectItem key={path} value={path}>{path}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {!isPathsLoading && (
                <div className="space-y-2">
                  <Label>Existing Managed Paths:</Label>
                  {dbPaths.length === 0 ? <p className="text-sm text-muted-foreground">No paths configured. Add one above.</p> : null}
                  <ul className="space-y-1">
                    {dbPaths.map((path, index) => (
                      <li key={path} className="flex items-center justify-between p-2 border rounded-md bg-muted/20">
                        <span className="font-mono text-sm">{path}</span>
                        <div className="space-x-1">
                           <Button variant="ghost" size="icon" onClick={() => handleOpenEditModal(path, index)} title="Edit Path">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" title="Delete Path Reference">
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action will remove the database path reference '{path}' from this list.
                                  It will **not** delete the actual data AT this path in your Firebase database, only its reference in the managed paths list.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeletePath(path)} className="bg-destructive hover:bg-destructive/90">Delete Path Reference</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {editingPath && (
          <Dialog open={!!editingPath} onOpenChange={(isOpen) => { if (!isOpen) setEditingPath(null); }}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Path</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={editingPath.value}
                  onChange={(e) => setEditingPath({ ...editingPath, value: e.target.value })}
                  placeholder="Database Path"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingPath(null)}>Cancel</Button>
                <Button onClick={handleSaveEditedPath}><Save className="h-4 w-4 mr-2" />Save Path</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {showUploadSection && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UploadCloud className="h-6 w-6 mr-2 text-primary" />
                Data Upload Section
              </CardTitle>
              <CardDescription>Upload data via JSON or form. Selected path for uploads: <code className="font-semibold">{selectedDbPath || "No path selected"}</code> (usually 'articles').</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="json">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="json"><FileJson className="h-4 w-4 mr-1" />By JSON</TabsTrigger>
                  <TabsTrigger value="form"><FileText className="h-4 w-4 mr-1" />By Form (Add Single)</TabsTrigger>
                  <TabsTrigger value="instructions"><Info className="h-4 w-4 mr-1" />Instructions</TabsTrigger>
                </TabsList>

                <TabsContent value="json">
                  <form onSubmit={handleJsonUpload}>
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle>Upload JSON Data</CardTitle>
                        <CardDescription>Paste JSON data below. For articles, this should be an object where keys are unique IDs and values are article objects, or an array of article objects if you intend to completely replace the data at the path. When pushing individual articles (e.g. using the form tab), Firebase generates unique IDs. If you paste an array and use `set` on the '/articles' path, it will store it as an array (0, 1, 2... keys) which is generally not recommended for Firebase lists. Prefer an object of objects if setting multiple items at once. </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Label htmlFor="jsonInput" className="font-semibold">JSON Data</Label>
                        <Textarea
                          id="jsonInput"
                          placeholder='Example for /articles: { "articleId1": { "title": "...", ... }, "articleId2": { ... } } or an array [ { "title": "...", ... } ] to set the path directly.'
                          value={jsonInput}
                          onChange={(e) => setJsonInput(e.target.value)}
                          rows={10}
                          required
                          className="min-h-[200px] font-mono text-sm"
                        />
                        <p className="text-xs text-muted-foreground">Ensure your JSON is valid.</p>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" disabled={isLoading || !selectedDbPath || isPathsLoading}>
                          {isLoading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" />Uploading...</> : 'Upload JSON'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </TabsContent>

                <TabsContent value="form">
                  <form onSubmit={handleFormUpload}>
                    <Card className="border-dashed">
                      <CardHeader>
                        <CardTitle>Upload Single Article by Form</CardTitle>
                        <CardDescription>Fill out the form below. The article will be added with a new unique ID under the selected path (e.g., '/articles'). The 'categoryName' will be derived automatically based on the 'categorySlug'.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label htmlFor="title">Title (Required)</Label>
                          <Input id="title" name="title" value={articleForm.title || ''} onChange={handleArticleFormChange} required />
                        </div>
                        <div>
                          <Label htmlFor="summary">Summary</Label>
                          <Textarea id="summary" name="summary" value={articleForm.summary || ''} onChange={handleArticleFormChange} rows={3} />
                        </div>
                        <div>
                          <Label htmlFor="content">Content</Label>
                          <Textarea id="content" name="content" value={articleForm.content || ''} onChange={handleArticleFormChange} rows={6} />
                        </div>
                        <div>
                          <Label htmlFor="imageUrl">Image URL (Optional, defaults to placeholder)</Label>
                          <Input id="imageUrl" name="imageUrl" value={articleForm.imageUrl || ''} onChange={handleArticleFormChange} placeholder="https://placehold.co/600x400.png" />
                        </div>
                        <div>
                          <Label htmlFor="dataAiHint">Image AI Hint (Optional)</Label>
                          <Input id="dataAiHint" name="dataAiHint" value={articleForm.dataAiHint || ''} onChange={handleArticleFormChange} placeholder="e.g. technology abstract" />
                        </div>
                        <div>
                          <Label htmlFor="categorySlug">Category Slug (Required)</Label>
                          <Input id="categorySlug" name="categorySlug" value={articleForm.categorySlug || ''} onChange={handleArticleFormChange} placeholder="e.g. politics" required />
                        </div>
                        <div>
                          <Label htmlFor="author">Author (Optional, defaults to 'Admin')</Label>
                          <Input id="author" name="author" value={articleForm.author || ''} onChange={handleArticleFormChange} />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button type="submit" disabled={isLoading || !selectedDbPath || isPathsLoading}>
                          {isLoading ? <><Loader2 className="animate-spin h-4 w-4 mr-2" />Submitting...</> : 'Submit Article'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </form>
                </TabsContent>

                <TabsContent value="instructions">
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle>JSON Data Structure Instructions</CardTitle>
                      <CardDescription>If uploading to a path like '/articles' to overwrite all articles, use an object where keys are unique article IDs (or Firebase will create numeric keys if you use an array, which is not ideal for lists). For adding a single article via the form, Firebase will generate the unique ID.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto">
                        <code>{exampleJsonStructureForUpload.trim()}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {showDataStructureSection && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Binary className="h-6 w-6 mr-2 text-primary" />
                Single Article Data Structure (Expected in Firebase)
              </CardTitle>
              <CardDescription>
                This shows the expected fields for a single news article object when stored in Firebase.
                The 'id' is the key of the article object (e.g., under '/articles/[id]').
                'categoryName' is derived from 'categorySlug' when data is fetched by the application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto max-h-[600px]">
                <code>{getSingleArticleStructureDescription()}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        <div className="mt-12">
          <h2 className="text-2xl font-headline font-semibold mb-4">Other Admin Tasks</h2>
          <p className="text-muted-foreground">
            Future administrative controls and settings can be added here.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
