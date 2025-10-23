import { createFileRoute } from "@tanstack/react-router";
import { ContainerLayout } from "@/components/layout/container-layout";

// Card Components
import { MetricCard } from "@/components/blocks/cards/metric-card";
import { ProgressCard } from "@/components/blocks/cards/progress-card";
import { StatusCard } from "@/components/blocks/cards/status-card";
import { FeatureCard } from "@/components/blocks/cards/feature-card";
import { ActivityFeed } from "@/components/blocks/cards/activity-feed";
import { QuickStat } from "@/components/blocks/cards/quick-stats";
import { AlertShowcase } from "@/components/blocks/cards/alert-showcase";

// Button Components
import { ButtonShowcase } from "@/components/blocks/forms/button-showcase";

// Table Components
import { TableBasic } from "@/components/blocks/tables/table-basic";
import { TableWithCheckbox } from "@/components/blocks/tables/table-with-checkbox";
import {
  TableAdvanced,
  renderAvatar,
  renderStatus,
  renderDescription,
  renderContact,
  renderRating,
  defaultActions,
} from "@/components/blocks/tables/table-advanced";

// Form Components
import { FormInput } from "@/components/blocks/forms/form-input";
import { FormSelect } from "@/components/blocks/forms/form-select";
import { FormTextarea } from "@/components/blocks/forms/form-textarea";
import { FormCheckbox } from "@/components/blocks/forms/form-checkbox";
import { FormSwitch } from "@/components/blocks/forms/form-switch";
import { FormDatepicker } from "@/components/blocks/forms/form-datepicker";
import { FormSlider } from "@/components/blocks/forms/form-slider";
import { FormTags } from "@/components/blocks/forms/form-tags";
import { FormFileUpload } from "@/components/blocks/forms/form-file-upload";
import { FormSearch } from "@/components/blocks/forms/form-search";
import { FormMultiSelect } from "@/components/blocks/forms/form-multiselect";

// Icons
import {
  Users,
  Activity,
  DollarSign,
  BarChart3,
  CheckCircle,
  Wifi,
  Zap,
  Upload,
  Download,
  Eye,
  Edit,
  Trash,
  Heart,
  Play,
  Pause,
  RefreshCw,
  Bell,
  Copy,
  Share2,
  Bookmark,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Info,
  Lightbulb,
  Sparkles,
  Zap as BoltIcon,
} from "lucide-react";

