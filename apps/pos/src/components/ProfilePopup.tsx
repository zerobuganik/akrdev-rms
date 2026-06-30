import { useState } from 'react'
import { apiClient } from '@/lib/apiClient'
import { resolveImageUrl } from '@/lib/imageBaseUrl'
import { useAuthStore } from '@/stores/useAuthStore'
import { toast } from '@/stores/useToastStore'
import { X, Camera } from 'lucide-react'

interface ProfilePopupProps {
  onClose: () => void
}

export function ProfilePopup({ onClose }: ProfilePopupProps) {
  const { user, updateUser } = useAuthStore()
  const [name, setName] = useState(user?.name ?? '')
  const [phone, setPhone] = useState(user?.phone ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pin, setPin] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState<'profile' | 'password' | 'pin' | null>(null)

  const avatarSrc = resolveImageUrl(user?.imageUrl)

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const { data } = await apiClient.post('/auth/upload-image', { image: reader.result })
        updateUser({ ...user!, imageUrl: data.imageUrl })
        toast('Profile image updated', 'success')
      } catch {
        toast('Image upload failed', 'error')
      } finally {
        setUploading(false)
      }
    }
    reader.onerror = () => {
      setUploading(false)
      toast('Failed to read image', 'error')
    }
    reader.readAsDataURL(file)
  }

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast('Name is required', 'error')
      return
    }

    if (phone !== user?.phone) {
      const { data: check } = await apiClient.post('/auth/check-phone', { phone })
      if (check.exists) {
        toast('Phone number already exists. Contact admin.', 'error')
        return
      }
    }

    setSaving('profile')
    try {
      const { data } = await apiClient.post('/auth/update-profile', { name, phone })
      updateUser(data)
      toast('Profile updated successfully', 'success')
    } catch {
      toast('Failed to update profile', 'error')
    } finally {
      setSaving(null)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast('Both fields are required', 'error')
      return
    }
    if (newPassword.length < 4) {
      toast('Password must be at least 4 characters', 'error')
      return
    }

    setSaving('password')
    try {
      await apiClient.post('/auth/change-password', { currentPassword, newPassword })
      toast('Password changed successfully', 'success')
      setCurrentPassword('')
      setNewPassword('')
    } catch {
      toast('Failed to change password', 'error')
    } finally {
      setSaving(null)
    }
  }

  const handleSetPin = async () => {
    if (!/^\d{4}$/.test(pin)) {
      toast('PIN must be exactly 4 digits', 'error')
      return
    }

    setSaving('pin')
    try {
      await apiClient.post('/auth/set-pin', { pin })
      toast('PIN updated successfully', 'success')
      setPin('')
    } catch {
      toast('Failed to set PIN', 'error')
    } finally {
      setSaving(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="mx-4 w-full max-w-md rounded-xl bg-background shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b px-5 py-4">
          <h2 className="text-lg font-semibold">Edit Profile</h2>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5">
          {/* Profile Image */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span>{user?.name?.[0] ?? 'U'}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow hover:bg-primary/90">
                <Camera size={14} />
                <input type="file" accept="image/png,image/jpeg,image/gif,image/webp" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
          </div>

          {/* Name */}
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-sm font-medium">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
            {phone !== user?.phone && (
              <p className="mt-1 text-xs text-amber-600">Changing phone will update your login ID.</p>
            )}
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={saving === 'profile'}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {saving === 'profile' ? 'Saving...' : 'Save Profile'}
          </button>

          <hr />

          {/* Change Password */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Change Password</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
              </div>
              <button
                onClick={handleChangePassword}
                disabled={saving === 'password'}
                className="w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {saving === 'password' ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </div>

          <hr />

          {/* Set PIN */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Set / Update PIN</h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">4-Digit PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                  inputMode="numeric"
                />
              </div>
              <button
                onClick={handleSetPin}
                disabled={saving === 'pin'}
                className="w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {saving === 'pin' ? 'Setting...' : 'Set PIN'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
