import React, { useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useAppKit } from "@reown/appkit/react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import { usePagination } from "../hooks/usePagination";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Dropdown from "../components/ui/Dropdown";
import CourseEnrollmentModal from "../components/CourseEnrollmentModal";
import {
  BookOpen,
  Users,
  Award,
  Search,
  Filter,
  Star,
  Clock,
  Play,
  ChevronDown,
  Grid3X3,
  List,
} from "lucide-react";
import { Course } from "../types";

const CoursesPage: React.FC = () => {
  const { coursesEnrolled, stats } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { open } = useAppKit();
  const { isConnected } = useAppKitAccount();
  const { getCourses } = useSupabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [selectedCourseForEnrollment, setSelectedCourseForEnrollment] =
    useState<Course | null>(null);
  const [searchParams, _setSearchParams] = useSearchParams();

  // Check for creator filter from navigation state
  React.useEffect(() => {
    if (location.state?.creatorFilter) {
      setCreatorFilter(location.state.creatorFilter);
      setShowFilters(true);
    }
  }, [location.state]);

  // Pagination for courses
  const {
    items: courses,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
  } = usePagination({
    fetchFunction: async (page: number, limit: number) => {
      const filters = {
        search: searchTerm,
        category: selectedCategory === "all" ? undefined : selectedCategory,
        level:
          selectedLevel === "all"
            ? undefined
            : (selectedLevel as "Beginner" | "Intermediate" | "Advanced"),
        creatorId: creatorFilter || undefined,
        sortBy: sortBy,
      };
      return await getCourses(
        page,
        limit,
        filters,
        searchParams.get("creator")
      );
    },
    limit: 12,
    dependencies: [
      searchTerm,
      selectedCategory,
      selectedLevel,
      creatorFilter,
      sortBy,
    ],
  });

  const { loadingRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 200,
  });

  const categories = [
    "all",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Data Science",
    "Photography",
    "Music",
    "Language Learning",
  ];

  const levels = ["all", "Beginner", "Intermediate", "Advanced"];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
    { value: "popular", label: "Most Popular" },
    { value: "duration_short", label: "Duration: Short to Long" },
    { value: "duration_long", label: "Duration: Long to Short" },
    { value: "alphabetical", label: "A to Z" },
  ];

  const handleCourseClick = (course: Course) => {
    navigate(`/app/courses/${course.id}`);
  };

  const handleEnrollClick = (e: React.MouseEvent, courseId: string) => {
    e.stopPropagation();
    const course = courses.find((c) => c.id === courseId);
    if (course) {
      setSelectedCourseForEnrollment(course);
      setShowEnrollmentModal(true);
    }
  };

  const handleEnrollmentSuccess = () => {
    // Refresh courses to update enrollment status
    reset();
  };

  const isEnrolled = (courseId: string) => {
    return coursesEnrolled.some(
      (enrollment) => enrollment.course?.id === courseId
    );
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = coursesEnrolled.find((e) => e.course?.id === courseId);
    return enrollment?.progress || 0;
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Cyber Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-dark via-cyber-dark/95 to-black"></div>
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-primary/20 rounded-full blur-3xl animate-cyber-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-neon-cyan/20 rounded-full blur-3xl animate-quantum-float"></div>
      </div>
      
      <div className="relative z-10 space-y-8 p-6">
        {/* Cyber Hero Section */}
        <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-2xl p-8 relative overflow-hidden">
          {/* Holographic Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/10 via-neon-cyan/5 to-cyber-secondary/10 animate-holographic"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
          
          <div className="relative z-10 max-w-4xl">
            {/* Cyber Badge */}
            <div className="inline-flex items-center space-x-2 cyber-badge mb-6">
              <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
              <span className="text-cyber-primary font-cyber text-sm font-semibold neon-text-cyan">COURSE CATALOG</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white font-cyber neon-text-cyan holographic">
              Discover <span className="text-cyber-primary">Amazing</span> Courses
            </h1>
            <p className="text-lg text-cyan-100 mb-8 font-semibold">
              <span className="text-cyber-primary">Master new skills</span> from industry experts. 
              Earn <span className="text-neon-orange font-bold">NFT certificates</span> and build your 
              <span className="text-cyber-primary">career</span> in any field.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="cyber-card border-cyber hover:cyber-glow group transition-all duration-300 rounded-lg px-3 py-2">
                <div className="flex items-center justify-center">
                  <span className="font-cyber text-white font-medium text-sm">
                    <span className="text-cyber-primary neon-text-cyan">{stats.totalCourses.toLocaleString()}+</span> Courses
                  </span>
                </div>
              </div>
              <div className="cyber-card border-cyber hover:cyber-glow group transition-all duration-300 rounded-lg px-3 py-2">
                <div className="flex items-center justify-center">
                  <span className="font-cyber text-white font-medium text-sm">
                    <span className="text-cyber-primary neon-text-cyan">{stats.totalStudents}</span> Students
                  </span>
                </div>
              </div>
              <div className="cyber-card border-cyber hover:cyber-glow group transition-all duration-300 rounded-lg px-3 py-2">
                <div className="flex items-center justify-center">
                  <span className="font-cyber text-white font-medium text-sm">
                    <span className="text-cyber-primary neon-text-cyan">{stats.totalCertificates}</span> NFT Certificates
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cyber Connect Wallet Prompt */}
        {!isConnected && (
          <div className="cyber-card border-cyber hover:cyber-glow-orange transition-all duration-500 rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-neon-orange/10 via-transparent to-neon-orange/10"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-orange to-transparent animate-data-stream"></div>
            
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neon-orange mb-2 font-cyber neon-text-orange">
                  🔗 Connect Your Wallet to Get Started
                </h3>
                <p className="text-cyan-100">
                  Connect your wallet to <span className="text-cyber-primary font-semibold">enroll in courses</span>, 
                  track progress, and earn <span className="text-neon-orange font-semibold">NFT certificates</span>.
                </p>
              </div>
              <button
                onClick={() => open()}
                className="cyber-gradient-button cyber-glow-orange font-cyber px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}

        {/* Cyber Search and Filters */}
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-cyber-primary animate-cyber-pulse" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-sm bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300 backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-primary/5 via-transparent to-cyber-primary/5 pointer-events-none"></div>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 px-4 py-2 text-sm cyber-card border-cyber hover:cyber-glow font-cyber text-cyber-primary rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Filter className="h-4 w-4 animate-cyber-pulse" />
              <span className="neon-text-cyan">Filters</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {showFilters && (
            <div className="cyber-card border-cyber rounded-lg p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/5 via-neon-cyan/5 to-cyber-secondary/5 animate-holographic"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
              
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                    📂 Category
                  </label>
                  <div className="cyber-card border-cyber/50 rounded-lg">
                    <Dropdown
                      options={categories.map((cat) => ({
                        value: cat,
                        label: cat === "all" ? "All Categories" : cat,
                      }))}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                    ⚡ Level
                  </label>
                  <div className="cyber-card border-cyber/50 rounded-lg">
                    <Dropdown
                      options={levels.map((level) => ({
                        value: level,
                        label: level === "all" ? "All Levels" : level,
                      }))}
                      value={selectedLevel}
                      onChange={setSelectedLevel}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                    🔄 Sort By
                  </label>
                  <div className="cyber-card border-cyber/50 rounded-lg">
                    <Dropdown
                      options={sortOptions}
                      value={sortBy}
                      onChange={setSortBy}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Cyber Courses Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-white font-cyber neon-text-cyan">
              {searchTerm || selectedCategory !== "all" || selectedLevel !== "all"
                ? "🔍 Search Results"
                : "📚 All Courses"}
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
          </div>

          {error ? (
            <div className="text-center py-12 cyber-card border-cyber rounded-xl">
              <div className="text-neon-orange font-cyber text-lg mb-4">⚠️ Failed to load courses</div>
              <button
                onClick={reset}
                className="cyber-gradient-button cyber-glow px-6 py-3 rounded-lg font-cyber transition-all duration-300 hover:scale-105"
              >
                🔄 Try Again
              </button>
            </div>
          ) : courses.length === 0 && !loading ? (
            <div className="text-center py-12 cyber-card border-cyber rounded-xl">
              <BookOpen className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
              <p className="text-lg mb-2 text-white font-cyber">🔍 No courses found</p>
              <p className="text-cyan-100">Try adjusting your search or filters</p>
            </div>
          ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-cyan-100 font-cyber">
                <span className="text-cyber-primary neon-text-cyan font-semibold">{courses.length}</span> course{courses.length !== 1 ? "s" : ""} found
              </p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === "grid"
                      ? "cyber-card border-cyber cyber-glow text-cyber-primary"
                      : "cyber-card border-cyber/30 text-cyan-400 hover:text-cyber-primary hover:border-cyber/50"
                  }`}
                >
                  <Grid3X3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-3 rounded-lg transition-all duration-300 ${
                    viewMode === "list"
                      ? "cyber-card border-cyber cyber-glow text-cyber-primary"
                      : "cyber-card border-cyber/30 text-cyan-400 hover:text-cyber-primary hover:border-cyber/50"
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {courses.map((course) => {
                const enrolled = isEnrolled(course.id);
                const progress = getEnrollmentProgress(course.id);

                return viewMode === "grid" ? (
                  /* Grid View */
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="group cursor-pointer cyber-card border-cyber hover:cyber-glow hover:scale-105 hover:-translate-y-2 transition-all duration-500 rounded-xl relative overflow-hidden"
                  >
                    {/* Course Image */}
                    <div className="relative overflow-hidden rounded-t-xl">
                      <img
                        src={course.thumbnailUrl || "/images/placeholder.png"}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 text-xs font-cyber font-semibold rounded-full border-2 backdrop-blur-sm ${
                            course.level === "Beginner"
                              ? "bg-green-500/20 text-green-300 border-green-400/50 neon-text-green"
                              : course.level === "Intermediate"
                              ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/50 neon-text-yellow"
                              : "bg-red-500/20 text-red-300 border-red-400/50 neon-text-red"
                          }`}
                        >
                          {course.level}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4">
                        <div className="flex items-center space-x-1 bg-cyber-dark/80 text-cyber-primary border border-cyber-primary/50 px-3 py-1 rounded-full text-xs font-cyber backdrop-blur-sm">
                          <Clock className="h-3 w-3 animate-cyber-pulse" />
                          <span className="neon-text-cyan">{course.duration}</span>
                        </div>
                      </div>
                      {enrolled && (
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="bg-cyber-dark/90 border border-cyber-primary/50 rounded-lg p-3 backdrop-blur-sm">
                            <div className="flex items-center justify-between text-cyber-primary text-xs mb-2 font-cyber">
                              <span className="neon-text-cyan">Progress</span>
                              <span className="text-neon-orange font-semibold">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-cyber-dark/50 rounded-full h-2 border border-cyber-primary/30">
                              <div
                                className="bg-gradient-to-r from-cyber-primary to-neon-cyan h-2 rounded-full transition-all duration-500 animate-cyber-pulse"
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Course Content */}
                    <div className="p-6 relative">
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
                      
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="px-3 py-1 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50 text-xs font-cyber font-semibold rounded-full neon-text-cyan">
                          {course.category}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-neon-orange fill-current animate-cyber-pulse" />
                          <span className="text-sm text-cyan-100 font-cyber">
                            {course.rating?.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-cyber-primary transition-colors h-24 font-cyber neon-text-cyan">
                        {course.title}
                      </h3>

                      <p className="text-sm mb-4 line-clamp-2 text-cyan-100 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                            <span className="text-sm text-cyan-100 font-cyber">
                              {course.totalStudents}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Play className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                            <span className="text-sm text-cyan-100 font-cyber">
                              {course.modules.length} modules
                            </span>
                          </div>
                        </div>

                        {enrolled ? (
                          <span className="flex items-center space-x-1 text-neon-green text-sm font-cyber font-semibold neon-text-green">
                            <Award className="h-4 w-4 animate-cyber-pulse" />
                            <span>Enrolled</span>
                          </span>
                        ) : (
                          <button
                            onClick={(e) => handleEnrollClick(e, course.id)}
                            className="px-3 py-1 text-xs font-semibold rounded-md border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                          >
                            {course.price > 0 ? `${course.price} KAIA` : "Free"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Cyber List View */
                  <div
                    key={course.id}
                    onClick={() => handleCourseClick(course)}
                    className="group cursor-pointer cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent"></div>
                    
                    <div className="flex items-start space-x-6">
                      {/* Cyber Course Image */}
                      <div className="relative flex-shrink-0">
                        <img
                          src={course.thumbnailUrl || "/images/placeholder.png"}
                          alt={course.title}
                          className="w-32 h-24 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500 border-2 border-cyber-primary/30"
                        />
                        <div className="absolute top-2 left-2">
                          <span
                            className={`px-2 py-1 text-xs font-cyber font-semibold rounded-full border backdrop-blur-sm ${
                              course.level === "Beginner"
                                ? "bg-green-500/20 text-green-300 border-green-400/50 neon-text-green"
                                : course.level === "Intermediate"
                                ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/50 neon-text-yellow"
                                : "bg-red-500/20 text-red-300 border-red-400/50 neon-text-red"
                            }`}
                          >
                            {course.level}
                          </span>
                        </div>
                      </div>

                      {/* Cyber Course Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50 text-xs font-cyber font-semibold rounded-full neon-text-cyan">
                              {course.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-neon-orange fill-current animate-cyber-pulse" />
                              <span className="text-sm text-cyan-100 font-cyber">
                                {course.rating?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          {enrolled ? (
                            <span className="flex items-center space-x-1 text-neon-green text-sm font-cyber font-semibold neon-text-green">
                              <Award className="h-4 w-4 animate-cyber-pulse" />
                              <span>Enrolled</span>
                            </span>
                          ) : (
                            <button
                              onClick={(e) => handleEnrollClick(e, course.id)}
                              className="px-3 py-1 text-xs font-semibold rounded-md border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                            >
                              {course.price > 0
                                ? `${course.price} KAIA`
                                : "Free"}
                            </button>
                          )}
                        </div>

                        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-cyber-primary transition-colors font-cyber neon-text-cyan">
                          {course.title}
                        </h3>

                        <p className="text-cyan-100 mb-4 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                              <span className="text-sm text-cyan-100 font-cyber">
                                {course.totalStudents} students
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Play className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                              <span className="text-sm text-cyan-100 font-cyber">
                                {course.modules.length} modules
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                              <span className="text-sm text-cyan-100 font-cyber">
                                {course.duration}
                              </span>
                            </div>
                          </div>

                          {enrolled && (
                            <div className="flex items-center space-x-3">
                              <div className="w-24 bg-cyber-dark/50 border border-cyber-primary/30 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-cyber-primary to-neon-cyan h-2 rounded-full transition-all duration-500 animate-cyber-pulse"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-neon-orange font-cyber font-semibold">
                                {Math.round(progress)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cyber Loading indicator */}
            {loading && (
              <div className="flex justify-center py-8">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 border-4 border-cyber-primary/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-cyber-primary border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-2 border-neon-cyan/30 rounded-full animate-spin animate-reverse"></div>
                </div>
              </div>
            )}

            {/* Infinite scroll trigger */}
            <div ref={loadingRef} className="h-4" />

            {/* Cyber End of results indicator */}
            {!hasMore && courses.length > 0 && (
              <div className="text-center py-8">
                <div className="cyber-card border-cyber rounded-xl p-6 inline-block">
                  <p className="text-cyber-primary font-cyber neon-text-cyan">
                    🎯 You've reached the end of courses
                  </p>
                </div>
              </div>
            )}
          </>
        )}
        </div>

        {/* Course Enrollment Modal */}
        {showEnrollmentModal && selectedCourseForEnrollment && (
          <CourseEnrollmentModal
            course={selectedCourseForEnrollment}
            onClose={() => {
              setShowEnrollmentModal(false);
              setSelectedCourseForEnrollment(null);
            }}
            onEnrollSuccess={handleEnrollmentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
