import { useState } from 'react';
import { useUploadNote } from '@/hooks/useQueries';
import { Subject, ExternalBlob } from '@/backend';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Camera, Upload, X, SwitchCamera } from 'lucide-react';
import { useCamera } from '@/camera/useCamera';
import { Progress } from '@/components/ui/progress';

interface NoteUploadProps {
  onNoteUploaded?: () => void;
}

export default function NoteUpload({ onNoteUploaded }: NoteUploadProps) {
  const [subject, setSubject] = useState<Subject | ''>('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showCamera, setShowCamera] = useState(false);
  const uploadNoteMutation = useUploadNote();

  const {
    isActive,
    isSupported,
    error: cameraError,
    isLoading: cameraLoading,
    currentFacingMode,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    retry,
    videoRef,
    canvasRef,
  } = useCamera({
    facingMode: 'environment',
    quality: 0.9,
    format: 'image/jpeg',
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCamera = async () => {
    setShowCamera(true);
    const success = await startCamera();
    if (!success) {
      toast.error('Failed to start camera');
    }
  };

  const handleCloseCamera = async () => {
    await stopCamera();
    setShowCamera(false);
  };

  const handleCapturePhoto = async () => {
    const file = await capturePhoto();
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      await stopCamera();
      setShowCamera(false);
      toast.success('Photo captured successfully!');
    } else {
      toast.error('Failed to capture photo');
    }
  };

  const handleSwitchCamera = async () => {
    const newMode = currentFacingMode === 'user' ? 'environment' : 'user';
    const success = await switchCamera(newMode);
    if (!success) {
      toast.error('Failed to switch camera');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setUploadProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject) {
      toast.error('Please select a subject');
      return;
    }

    if (!photoFile) {
      toast.error('Please capture or select a photo');
      return;
    }

    try {
      const arrayBuffer = await photoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      await uploadNoteMutation.mutateAsync({ subject, photo: blob });
      toast.success('Note uploaded successfully!');
      setSubject('');
      setPhotoFile(null);
      setPhotoPreview(null);
      setUploadProgress(0);
      onNoteUploaded?.();
    } catch (error) {
      toast.error('Failed to upload note. Please try again.');
      console.error('Upload error:', error);
    }
  };

  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Note</CardTitle>
        <CardDescription>Capture or upload a photo of your handwritten notes</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select value={subject} onValueChange={(value) => setSubject(value as Subject)}>
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Subject.Maths}>📐 Maths</SelectItem>
                <SelectItem value={Subject.Hindi}>📚 Hindi</SelectItem>
                <SelectItem value={Subject.English}>✍️ English</SelectItem>
                <SelectItem value={Subject.Science}>🔬 Science</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label>Note Photo</Label>

            {!showCamera && !photoPreview && (
              <div className="flex flex-col sm:flex-row gap-3">
                {isSupported !== false && (
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={handleOpenCamera}
                    disabled={cameraLoading}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Open Camera
                  </Button>
                )}
                <Button type="button" variant="outline" className="flex-1" asChild>
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Choose from Gallery
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </Button>
              </div>
            )}

            {showCamera && (
              <div className="space-y-4">
                <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                </div>

                {cameraError && (
                  <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm">
                    <p className="font-medium">Camera Error: {cameraError.type}</p>
                    <p>{cameraError.message}</p>
                    {cameraError.type === 'permission' && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={retry}
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={!isActive || cameraLoading}
                    className="flex-1"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Photo
                  </Button>
                  {isMobile && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleSwitchCamera}
                      disabled={!isActive || cameraLoading}
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={handleCloseCamera}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {photoPreview && (
              <div className="space-y-3">
                <div className="relative w-full bg-muted rounded-lg overflow-hidden">
                  <img
                    src={photoPreview}
                    alt="Note preview"
                    className="w-full h-auto max-h-96 object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={handleRemovePhoto}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} />
                    <p className="text-sm text-muted-foreground text-center">
                      Uploading: {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={uploadNoteMutation.isPending || !photoFile}
          >
            {uploadNoteMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload Note'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
