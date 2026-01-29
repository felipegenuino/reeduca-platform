'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Camera, User } from 'lucide-react';
import Image from 'next/image';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function AvatarUpload({ currentAvatarUrl, userId }: { currentAvatarUrl: string | null; userId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Formato não suportado. Use JPG, PNG ou WebP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError('Imagem muito grande. Máximo 2MB.');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Sessão expirada. Faça login novamente.');
        return;
      }

      // Nome do arquivo: {userId}-{timestamp}.{ext}
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;

      // Deletar avatar antigo se existir
      if (currentAvatarUrl) {
        const oldUrlParts = currentAvatarUrl.split('/avatars/');
        if (oldUrlParts.length > 1) {
          const oldFileName = oldUrlParts[1].split('?')[0];
          await supabase.storage.from('avatars').remove([oldFileName]);
        }
      }

      // Upload para Supabase Storage (upsert: true para substituir se existir)
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        // Se o bucket não existir, tenta criar (mas pode falhar por permissão)
        if (uploadError.message.includes('not found') || uploadError.message.includes('Bucket')) {
          setError('Bucket de avatares não configurado. Configure no Supabase Dashboard.');
        } else {
          setError(uploadError.message);
        }
        return;
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Atualizar avatar_url no profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Limpar preview e input
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      router.refresh();
    } catch (err) {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!currentAvatarUrl) return;

    setUploading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('Sessão expirada. Faça login novamente.');
        return;
      }

      // Remover do Storage (extrair nome do arquivo da URL)
      // URL format: https://xxx.supabase.co/storage/v1/object/public/avatars/{filename}
      const urlParts = currentAvatarUrl.split('/avatars/');
      if (urlParts.length > 1) {
        const fileName = urlParts[1].split('?')[0];
        const { error: removeError } = await supabase.storage.from('avatars').remove([fileName]);
        if (removeError) {
          console.error('Error removing old avatar:', removeError);
          // Continua mesmo se falhar ao remover do storage
        }
      }

      // Limpar avatar_url no profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      router.refresh();
    } catch (err) {
      setError('Algo deu errado. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const displayUrl = preview || currentAvatarUrl;

  return (
    <div className="pt-3 border-t border-[hsl(var(--border))] space-y-3">
      <div>
        <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
          Foto de perfil
        </label>
        <div className="flex items-center gap-4">
          {/* Avatar preview */}
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[hsl(var(--muted))] flex items-center justify-center shrink-0">
            {displayUrl ? (
              <Image
                src={displayUrl}
                alt="Avatar"
                fill
                className="object-cover"
                sizes="80px"
              />
            ) : (
              <User className="w-10 h-10 text-[hsl(var(--muted-foreground))]" />
            )}
          </div>

          {/* Upload controls */}
          <div className="flex-1 space-y-2">
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[hsl(var(--input))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] text-sm font-medium hover:bg-[hsl(var(--accent))] transition-colors duration-150 disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                {preview ? 'Trocar' : 'Escolher foto'}
              </button>
              {preview && (
                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] text-sm font-medium hover:opacity-90 transition-opacity duration-150 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Salvar'}
                </button>
              )}
              {currentAvatarUrl && !preview && (
                <button
                  type="button"
                  onClick={handleRemove}
                  disabled={uploading}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-[hsl(var(--destructive))] text-[hsl(var(--destructive))] text-sm font-medium hover:bg-[hsl(var(--destructive))]/10 transition-colors duration-150 disabled:opacity-50"
                >
                  Remover
                </button>
              )}
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              JPG, PNG ou WebP. Máximo 2MB.
            </p>
          </div>
        </div>
      </div>
      {error && (
        <p className="text-sm text-[hsl(var(--destructive))]" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