// Hooks
import { useState } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToastHelpers } from "@/components/blocks/toast";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [likeCount, setLikeCount] = useState(42);
  const [clickCount, setClickCount] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([
    "react",
    "typescript",
    "nodejs",
  ]);
  const [volumeLevel, setVolumeLevel] = useState(75);
  const [qualityLevel, setQualityLevel] = useState(80);
  const [tags, setTags] = useState(["react", "typescript", "design"]);
  const toast = useToastHelpers();

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    toast.success(isLiked ? "Like removed!" : "Post liked!");
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    toast.info(
      isPlaying ? "Paused" : "Playing",
      `Media is now ${isPlaying ? "paused" : "playing"}`,
    );
  };

  const handleClick = () => {
    setClickCount((prev) => prev + 1);
    if ((clickCount + 1) % 10 === 0) {
      toast.success(
        `Milestone! 🎉`,
        `You've reached ${clickCount + 1} clicks!`,
      );
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.info(
      isBookmarked ? "Bookmark removed" : "Bookmarked!",
      `This item has been ${isBookmarked ? "removed from" : "added to"} your bookmarks.`,
    );
  };

  const handleRefresh = () => {
    setIsLoading(true);
    toast.loading(
      "Refreshing...",
      "Please wait while we refresh the content.",
      { duration: 0 },
    );
    setTimeout(() => {
      setIsLoading(false);
      toast.success(
        "Content refreshed!",
        "The content has been successfully refreshed.",
      );
    }, 2000);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied!", "Link copied to clipboard successfully.");
  };

  const handleShare = () => {
    toast.info(
      "Share",
      "Share dialog opened - you can share this content with others.",
    );
  };

  const handleNotification = () => {
    setNotificationCount(0);
    toast.success(
      "Notifications Cleared!",
      `All ${notificationCount} notifications have been cleared.`,
    );
  };

  const handleComment = () => {
    toast.info(
      "Comment Box",
      "Comment box opened - you can now leave your feedback.",
    );
  };

  const handleSuccess = () => {
    toast.success("Success!", "Operation completed successfully! ✅");
  };

  const handleError = () => {
    toast.error("Error!", "Something went wrong! ❌");
  };

  const handleWarning = () => {
    toast.warning("Warning!", "Please review your input! ⚠️");
  };

  const handleInfo = () => {
    toast.info("Info", "Here's some information ℹ️");
  };

  const handleMagic = () => {
    toast.custom("Magic! ✨", "Something magical just happened!", {
      icon: <Sparkles className="h-4 w-4" />,
      style: {
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        border: "none",
      },
    });
  };

  return (
    <ContainerLayout title="Design System Showcase">
      <div className="space-y-12">
        {/* Cards Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Cards & Charts</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Users"
              value="12,345"
              change={12.5}
              changeLabel="from last month"
              icon={<Users className="h-4 w-4 text-blue-600" />}
              trend="up"
            />
            <MetricCard
              title="Revenue"
              value="$45,678"
              change={8.7}
              changeLabel="from last month"
              icon={<DollarSign className="h-4 w-4 text-purple-600" />}
              trend="up"
            />
            <MetricCard
              title="Active Sessions"
              value="1,234"
              change={-2.3}
              changeLabel="from yesterday"
              icon={<Activity className="h-4 w-4 text-green-600" />}
              trend="down"
            />
            <MetricCard
              title="Conversion Rate"
              value="3.45%"
              change={0.8}
              changeLabel="from last week"
              icon={<BarChart3 className="h-4 w-4 text-orange-600" />}
              trend="up"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="space-y-6">
            <h3 className="text-xl font-semibold">Progress & Status Cards</h3>

            <ProgressCard
              title="Monthly Goal"
              value={75}
              label="$37,500 of $50,000"
              description="10 days left"
            />

            <ProgressCard
              title="Storage Usage"
              value={45}
              label="9GB of 20GB"
              description="11GB available"
            />

            <StatusCard
              title="System Status"
              status="Operational"
              description="All systems running"
              icon={<CheckCircle className="h-5 w-5 text-green-600" />}
              variant="success"
            />

            <StatusCard
              title="Connection"
              status="Stable"
              description="45ms response time"
              icon={<Wifi className="h-5 w-5 text-blue-600" />}
              variant="info"
            />
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-semibold">Feature & Activity Cards</h3>

            <FeatureCard
              icon={<BarChart3 className="h-5 w-5 text-orange-600" />}
              title="Analytics Dashboard"
              description="Track performance metrics and user behavior"
              buttonText="View Dashboard"
            />

            <FeatureCard
              icon={<Zap className="h-5 w-5 text-blue-600" />}
              title="Performance Monitor"
              description="Monitor system performance and identify bottlenecks"
              buttonText="Monitor Now"
              variant="outline"
            />

            <div className="space-y-4">
              <h4 className="text-lg font-medium">Activity Feed</h4>
              <ActivityFeed
                activities={[
                  {
                    id: "1",
                    title: "System backup completed",
                    description: "Daily backup completed successfully",
                    timestamp: "2 minutes ago",
                    variant: "success",
                  },
                  {
                    id: "2",
                    title: "New user registered",
                    description: "john.doe@example.com joined the platform",
                    timestamp: "15 minutes ago",
                    variant: "info",
                  },
                  {
                    id: "3",
                    title: "High CPU usage detected",
                    description: "Server CPU usage exceeded 80% threshold",
                    timestamp: "1 hour ago",
                    variant: "warning",
                  },
                ]}
              />
            </div>
          </section>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="space-y-6">
            <h3 className="text-xl font-semibold">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <QuickStat
                icon={<Eye className="h-4 w-4 text-blue-600" />}
                label="Page Views"
                value="89.2K"
                variant="blue"
              />
              <QuickStat
                icon={<Activity className="h-4 w-4 text-green-600" />}
                label="Click Rate"
                value="2.34%"
                variant="green"
              />
              <QuickStat
                icon={<Upload className="h-4 w-4 text-purple-600" />}
                label="Orders"
                value="1,234"
                variant="purple"
              />
              <QuickStat
                icon={<Download className="h-4 w-4 text-orange-600" />}
                label="Downloads"
                value="456"
                variant="orange"
              />
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-xl font-semibold">Alerts</h3>
            <AlertShowcase
              alerts={[
                {
                  id: "1",
                  type: "success",
                  title: "Success!",
                  message: "Your data has been saved successfully.",
                },
                {
                  id: "2",
                  type: "info",
                  title: "Information:",
                  message: "New features are available in the dashboard.",
                },
                {
                  id: "3",
                  type: "warning",
                  title: "Warning:",
                  message: "Storage usage is approaching its limit.",
                },
                {
                  id: "4",
                  type: "error",
                  title: "Error:",
                  message: "Failed to connect to the server.",
                },
                {
                  id: "5",
                  type: "loading",
                  title: "Loading:",
                  message: "Please wait while we process your request.",
                },
              ]}
            />
          </section>
        </div>

        {/* Interactive Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Interactive Buttons</h2>

          <div className="space-y-8">
            {/* Social Media Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Social Media Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleLike}
                  variant={isLiked ? "default" : "outline"}
                  className={
                    isLiked ? "bg-red-500 hover:bg-red-600 text-white" : ""
                  }
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`}
                  />
                  {likeCount}
                </Button>

                <Button onClick={handleComment} variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Comment
                </Button>

                <Button onClick={handleShare} variant="default">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>

                <Button
                  onClick={handleBookmark}
                  variant={isBookmarked ? "default" : "outline"}
                  className={
                    isBookmarked
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : ""
                  }
                >
                  <Bookmark
                    className={`h-4 w-4 mr-2 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  {isBookmarked ? "Saved" : "Save"}
                </Button>
              </div>
            </div>

            {/* Media Control Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Media Controls</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handlePlayPause}
                  size="lg"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isPlaying ? "Pause" : "Play"}
                </Button>

                <Button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  variant="outline"
                >
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                  />
                  {isLoading ? "Refreshing..." : "Refresh"}
                </Button>
              </div>
            </div>

            {/* Notification Actions */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Notification Actions
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleNotification}
                  variant="outline"
                  className="relative"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                  {notificationCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
                      {notificationCount}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={handleCopy} variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>

                <Button onClick={handleClick} variant="default">
                  <BoltIcon className="h-4 w-4 mr-2" />
                  Click Me ({clickCount})
                </Button>
              </div>
            </div>

            {/* Toast Notification Buttons */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Basic Toast Notifications
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleSuccess}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Success
                </Button>

                <Button onClick={handleError} variant="destructive">
                  <XCircle className="h-4 w-4 mr-2" />
                  Error
                </Button>

                <Button
                  onClick={handleWarning}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Warning
                </Button>

                <Button
                  onClick={handleInfo}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Info
                </Button>

                <Button
                  onClick={handleMagic}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Magic
                </Button>
              </div>
            </div>

            {/* Custom Toast Examples */}
            <div>
              <h3 className="text-xl font-semibold mb-4">
                Custom Toast Examples
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    toast.success(
                      "Payment Successful!",
                      "Your order #12345 has been confirmed and will be shipped soon.",
                      {
                        duration: 5000,
                      },
                    );
                  }}
                  variant="outline"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Success with Details
                </Button>

                <Button
                  onClick={() => {
                    toast.error(
                      "Upload Failed",
                      "The file exceeds the maximum size limit of 10MB.",
                      {
                        action: {
                          label: "Retry",
                          onClick: () => console.log("Retry upload"),
                        },
                      },
                    );
                  }}
                  variant="outline"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Error with Action
                </Button>

                <Button
                  onClick={() => {
                    toast.warning(
                      "Storage Warning",
                      "You've used 85% of your storage space. Consider upgrading your plan.",
                      {
                        duration: 8000,
                      },
                    );
                  }}
                  variant="outline"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Warning with Duration
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      "New Feature Available!",
                      "Check out our new dashboard analytics feature in the settings.",
                      {
                        icon: <Lightbulb className="h-4 w-4" />,
                      },
                    );
                  }}
                  variant="outline"
                >
                  <Info className="h-4 w-4 mr-2" />
                  Info with Custom Icon
                </Button>

                <Button
                  onClick={() => {
                    toast.loading(
                      "Processing...",
                      "Please wait while we process your request.",
                      {
                        duration: 0,
                      },
                    );
                  }}
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Loading Toast
                </Button>

                <Button
                  onClick={() => {
                    toast.custom(
                      "Custom Toast!",
                      "This is a completely custom toast with purple background.",
                      {
                        icon: <Sparkles className="h-4 w-4" />,
                        style: {
                          background:
                            "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          border: "none",
                        },
                      },
                    );
                  }}
                  variant="outline"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gradient Custom Toast
                </Button>
              </div>
            </div>

            {/* Position Examples */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Toast Positions</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    toast.info(
                      "Top Left Position",
                      "This toast appears in the top-left corner",
                      {
                        position: "top-left",
                        showIcon: true,
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  Top Left
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      "Top Right Position",
                      "This toast appears in the top-right corner",
                      {
                        position: "top-right",
                        showIcon: true,
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  Top Right
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      "Top Center Position",
                      "This toast appears in the top-center",
                      {
                        position: "top-center",
                        showIcon: true,
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  Top Center
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      "Bottom Left Position",
                      "This toast appears in the bottom-left corner",
                      {
                        position: "bottom-left",
                        showIcon: true,
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  Bottom Left
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      "Bottom Right Position",
                      "This toast appears in the bottom-right corner",
                      {
                        position: "bottom-right",
                        showIcon: true,
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  Bottom Right
                </Button>

                <Button
                  onClick={() => {
                    toast.info(
                      "Bottom Center Position",
                      "This toast appears in the bottom-center",
                      {
                        position: "bottom-center",
                        showIcon: true,
                      },
                    );
                  }}
                  variant="outline"
                  size="sm"
                >
                  Bottom Center
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Static Buttons Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Button Variants</h2>
          <ButtonShowcase />
        </section>

        {/* Tables Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Tables</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Basic Table</h3>
              <TableBasic
                data={[
                  {
                    id: "1",
                    name: "John Doe",
                    email: "john@example.com",
                    role: "Admin",
                  },
                  {
                    id: "2",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    role: "User",
                  },
                  {
                    id: "3",
                    name: "Bob Johnson",
                    email: "bob@example.com",
                    role: "Moderator",
                  },
                ]}
                columns={[
                  { key: "id", header: "ID" },
                  { key: "name", header: "Name" },
                  { key: "email", header: "Email" },
                  { key: "role", header: "Role" },
                ]}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Table with Checkbox
              </h3>
              <TableWithCheckbox
                data={[
                  {
                    id: "1",
                    name: "John Doe",
                    email: "john@example.com",
                    status: "Active",
                  },
                  {
                    id: "2",
                    name: "Jane Smith",
                    email: "jane@example.com",
                    status: "Active",
                  },
                  {
                    id: "3",
                    name: "Bob Johnson",
                    email: "bob@example.com",
                    status: "Inactive",
                  },
                ]}
                columns={[
                  { key: "name", header: "Name" },
                  { key: "email", header: "Email" },
                  { key: "status", header: "Status" },
                ]}
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Advanced Table with Custom Rendering (Reusable)
              </h3>
              <TableAdvanced
                data={[
                  {
                    id: "1",
                    name: "Sarah Johnson",
                    email: "sarah@example.com",
                    avatar:
                      "https://images.unsplash.com/photo-1494790108755-2616b912b886?w=32&h=32&fit=crop&crop=face",
                    title: "Senior Developer",
                    description:
                      "Full-stack developer with 5+ years of experience in React and Node.js. Passionate about building scalable applications.",
                    status: "active",
                    tags: ["React", "TypeScript", "Node.js"],
                    rating: 5,
                    phone: "+1 (555) 123-4567",
                    location: "San Francisco, CA",
                  },
                  {
                    id: "2",
                    name: "Michael Chen",
                    email: "michael@example.com",
                    avatar:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face",
                    title: "Product Designer",
                    description:
                      "UX/UI designer focused on creating intuitive and beautiful user interfaces. Specialized in mobile design.",
                    status: "premium",
                    tags: ["Figma", "UI Design", "Mobile"],
                    rating: 4,
                    phone: "+1 (555) 987-6543",
                    location: "New York, NY",
                  },
                  {
                    id: "3",
                    name: "Emily Rodriguez",
                    email: "emily@example.com",
                    avatar:
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face",
                    title: "Marketing Manager",
                    description:
                      "Digital marketing specialist with expertise in SEO, content marketing, and social media strategy.",
                    status: "active",
                    tags: ["Marketing", "SEO", "Content"],
                    rating: 4,
                    location: "Austin, TX",
                  },
                ]}
                columns={[
                  { key: "name", header: "User" },
                  { key: "description", header: "Information" },
                  { key: "status", header: "Status" },
                  { key: "rating", header: "Rating" },
                  { key: "contact", header: "Contact" },
                ]}
                renderers={{
                  avatar: renderAvatar,
                  description: renderDescription,
                  status: renderStatus,
                  rating: renderRating,
                  contact: renderContact,
                }}
                actions={[
                  {
                    ...defaultActions.view,
                    onClick: (row) => console.log("View user:", row),
                  },
                  {
                    ...defaultActions.edit,
                    onClick: (row) => console.log("Edit user:", row),
                  },
                  {
                    ...defaultActions.delete,
                    onClick: (row) => console.log("Delete user:", row),
                  },
                ]}
                bulkActions={[
                  {
                    label: "Export Selected",
                    icon: <Download className="h-4 w-4" />,
                    onClick: (selected) =>
                      console.log("Export selected:", selected),
                    variant: "outline",
                  },
                  {
                    label: "Delete Selected",
                    onClick: (selected) =>
                      console.log("Delete selected:", selected),
                    variant: "destructive",
                  },
                ]}
                showBulkActions
                selectionEnabled
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">
                Custom Table with Local Renderers + Pagination
              </h3>
              <TableAdvanced
                data={[
                  {
                    id: "1",
                    product: "Laptop Pro",
                    price: 1299,
                    stock: 15,
                    category: "Electronics",
                  },
                  {
                    id: "2",
                    product: "Wireless Mouse",
                    price: 29,
                    stock: 45,
                    category: "Accessories",
                  },
                  {
                    id: "3",
                    product: "USB-C Hub",
                    price: 59,
                    stock: 8,
                    category: "Accessories",
                  },
                  {
                    id: "4",
                    product: "Mechanical Keyboard",
                    price: 149,
                    stock: 12,
                    category: "Accessories",
                  },
                  {
                    id: "5",
                    product: "Monitor 4K",
                    price: 399,
                    stock: 5,
                    category: "Electronics",
                  },
                  {
                    id: "6",
                    product: "Webcam HD",
                    price: 79,
                    stock: 23,
                    category: "Electronics",
                  },
                  {
                    id: "7",
                    product: "Docking Station",
                    price: 199,
                    stock: 3,
                    category: "Accessories",
                  },
                ]}
                columns={[
                  { key: "product", header: "Product Name" },
                  { key: "price", header: "Price" },
                  { key: "stock", header: "Stock Status" },
                  { key: "category", header: "Category" },
                ]}
                renderers={{
                  price: (value) => (
                    <span className="font-bold text-green-600">${value}</span>
                  ),
                  stock: (value) => (
                    <span
                      className={
                        value > 20
                          ? "text-green-600"
                          : value > 10
                            ? "text-yellow-600"
                            : "text-red-600"
                      }
                    >
                      {value > 20
                        ? "In Stock"
                        : value > 10
                          ? "Low Stock"
                          : "Critical"}
                      <span className="ml-2 text-muted-foreground">
                        ({value} units)
                      </span>
                    </span>
                  ),
                  category: (value) => (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {value}
                    </span>
                  ),
                }}
                actions={[
                  {
                    label: "Edit",
                    icon: <Edit className="h-4 w-4" />,
                    onClick: (row) => console.log("Edit product:", row),
                    variant: "outline",
                  },
                  {
                    label: "Delete",
                    icon: <Trash className="h-4 w-4" />,
                    onClick: (row) => console.log("Delete product:", row),
                    variant: "destructive",
                  },
                ]}
                bulkActions={[
                  {
                    label: "Update Stock",
                    onClick: (selected) =>
                      console.log("Update stock for:", selected),
                    variant: "default",
                  },
                ]}
                showBulkActions
                selectionEnabled
                paginationEnabled
                currentPage={1}
                totalPages={3}
                pageSize={3}
                totalItems={7}
                onPageChange={(page) => console.log("Go to page:", page)}
              />
            </div>
          </div>
        </section>

        {/* Forms Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Forms</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Input Fields</h3>

              <FormInput
                id="text-input"
                label="Text Input"
                placeholder="Enter text here"
              />

              <FormInput
                id="email-input"
                label="Email Input"
                type="email"
                placeholder="email@example.com"
              />

              <FormInput
                id="password-input"
                label="Password with Toggle"
                type="password"
                placeholder="Enter password"
                showTogglePassword
              />

              <FormInput
                id="number-input"
                label="Number Input"
                type="number"
                placeholder="123"
              />

              <FormSearch
                id="search-input"
                label="Search Input"
                placeholder="Search users, projects..."
                onSearch={(value) => console.log("Searching for:", value)}
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Dropdown & Textarea</h3>

              <FormSelect
                id="role-select"
                label="Role Selection"
                placeholder="Select a role"
                options={[
                  { value: "admin", label: "Admin" },
                  { value: "user", label: "User" },
                  { value: "moderator", label: "Moderator" },
                ]}
              />

              <FormTextarea
                id="description"
                label="Description"
                placeholder="Enter your description here"
                rows={4}
              />

              <FormMultiSelect
                id="skills-multiselect"
                label="Skills (Multi-Select)"
                placeholder="Select skills..."
                searchPlaceholder="Search skills..."
                options={[
                  {
                    value: "react",
                    label: "React",
                    description: "JavaScript library for building UIs",
                  },
                  {
                    value: "typescript",
                    label: "TypeScript",
                    description: "Typed JavaScript",
                  },
                  {
                    value: "nodejs",
                    label: "Node.js",
                    description: "JavaScript runtime",
                  },
                  {
                    value: "python",
                    label: "Python",
                    description: "Programming language",
                  },
                  {
                    value: "docker",
                    label: "Docker",
                    description: "Container platform",
                  },
                  { value: "aws", label: "AWS", description: "Cloud services" },
                  {
                    value: "mongodb",
                    label: "MongoDB",
                    description: "NoSQL database",
                  },
                  {
                    value: "postgresql",
                    label: "PostgreSQL",
                    description: "SQL database",
                  },
                  {
                    value: "graphql",
                    label: "GraphQL",
                    description: "API query language",
                  },
                  {
                    value: "kubernetes",
                    label: "Kubernetes",
                    description: "Container orchestration",
                  },
                ]}
                value={selectedSkills}
                onChange={(values) => {
                  console.log("Selected skills:", values);
                  setSelectedSkills(values);
                }}
                searchable
                showSelectAll
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Controls</h3>

              <FormCheckbox id="terms" label="Accept terms and conditions" />

              <FormCheckbox
                id="newsletter"
                label="Subscribe to newsletter"
                description="Receive updates about new features"
              />

              <FormSwitch
                id="notifications"
                label="Push Notifications"
                description="Receive notifications on your device"
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Advanced Inputs</h3>

              <FormDatepicker
                id="birthday"
                label="Date Picker"
                placeholder="Select your birthday"
              />

              <FormSlider
                id="volume"
                label="Volume Control"
                value={[volumeLevel]}
                valueLabel={`Volume: ${volumeLevel}%`}
                min={0}
                max={100}
                onChange={(value) => setVolumeLevel(value[0])}
              />

              <FormSlider
                id="quality"
                label="Quality Settings"
                value={[qualityLevel]}
                valueLabel={`Quality: ${qualityLevel}%`}
                min={0}
                max={100}
                step={10}
                onChange={(value) => setQualityLevel(value[0])}
              />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Tags & File Upload</h3>

            <FormTags
              id="tags"
              label="Tags"
              placeholder="Add a tag"
              value={tags}
              onChange={(newTags) => {
                console.log("Tags changed:", newTags);
                setTags(newTags);
              }}
            />

            <FormFileUpload
              id="files"
              label="File Upload"
              fileTypes="all"
              multiple
            />

            <FormFileUpload
              id="images"
              label="Image Upload"
              fileTypes="image"
              multiple
            />

            <FormFileUpload
              id="documents"
              label="Document Upload"
              fileTypes="document"
              multiple={false}
            />
          </div>
        </section>
      </div>
    </ContainerLayout>
  );
}

export default Index;
