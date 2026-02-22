import { useState } from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/tabs"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import { Label } from "../components/ui/label"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Separator } from "../components/ui/separator"
import { User, Lock, Palette, Bell } from "lucide-react"
import { useDispatch } from "react-redux";
import { changePassword } from "../features/slice/userSlice";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ---------------------------------- */
/* Reusable Toggle Row */
/* ---------------------------------- */
function SettingToggle({
    title,
    description,
    defaultChecked,
}) {
    return (
        <div className="flex items-start sm:items-center justify-between gap-3">
            <div className="min-w-0">
                <p className="font-medium text-sm sm:text-base">{title}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                    {description}
                </p>
            </div>
            <Switch defaultChecked={defaultChecked} className="shrink-0" />
        </div>
    )
}

export default function Settings() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentPassword, setcurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    async function handlePassword() {
        const result = await dispatch(changePassword({ currentPassword, newPassword }));

        if (changePassword.fulfilled.match(result)) {
            toast.success(result.payload.message);
            navigate("/login");
        }
    }

    return (
        <div className="max-w-4xl">
            <Tabs defaultValue="profile" className="flex flex-col gap-5">
                {/* ---------------------------------- */}
                {/* Tabs */}
                {/* ---------------------------------- */}
                <TabsList className="w-full gap-3">
                    <TabsTrigger value="profile">
                        <User className="w-5 h-5" />
                        <span className="hidden sm:inline">Account</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                        <Bell className="w-5 h-5" />
                        <span className="hidden sm:inline">Alerts</span>
                    </TabsTrigger>
                    <TabsTrigger value="security">
                        <Lock className="w-5 h-5" />
                        <span className="hidden sm:inline">Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="appearance">
                        <Palette className="w-5 h-5" />
                        <span className="hidden sm:inline">Theme</span>
                    </TabsTrigger>
                </TabsList>

                {/* ---------------------------------- */}
                {/* Profile */}
                {/* ---------------------------------- */}
                <TabsContent value="profile">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your personal details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-5">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input defaultValue="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input defaultValue="Admin" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value="admin@lms.com" disabled />
                                <p className="text-xs text-muted-foreground">
                                    Contact support to change email
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button className="w-full sm:w-auto">
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ---------------------------------- */}
                {/* Notifications */}
                {/* ---------------------------------- */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                                Choose what alerts you receive
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingToggle
                                title="Email Notifications"
                                description="Account related updates"
                                defaultChecked
                            />
                            <Separator />
                            <SettingToggle
                                title="New Enrollments"
                                description="When students enroll"
                                defaultChecked
                            />
                            <Separator />
                            <SettingToggle
                                title="Course Completions"
                                description="When students finish courses"
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ---------------------------------- */}
                {/* Security */}
                {/* ---------------------------------- */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Current Password</Label>
                                <Input type="password" value={currentPassword} onChange={(e) => setcurrentPassword(e.target.value)} />
                            </div>

                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 8 characters
                                </p>
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={handlePassword}
                                >
                                    Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* ---------------------------------- */}
                {/* Appearance */}
                {/* ---------------------------------- */}
                <TabsContent value="appearance">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme & Display</CardTitle>
                            <CardDescription>
                                Customize dashboard appearance
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <SettingToggle
                                title="Compact Mode"
                                description="Reduce spacing in UI"
                            />
                            <Separator />
                            <SettingToggle
                                title="Enable Animations"
                                description="Smooth interface transitions"
                                defaultChecked
                            />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
