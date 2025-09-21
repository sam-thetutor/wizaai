import React, { useState } from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import { usePagination } from "../hooks/usePagination";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import {
  Plus,
  BookOpen,
  Edit,
  Users,
  Star,
  Eye,
  MoreVertical,
  Search,
  Filter,
  ChevronDown,
  Loader2,
  DollarSign,
} from "lucide-react";
import CyberButton from "../components/ui/CyberButton";

const ContentsPage: React.FC = () => {
  const { state, navigateTo, addNotification } = useApp();
  const { address, isConnected } = useAppKitAccount();
  const { getCourses } = useSupabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const {
    items: userCourses,
    loading: coursesLoading,
    hasMore,
    error: coursesError,
    loadMore,
    reset: resetCourses,
  } = usePagination({
    fetchFunction: async (page: number, limit: number) => {
      if (!address || !isConnected) return [];
      return await getCourses(page, limit, { sortBy }, address);
    },
    limit: 12,
    dependencies: [address, sortBy, isConnected],
  });

  const { loadingRef } = useInfiniteScroll({
    hasMore,
    loading: coursesLoading,
    onLoadMore: loadMore,
    threshold: 100,
  });

  const statusOptions = [
    { value: "all", label: "All Courses" },
    { value: "published", label: "Published" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "alphabetical", label: "A to Z" },
    { value: "students", label: "Most Students" },
    { value: "rating", label: "Highest Rated" },
    { value: "revenue", label: "Highest Revenue" },
  ];

  const filteredCourses = userCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    // For now, all courses are considered published
    const matchesStatus =
      statusFilter === "all" || statusFilter === "published";
    return matchesSearch && matchesStatus;
  });

  const handleDeleteCourse = (courseId: string) => {
    // Mock delete functionality
    addNotification({
      type: "success",
      title: "Course Deleted",
      message: "Course has been successfully deleted",
    });

    resetCourses();
  };

  if (!isConnected) {
    return (
      <div className="text-center py-16 cyber-card border-cyber rounded-xl max-w-md mx-auto">
        <BookOpen className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
        <h2 className="text-2xl font-semibold mb-4 text-white font-cyber neon-text-cyan">Connect Your Wallet</h2>
        <p className="mb-6 text-cyan-100">
          You need to connect your wallet to manage your <span className="text-cyber-primary font-semibold">content</span>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Cyber Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-cyber neon-text-cyan">📚 My Contents</h1>
          <p className="text-cyan-100 mt-2">
            Manage your <span className="text-cyber-primary font-semibold">courses</span> and track their 
            <span className="text-neon-orange font-semibold"> performance</span>
          </p>
        </div>
        <button
          onClick={() => navigateTo("/app/create")}
          className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
        >
          <span className="relative z-10 flex items-center">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </span>
        </button>
      </div>

      {/* Cyber Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
              <BookOpen className="h-6 w-6 text-cyber-primary animate-cyber-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-cyber neon-text-cyan">
                {userCourses.length}
              </p>
              <p className="text-sm text-cyan-100 font-cyber">Total Courses</p>
            </div>
          </div>
        </div>

        <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-neon-green/20 group-hover:bg-neon-green/30 transition-colors">
              <Users className="h-6 w-6 text-neon-green animate-cyber-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-cyber neon-text-green">
                {userCourses.reduce(
                  (total, course) => total + course.totalStudents,
                  0
                )}
              </p>
              <p className="text-sm text-cyan-100 font-cyber">Total Students</p>
            </div>
          </div>
        </div>

        <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-neon-orange/20 group-hover:bg-neon-orange/30 transition-colors">
              <Star className="h-6 w-6 text-neon-orange animate-cyber-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-cyber neon-text-orange">
                {state.user?.rating?.toFixed(2)}
              </p>
              <p className="text-sm text-cyan-100 font-cyber">Avg Rating</p>
            </div>
          </div>
        </div>

        <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-300 rounded-xl p-6 group">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-lg bg-cyber-secondary/20 group-hover:bg-cyber-secondary/30 transition-colors">
              <DollarSign className="h-6 w-6 text-cyber-secondary animate-cyber-pulse" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white font-cyber neon-text-purple">
                {state.user?.experienceYears}
              </p>
              <p className="text-sm text-cyan-100 font-cyber">Experience Years</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-primary animate-cyber-pulse" />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300 backdrop-blur-sm"
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyber-primary/5 via-transparent to-cyber-primary/5 pointer-events-none"></div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-6 py-4 cyber-card border-cyber hover:cyber-glow font-cyber text-cyber-primary rounded-lg transition-all duration-300 hover:scale-105"
          >
            <Filter className="h-5 w-5 animate-cyber-pulse" />
            <span className="neon-text-cyan">Filters</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-300 ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {showFilters && (
          <div className="cyber-card border-cyber rounded-lg p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-primary/5 via-neon-cyan/5 to-cyber-secondary/5 animate-holographic"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                  📊 Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white font-cyber transition-all duration-300"
                >
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-cyber-dark text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                  🔄 Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white font-cyber transition-all duration-300"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-cyber-dark text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-white font-cyber neon-text-cyan">📚 My Courses</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-cyber-primary via-transparent to-cyber-primary"></div>
        </div>
        
        {coursesError ? (
          <div className="text-center py-12 cyber-card border-cyber rounded-xl">
            <div className="text-neon-orange font-cyber text-lg mb-4">⚠️ Failed to load your courses</div>
            <button
              onClick={resetCourses}
              className="cyber-gradient-button cyber-glow px-6 py-3 rounded-lg font-cyber transition-all duration-300 hover:scale-105"
            >
              🔄 Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 && !coursesLoading ? (
          <div className="text-center py-12 cyber-card border-cyber rounded-xl">
            <BookOpen className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
            <p className="text-lg mb-2 text-white font-cyber">📚 No courses found</p>
            <p className="mb-6 text-cyan-100">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Start creating your first course"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => navigateTo("/app/create")}
                className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
              >
                <span className="relative z-10 flex items-center">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="cyber-card border-cyber rounded-xl overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyber-primary to-transparent animate-data-stream"></div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="cyber-card border-b border-cyber">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                        📚 Course
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                        👥 Students
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                        ⭐ Rating
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                        💰 Revenue
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                        📊 Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-cyber font-semibold text-cyber-primary uppercase tracking-wider neon-text-cyan">
                        ⚡ Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="cyber-card divide-y divide-cyber/30">
                    {filteredCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-cyber-primary/5 transition-colors duration-300">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                course.thumbnailUrl ||
                                "https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=100"
                              }
                              alt={course.title}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-cyber-primary/30"
                            />
                            <div>
                              <h3 className="text-sm font-medium text-white font-cyber neon-text-cyan">
                                {course.title}
                              </h3>
                              <p className="text-sm text-cyan-100">
                                {course.category} • {course.level}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-cyber-primary animate-cyber-pulse" />
                            <span className="text-sm text-white font-cyber">
                              {course.totalStudents}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-neon-orange fill-current animate-cyber-pulse" />
                            <span className="text-sm text-white font-cyber">
                              {course.rating?.toFixed(2)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-neon-orange font-cyber neon-text-orange">
                            {(course.price * course.totalStudents).toLocaleString()} KAIA
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-cyber font-semibold bg-neon-green/20 text-neon-green border border-neon-green/50 neon-text-green">
                            Published
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button className="p-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300">
                              <Eye className="h-4 w-4 animate-cyber-pulse" />
                            </button>
                            <button className="p-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300">
                              <Edit className="h-4 w-4 animate-cyber-pulse" />
                            </button>
                            <div className="relative">
                              <button
                                onClick={() =>
                                  setSelectedCourse(
                                    selectedCourse === course.id
                                      ? null
                                      : course.id
                                  )
                                }
                                className="p-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300"
                              >
                                <MoreVertical className="h-4 w-4 animate-cyber-pulse" />
                              </button>
                              {selectedCourse === course.id && (
                                <div className="absolute right-0 mt-2 w-48 cyber-card border-cyber rounded-lg z-10">
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        navigateTo("/app/overview");
                                        setSelectedCourse(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-white hover:text-cyber-primary hover:bg-cyber-primary/10 font-cyber transition-all duration-300"
                                    >
                                      View Analytics
                                    </button>
                                    <button
                                      onClick={() => {
                                        handleDeleteCourse(course.id);
                                        setSelectedCourse(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 font-cyber transition-all duration-300"
                                    >
                                      Delete Course
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Loading indicator */}
            {coursesLoading && (
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

            {/* End of results indicator */}
            {!hasMore && filteredCourses.length > 0 && (
              <div className="text-center py-8">
                <div className="cyber-card border-cyber rounded-xl p-6 inline-block">
                  <p className="text-cyber-primary font-cyber neon-text-cyan">
                    🎯 You've reached the end of your courses
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentsPage;
