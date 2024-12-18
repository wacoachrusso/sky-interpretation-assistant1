import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft } from 'lucide-react'

const Settings = () => {
  const navigate = useNavigate()
  const [settings, setSettings] = useState({
    theme: 'dark',
    notifications: true,
    autoSave: true,
    fontSize: 'medium'
  })

  return (
    <div className="min-h-screen bg-[#343541] text-white p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/chat")}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Chat
        </Button>

        <Card className="bg-[#2D2D30] border-[#4D4D4F] text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select 
                value={settings.theme}
                onValueChange={(value) => setSettings(prev => ({ ...prev, theme: value }))}
              >
                <SelectTrigger className="bg-[#202123] border-[#4D4D4F]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#202123] border-[#4D4D4F]">
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Size */}
            <div className="space-y-2">
              <Label>Font Size</Label>
              <Select 
                value={settings.fontSize}
                onValueChange={(value) => setSettings(prev => ({ ...prev, fontSize: value }))}
              >
                <SelectTrigger className="bg-[#202123] border-[#4D4D4F]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#202123] border-[#4D4D4F]">
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notifications</Label>
                <div className="text-sm text-gray-400">
                  Receive notifications about updates
                </div>
              </div>
              <Switch 
                checked={settings.notifications}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, notifications: checked }))
                }
              />
            </div>

            {/* Auto Save */}
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto Save</Label>
                <div className="text-sm text-gray-400">
                  Automatically save conversations offline
                </div>
              </div>
              <Switch 
                checked={settings.autoSave}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoSave: checked }))
                }
              />
            </div>

            {/* Account Info */}
            <div className="pt-4 border-t border-[#4D4D4F]">
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email</span>
                  <span>user@example.com</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Plan</span>
                  <span>Free Trial</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Queries Remaining</span>
                  <span>2</span>
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