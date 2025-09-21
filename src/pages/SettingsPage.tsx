import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import { useWeb3 } from "../hooks/useWeb3";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Radio from "../components/ui/Radio";
import Dropdown from "../components/ui/Dropdown";
import {
  User,
  Bell,
  Shield,
  Palette,
  Key,
  Save,
  AlertTriangle,
  Settings as SettingsIcon,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from "lucide-react";

const SettingsPage: React.FC = () => {
  const { state, addNotification, toggleTheme } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const { disconnectWallet } = useWeb3();

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    displayName: state.user?.name || "",
    email: "",
    bio: state.user?.bio,
    website: state.user?.website,
    twitter: state.user?.twitter,
    linkedin: state.user?.linkedin,
    publicProfile: true,
    showEmail: false,
    showWallet: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    courseUpdates: true,
    newMessages: true,
    marketingEmails: false,
    weeklyDigest: true,
    achievementAlerts: true,
    paymentAlerts: true,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: "public",
    showProgress: true,
    showCertificates: true,
    showEnrollments: false,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: true,
    analyticsTracking: false,
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "24h",
    passwordLastChanged: new Date("2025-01-01"),
    trustedDevices: 2,
  });

  // App Settings
  const [appSettings, setAppSettings] = useState({
    language: "en",
    timezone: "UTC",
    currency: "KAIA",
    soundEnabled: true,
    animationsEnabled: true,
    autoPlay: false,
    qualityPreference: "auto",
  });

  const handleSaveProfile = () => {
    addNotification({
      type: "success",
      title: "Profile Updated",
      message: "Your profile settings have been saved successfully",
    });
  };

  const handleSaveNotifications = () => {
    addNotification({
      type: "success",
      title: "Notifications Updated",
      message: "Your notification preferences have been saved",
    });
  };

  const handleSavePrivacy = () => {
    addNotification({
      type: "success",
      title: "Privacy Updated",
      message: "Your privacy settings have been saved",
    });
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      addNotification({
        type: "success",
        title: "Account Deletion Requested",
        message: "Your account deletion request has been submitted",
      });
    }
  };

  const privacyOptions = [
    { value: "public", label: "Public - Anyone can view your profile" },
    { value: "private", label: "Private - Only you can view your profile" },
    { value: "friends", label: "Friends Only - Only connections can view" },
  ];

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" },
    { value: "de", label: "Deutsch" },
    { value: "zh", label: "中文" },
    { value: "ja", label: "日本語" },
  ];

  const timezoneOptions = [
    { value: "UTC", label: "UTC (Coordinated Universal Time)" },
    { value: "EST", label: "EST (Eastern Standard Time)" },
    { value: "PST", label: "PST (Pacific Standard Time)" },
    { value: "GMT", label: "GMT (Greenwich Mean Time)" },
    { value: "CET", label: "CET (Central European Time)" },
    { value: "JST", label: "JST (Japan Standard Time)" },
  ];

  if (!isConnected) {
    return (
      <div className="text-center py-16 cyber-card border-cyber rounded-xl max-w-md mx-auto">
        <SettingsIcon className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
        <h2 className="text-2xl font-semibold mb-4 text-white font-cyber neon-text-cyan">Connect Your Wallet</h2>
        <p className="mb-6 text-cyan-100">
          You need to connect your wallet to access <span className="text-cyber-primary font-semibold">settings</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cyber Header */}
      <div>
        <h1 className="text-3xl font-bold text-white font-cyber neon-text-cyan">⚙️ Settings</h1>
        <p className="text-cyan-100 mt-2">
          Manage your <span className="text-cyber-primary font-semibold">account preferences</span> and 
          <span className="text-neon-orange font-semibold"> privacy settings</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Cyber Settings Navigation */}
        <div className="lg:col-span-1">
          <nav className="space-y-2">
            <a
              href="#profile"
              className="flex items-center space-x-3 px-4 py-3 cyber-card border-cyber cyber-glow text-cyber-primary bg-cyber-primary/10 rounded-lg font-cyber"
            >
              <User className="h-5 w-5 animate-cyber-pulse" />
              <span className="neon-text-cyan">Profile</span>
            </a>
            <a
              href="#notifications"
              className="flex items-center space-x-3 px-4 py-3 text-cyan-100 hover:text-cyber-primary hover:cyber-glow cyber-card border-cyber/30 rounded-lg transition-all duration-300 font-cyber"
            >
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </a>
            <a
              href="#privacy"
              className="flex items-center space-x-3 px-4 py-3 text-cyan-100 hover:text-cyber-primary hover:cyber-glow cyber-card border-cyber/30 rounded-lg transition-all duration-300 font-cyber"
            >
              <Shield className="h-5 w-5" />
              <span>Privacy</span>
            </a>
            <a
              href="#security"
              className="flex items-center space-x-3 px-4 py-3 text-cyan-100 hover:text-cyber-primary hover:cyber-glow cyber-card border-cyber/30 rounded-lg transition-all duration-300 font-cyber"
            >
              <Key className="h-5 w-5" />
              <span>Security</span>
            </a>
            <a
              href="#preferences"
              className="flex items-center space-x-3 px-4 py-3 text-cyan-100 hover:text-cyber-primary hover:cyber-glow cyber-card border-cyber/30 rounded-lg transition-all duration-300 font-cyber"
            >
              <Palette className="h-5 w-5" />
              <span>Preferences</span>
            </a>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 mt-8">
          {/* Profile Settings */}
          <section
            id="profile"
            className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-xl font-semibold text-white font-cyber neon-text-cyan">
                  👤 Profile Settings
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
              </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-cyber font-semibold text-cyber-primary mb-3 neon-text-cyan">
                    👤 Display Name
                  </label>
                  <input
                    type="text"
                    value={profileSettings.displayName}
                    onChange={(e) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-cyber font-semibold text-cyber-primary mb-3 neon-text-cyan">
                    📧 Email Address
                  </label>
                  <input
                    type="email"
                    value={profileSettings.email}
                    onChange={(e) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-cyber font-semibold text-cyber-primary mb-3 neon-text-cyan">
                  📝 Bio
                </label>
                <textarea
                  value={profileSettings.bio}
                  onChange={(e) =>
                    setProfileSettings((prev) => ({
                      ...prev,
                      bio: e.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-cyber font-semibold text-cyber-primary mb-3 neon-text-cyan">
                    🌐 Website
                  </label>
                  <input
                    type="url"
                    value={profileSettings.website}
                    onChange={(e) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        website: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-cyber font-semibold text-cyber-primary mb-3 neon-text-cyan">
                    🐦 Twitter
                  </label>
                  <input
                    type="text"
                    value={profileSettings.twitter}
                    onChange={(e) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        twitter: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-cyber font-semibold text-cyber-primary mb-3 neon-text-cyan">
                    💼 LinkedIn
                  </label>
                  <input
                    type="text"
                    value={profileSettings.linkedin}
                    onChange={(e) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        linkedin: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Profile Visibility
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={profileSettings.publicProfile}
                    onChange={(checked) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        publicProfile: checked,
                      }))
                    }
                    label="Make my profile public"
                  />
                  <Checkbox
                    checked={profileSettings.showEmail}
                    onChange={(checked) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        showEmail: checked,
                      }))
                    }
                    label="Show email address on profile"
                  />
                  <Checkbox
                    checked={profileSettings.showWallet}
                    onChange={(checked) =>
                      setProfileSettings((prev) => ({
                        ...prev,
                        showWallet: checked,
                      }))
                    }
                    label="Show wallet address on profile"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveProfile}
                  className="cyber-gradient-button cyber-glow px-6 py-3 rounded-lg font-cyber transition-all duration-300 hover:scale-105"
                >
                  <Save className="h-4 w-4 mr-2 animate-cyber-pulse" />
                  Save Profile
                </button>
              </div>
            </div>
            </div>
          </section>

          {/* Notification Settings */}
          <section
            id="notifications"
            className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-xl font-semibold text-white font-cyber neon-text-cyan">
                  🔔 Notification Settings
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
              </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  📧 Communication Preferences
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={notificationSettings.emailNotifications}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        emailNotifications: checked,
                      }))
                    }
                    label="Email notifications"
                  />
                  <Checkbox
                    checked={notificationSettings.pushNotifications}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        pushNotifications: checked,
                      }))
                    }
                    label="Push notifications"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  📚 Content Updates
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={notificationSettings.courseUpdates}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        courseUpdates: checked,
                      }))
                    }
                    label="Course updates and announcements"
                  />
                  <Checkbox
                    checked={notificationSettings.newMessages}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        newMessages: checked,
                      }))
                    }
                    label="New messages from instructors"
                  />
                  <Checkbox
                    checked={notificationSettings.achievementAlerts}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        achievementAlerts: checked,
                      }))
                    }
                    label="Achievement and certificate alerts"
                  />
                  <Checkbox
                    checked={notificationSettings.paymentAlerts}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        paymentAlerts: checked,
                      }))
                    }
                    label="Payment and transaction alerts"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Marketing
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={notificationSettings.marketingEmails}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        marketingEmails: checked,
                      }))
                    }
                    label="Marketing emails and promotions"
                  />
                  <Checkbox
                    checked={notificationSettings.weeklyDigest}
                    onChange={(checked) =>
                      setNotificationSettings((prev) => ({
                        ...prev,
                        weeklyDigest: checked,
                      }))
                    }
                    label="Weekly learning digest"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Notifications
                </Button>
              </div>
            </div>
            </div>
          </section>

          {/* Privacy Settings */}
          <section
            id="privacy"
            className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-xl font-semibold text-white font-cyber neon-text-cyan">
                  🛡️ Privacy Settings
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
              </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  👁️ Profile Visibility
                </h3>
                <Radio
                  options={privacyOptions}
                  value={privacySettings.profileVisibility}
                  onChange={(value) =>
                    setPrivacySettings((prev) => ({
                      ...prev,
                      profileVisibility: value,
                    }))
                  }
                  name="profileVisibility"
                />
              </div>

              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  📊 Learning Data
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={privacySettings.showProgress}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showProgress: checked,
                      }))
                    }
                    label="Show learning progress publicly"
                  />
                  <Checkbox
                    checked={privacySettings.showCertificates}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showCertificates: checked,
                      }))
                    }
                    label="Show earned certificates publicly"
                  />
                  <Checkbox
                    checked={privacySettings.showEnrollments}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showEnrollments: checked,
                      }))
                    }
                    label="Show course enrollments publicly"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  💬 Communication
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={privacySettings.allowMessages}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        allowMessages: checked,
                      }))
                    }
                    label="Allow messages from other users"
                  />
                  <Checkbox
                    checked={privacySettings.showOnlineStatus}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        showOnlineStatus: checked,
                      }))
                    }
                    label="Show online status"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Data Collection
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={privacySettings.dataCollection}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        dataCollection: checked,
                      }))
                    }
                    label="Allow data collection for service improvement"
                  />
                  <Checkbox
                    checked={privacySettings.analyticsTracking}
                    onChange={(checked) =>
                      setPrivacySettings((prev) => ({
                        ...prev,
                        analyticsTracking: checked,
                      }))
                    }
                    label="Allow analytics tracking"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSavePrivacy}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Privacy Settings
                </Button>
              </div>
            </div>
            </div>
          </section>

          {/* Security Settings */}
          <section
            id="security"
            className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-xl font-semibold text-white font-cyber neon-text-cyan">
                  🔐 Security Settings
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
              </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  🔒 Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button
                    variant={
                      securitySettings.twoFactorEnabled ? "outline" : "primary"
                    }
                  >
                    {securitySettings.twoFactorEnabled ? "Disable" : "Enable"}{" "}
                    2FA
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Login Security
                </h3>
                <div className="space-y-3">
                  <Checkbox
                    checked={securitySettings.loginAlerts}
                    onChange={(checked) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        loginAlerts: checked,
                      }))
                    }
                    label="Send alerts for new login attempts"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Connected Wallet
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Wallet Address</p>
                    <p className="text-sm text-gray-600 font-mono">{address}</p>
                  </div>
                  <Button variant="outline" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
            </div>
          </section>

          {/* App Preferences */}
          <section
            id="preferences"
            className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <h2 className="text-xl font-semibold text-white font-cyber neon-text-cyan">
                  🎨 App Preferences
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
              </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  🎨 Appearance
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {state.theme === "dark" ? (
                      <Moon className="h-5 w-5" />
                    ) : (
                      <Sun className="h-5 w-5" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">Theme</p>
                      <p className="text-sm text-gray-600">
                        Choose your preferred theme
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={toggleTheme}>
                    {state.theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <Dropdown
                    options={languageOptions}
                    value={appSettings.language}
                    onChange={(value) =>
                      setAppSettings((prev) => ({ ...prev, language: value }))
                    }
                    placeholder="Select language"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <Dropdown
                    options={timezoneOptions}
                    value={appSettings.timezone}
                    onChange={(value) =>
                      setAppSettings((prev) => ({ ...prev, timezone: value }))
                    }
                    placeholder="Select timezone"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white font-cyber neon-text-cyan mb-4">
                  🔊 Media Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {appSettings.soundEnabled ? (
                        <Volume2 className="h-5 w-5" />
                      ) : (
                        <VolumeX className="h-5 w-5" />
                      )}
                      <span>Sound Effects</span>
                    </div>
                    <Checkbox
                      checked={appSettings.soundEnabled}
                      onChange={(checked) =>
                        setAppSettings((prev) => ({
                          ...prev,
                          soundEnabled: checked,
                        }))
                      }
                    />
                  </div>
                  <Checkbox
                    checked={appSettings.animationsEnabled}
                    onChange={(checked) =>
                      setAppSettings((prev) => ({
                        ...prev,
                        animationsEnabled: checked,
                      }))
                    }
                    label="Enable animations"
                  />
                  <Checkbox
                    checked={appSettings.autoPlay}
                    onChange={(checked) =>
                      setAppSettings((prev) => ({ ...prev, autoPlay: checked }))
                    }
                    label="Auto-play videos"
                  />
                </div>
              </div>
            </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-white rounded-xl border border-red-200 p-6">
            <h2 className="text-xl font-semibold mb-6 text-red-900">
              Danger Zone
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">Delete Account</p>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all data
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDeleteAccount}
                  className="border-2 border-red-400/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 px-6 py-3 rounded-lg font-cyber transition-all duration-300"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
