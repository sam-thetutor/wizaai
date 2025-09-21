import React, { useState } from "react";
import { useApp } from "../contexts/AppContext";
import { useSupabase } from "../hooks/useSupabase";
import { usePagination } from "../hooks/usePagination";
import { useInfiniteScroll } from "../hooks/useInfiniteScroll";
import Dropdown from "../components/ui/Dropdown";
import {
  Users,
  Star,
  BookOpen,
  Award,
  Search,
  Filter,
  ChevronDown,
  ExternalLink,
  MessageCircle,
  TrendingUp,
} from "lucide-react";

const CreatorsPage: React.FC = () => {
  const { stats, navigateTo } = useApp();
  const { getCreators } = useSupabase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [experienceFilter, setExperienceFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination for creators
  const {
    items: creators,
    loading,
    hasMore,
    error,
    loadMore,
    reset,
  } = usePagination({
    fetchFunction: async (page: number, limit: number) => {
      const filters = {
        search: searchTerm,
        specialty: selectedSpecialty === "all" ? undefined : selectedSpecialty,
        experience: experienceFilter === "all" ? undefined : experienceFilter,
        sortBy: sortBy,
      };
      return await getCreators(page, limit, filters);
    },
    limit: 12,
    dependencies: [searchTerm, selectedSpecialty, experienceFilter, sortBy],
  });

  const { loadingRef } = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
    threshold: 200,
  });

  const specialties = [
    "all",
    "Programming",
    "Design",
    "Marketing",
    "Business",
    "Data Science",
    "Cybersecurity",
    "Blockchain",
  ];

  const sortOptions = [
    { value: "rating", label: "Highest Rated" },
    { value: "students", label: "Most Students" },
    { value: "courses", label: "Most Courses" },
    { value: "newest", label: "Recently Joined" },
    { value: "oldest", label: "Longest Member" },
    { value: "alphabetical", label: "A to Z" },
    { value: "experience", label: "Most Experienced" },
  ];

  const experienceOptions = [
    { value: "all", label: "All Experience Levels" },
    { value: "1-2", label: "1-2 years" },
    { value: "3-5", label: "3-5 years" },
    { value: "6-10", label: "6-10 years" },
    { value: "10+", label: "10+ years" },
  ];

  const handleViewCourses = (creatorId: string) => {
    navigateTo(`/app/courses?creator=${creatorId}`);
  };

  return (
    <div className="space-y-8">
      {/* Cyber Hero Section */}
      <div className="cyber-card border-cyber hover:cyber-glow transition-all duration-500 rounded-2xl p-8 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-cyber-dark"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-cyber-primary animate-data-stream"></div>
        
        <div className="relative z-10 max-w-4xl">
          {/* Cyber Badge */}
          <div className="inline-flex items-center space-x-2 cyber-badge mb-6">
            <div className="w-2 h-2 bg-cyber-primary rounded-full animate-cyber-pulse"></div>
            <span className="text-cyber-primary font-cyber text-sm font-semibold neon-text-cyan">CREATOR NETWORK</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white font-cyber neon-text-cyan holographic">
            Meet Our <span className="text-cyber-primary">Amazing</span> Creators
          </h1>
          <p className="text-lg text-cyan-100 mb-8 font-semibold">
            <span className="text-cyber-primary">Learn from industry experts</span> and thought leaders who are shaping the 
            future of education. Connect with <span className="text-neon-orange font-bold">creators</span> who share your interests
            and <span className="text-cyber-primary">passions</span>.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <div className="cyber-card border-cyber hover:cyber-glow group transition-all duration-300 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                  <Users className="h-5 w-5 text-cyber-primary animate-cyber-pulse" />
                </div>
                <span className="font-cyber text-white font-semibold">
                  <span className="text-cyber-primary neon-text-cyan">{stats.totalCreators}+</span> Creators
                </span>
              </div>
            </div>
            <div className="cyber-card border-cyber hover:cyber-glow group transition-all duration-300 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                  <BookOpen className="h-5 w-5 text-cyber-primary animate-cyber-pulse" />
                </div>
                <span className="font-cyber text-white font-semibold">
                  <span className="text-cyber-primary neon-text-cyan">{stats.totalCourses}+</span> Courses
                </span>
              </div>
            </div>
            <div className="cyber-card border-cyber hover:cyber-glow group transition-all duration-300 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-cyber-primary/20 group-hover:bg-cyber-primary/30 transition-colors">
                  <Award className="h-5 w-5 text-cyber-primary animate-cyber-pulse" />
                </div>
                <span className="font-cyber text-white font-semibold">
                  <span className="text-neon-orange neon-text-orange">Expert</span> Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-primary animate-cyber-pulse" />
            <input
              type="text"
                placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-cyber-dark/50 border-2 border-cyber/50 rounded-lg focus:border-cyber-primary focus:cyber-glow text-white placeholder-cyan-400 font-cyber transition-all duration-300 backdrop-blur-sm"
            />
            <div className="absolute inset-0 rounded-lg bg-cyber-primary/5 pointer-events-none"></div>
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
            <div className="absolute inset-0 bg-cyber-primary/5"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-primary animate-data-stream"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                  🎯 Specialty
                </label>
                <div className="cyber-card border-cyber/50 rounded-lg">
                  <Dropdown
                    options={specialties.map((specialty) => ({
                      value: specialty,
                      label: specialty === "all" ? "All Specialties" : specialty,
                    }))}
                    value={selectedSpecialty}
                    onChange={setSelectedSpecialty}
                    placeholder="Select specialty"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-cyber font-semibold mb-3 text-cyber-primary neon-text-cyan">
                  ⚡ Experience
                </label>
                <div className="cyber-card border-cyber/50 rounded-lg">
                  <Dropdown
                    options={experienceOptions}
                    value={experienceFilter}
                    onChange={setExperienceFilter}
                    placeholder="Select experience"
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
                    placeholder="Sort by"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cyber Creators Grid */}
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-3xl font-bold text-white font-cyber neon-text-cyan">
            {searchTerm || selectedSpecialty !== "all"
              ? `🔍 Search Results (${creators.length})`
              : "👥 All Creators"}
          </h2>
          <div className="flex-1 h-px bg-cyber-primary"></div>
        </div>

        {error ? (
          <div className="text-center py-12 cyber-card border-cyber rounded-xl">
            <div className="text-neon-orange font-cyber text-lg mb-4">⚠️ Failed to load creators</div>
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
            >
              🔄 Try Again
            </button>
          </div>
        ) : creators.length === 0 && !loading ? (
          <div className="text-center py-12 cyber-card border-cyber rounded-xl">
            <Users className="h-16 w-16 mx-auto mb-4 text-cyber-primary animate-cyber-pulse" />
            <p className="text-lg mb-2 text-white font-cyber">🔍 No creators found</p>
            <p className="text-cyan-100">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creators.map((creator) => (
                <div
                  key={creator.id}
                  className="cyber-card border-cyber hover:cyber-glow hover:scale-105 transition-all duration-500 rounded-xl p-6 relative overflow-hidden"
                >
                  {/* Cyber Creator Header */}
                  <div className="relative z-10">
                    <div className="absolute top-0 left-0 w-full h-px bg-cyber-primary/50"></div>
                    
                    <div className="flex items-start space-x-4 mb-4 pt-2">
                      <div className="relative">
                        <img
                          src={creator.avatarUrl}
                          alt={creator.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-cyber-primary/50 hover:border-cyber-primary transition-colors"
                        />
                        {creator.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-cyber-primary rounded-full flex items-center justify-center animate-cyber-pulse">
                            <Award className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white truncate font-cyber neon-text-cyan">
                          {creator.name}
                        </h3>
                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-4 w-4 text-neon-orange fill-current animate-cyber-pulse" />
                          <span className="text-sm font-medium text-cyber-primary font-cyber">
                            {creator.rating?.toFixed(2)}
                          </span>
                          <span className="text-sm text-cyan-100">
                            ({creator.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cyber Creator Bio */}
                  <p className="text-sm text-cyan-100 mb-4 line-clamp-3 leading-relaxed">
                    {creator.bio}
                  </p>

                  {/* Cyber Specialties */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {creator.specialties?.slice(0, 3).map((specialty) => (
                      <span
                        key={specialty}
                        className="px-3 py-1 bg-cyber-primary/20 text-cyber-primary border border-cyber-primary/50 text-xs font-cyber font-semibold rounded-full neon-text-cyan"
                      >
                        {specialty}
                      </span>
                    ))}
                    {creator.specialties?.length > 3 && (
                      <span className="px-3 py-1 bg-neon-orange/20 text-neon-orange border border-neon-orange/50 text-xs font-cyber font-semibold rounded-full">
                        +{creator.specialties?.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Cyber Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div className="cyber-card border-cyber/30 p-3 rounded-lg">
                      <div className="text-lg font-bold text-cyber-primary font-cyber neon-text-cyan">
                        {creator.totalCourses}
                      </div>
                      <div className="text-xs text-cyan-100 font-cyber">Courses</div>
                    </div>
                    <div className="cyber-card border-cyber/30 p-3 rounded-lg">
                      <div className="text-lg font-bold text-cyber-primary font-cyber neon-text-cyan">
                        {creator.totalStudents.toLocaleString()}
                      </div>
                      <div className="text-xs text-cyan-100 font-cyber">Students</div>
                    </div>
                  </div>

                  {creator.totalStudents > 3 && (
                    <div className="flex items-center justify-center space-x-2 mb-4 p-3 cyber-card border-neon-green/50 rounded-lg">
                      <TrendingUp className="h-4 w-4 text-neon-green animate-cyber-pulse" />
                      <span className="text-sm font-cyber font-semibold text-neon-green neon-text-green">
                        Top Earner
                      </span>
                    </div>
                  )}

                  {/* Cyber Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewCourses(creator.address)}
                      className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg border-2 border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10 hover:border-cyber-primary hover:shadow-cyber transition-all duration-300 backdrop-blur-sm"
                    >
                      <BookOpen className="h-4 w-4 animate-cyber-pulse" />
                      <span>View Courses</span>
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300">
                      <MessageCircle className="h-4 w-4 animate-cyber-pulse" />
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 cyber-card border-cyber/50 hover:cyber-glow text-cyber-primary rounded-lg transition-all duration-300">
                      <ExternalLink className="h-4 w-4 animate-cyber-pulse" />
                    </button>
                  </div>
                </div>
              ))}
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
            {!hasMore && creators.length > 0 && (
              <div className="text-center py-8">
                <div className="cyber-card border-cyber rounded-xl p-6 inline-block">
                  <p className="text-cyber-primary font-cyber neon-text-cyan">
                    🎯 You've explored all creators
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

export default CreatorsPage;
