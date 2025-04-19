"use client"

import { useState, useEffect } from "react"
import { getApplicationsOpenStatus, updateApplicationsOpenStatus } from "@/api/SettingsApi"
import { toast } from "@/components/hooks/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/shared/card"
import { Switch } from "@/components/shared/switch"
import { Label } from "@/components/shared/label"
import { Button } from "@/components/shared/button"
import { LoadingSpinner } from "@/components/shared/icons/loading-spinner"

export function ApplicationSettingsForm() {
  const [isApplicationsOpen, setIsApplicationsOpen] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [hasChanges, setHasChanges] = useState<boolean>(false)
  
  // Fetch current status
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getApplicationsOpenStatus() as any
        if (response?.statusCode === 200) {
          setIsApplicationsOpen(response.isOpen)
        }
      } catch (error) {
        toast({
          title: "Failed to load settings",
          description: "Could not fetch application settings. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchStatus()
  }, [])
  
  // Handle toggle change
  const handleToggleChange = (checked: boolean) => {
    setIsApplicationsOpen(checked)
    setHasChanges(true)
  }
  
  // Save changes
  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const response = await updateApplicationsOpenStatus(isApplicationsOpen) as any
      
      if (response?.statusCode === 200) {
        toast({
          title: "Settings updated",
          description: `Applications are now ${isApplicationsOpen ? 'open' : 'closed'}.`,
        })
        setHasChanges(false)
      } else {
        throw new Error("Failed to update settings")
      }
    } catch (error) {
      toast({
        title: "Failed to update settings",
        description: "Could not update application settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Settings</CardTitle>
        <CardDescription>
          Control whether users can submit new applications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Switch 
              id="applications-open" 
              checked={isApplicationsOpen}
              onCheckedChange={handleToggleChange}
            />
            <Label htmlFor="applications-open">
              {isApplicationsOpen ? "Applications are open" : "Applications are closed"}
            </Label>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={!hasChanges || isSaving}
        >
          {isSaving ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
} 