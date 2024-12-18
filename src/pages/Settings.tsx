import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useSettings } from '@/contexts/SettingsContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

const Settings = () => {
  const navigate = useNavigate()
  const { settings, updateSettings } = useSettings()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#343541] text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/chat")}
          className="mb-6 text-white/90 hover:text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Button>

        <Card className="bg-[#2D2D30] border-[#4D4D4F] text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-2">
              <Label className="text-white/90">Theme Mode</Label>
              <Select 
                value={settings.theme}
                onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
              >
                <SelectTrigger className="bg-[#202123] border-[#4D4D4F] text-white/90 hover:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#202123] border-[#4D4D4F] text-white/90">
                  <SelectItem value="light" className="hover:bg-white/10">Light Mode</SelectItem>
                  <SelectItem value="dark" className="hover:bg-white/10">Dark Mode</SelectItem>
                  <SelectItem value="system" className="hover:bg-white/10">System Default</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-white/60">Choose your preferred color theme</p>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label className="text-white/90">Text Size</Label>
              <Select 
                value={settings.fontSize}
                onValueChange={(value) => updateSettings({ fontSize: value as 'small' | 'medium' | 'large' })}
              >
                <SelectTrigger className="bg-[#202123] border-[#4D4D4F] text-white/90 hover:text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#202123] border-[#4D4D4F] text-white/90">
                  <SelectItem value="small" className="hover:bg-white/10">Small (14px)</SelectItem>
                  <SelectItem value="medium" className="hover:bg-white/10">Medium (16px)</SelectItem>
                  <SelectItem value="large" className="hover:bg-white/10">Large (18px)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-white/60">Adjust the size of text throughout the app</p>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white/90">Push Notifications</Label>
                <div className="text-sm text-white/60">
                  Receive notifications about updates
                </div>
              </div>
              <Switch 
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
                className="data-[state=checked]:bg-[#9b87f5]"
              />
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-white/90">Offline Storage</Label>
                <div className="text-sm text-white/60">
                  Automatically save conversations offline
                </div>
              </div>
              <Switch 
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
                className="data-[state=checked]:bg-[#9b87f5]"
              />
            </div>

            {/* Account Info */}
            <div className="pt-6 border-t border-[#4D4D4F]">
              <h3 className="text-lg font-medium mb-4 text-white/90">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Email Address</span>
                  <span className="text-white/90">{user?.email || 'Not available'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Current Plan</span>
                  <span className="text-white/90">{user?.user_metadata?.subscription_plan || 'Free Trial'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Available Queries</span>
                  <span className="text-white/90">{user?.user_metadata?.query_count || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Settings