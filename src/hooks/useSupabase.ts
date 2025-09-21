import { supabase } from "../lib/supabase";
import {
  Course,
  EnrolledCourse,
  Module,
  PlatformStats,
  Transaction,
  User,
} from "../types";

// Helper function to check if Supabase is available
const checkSupabase = () => {
  if (!supabase) {
    console.warn("⚠️ Supabase not configured. Please add environment variables.");
    return false;
  }
  return true;
};

interface CourseFilters {
  search?: string;
  category?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  creatorId?: string;
  sortBy?: string;
}

interface CreatorFilters {
  search?: string;
  specialty?: string;
  experience?: string;
  sortBy?: string;
}

export const useSupabase = () => {
  // Upload file to Supabase storage
  const uploadFile = async (file: File, folder?: string): Promise<string> => {
    if (!checkSupabase()) {
      // Return a placeholder image URL when Supabase storage is not available
      console.warn("⚠️ Supabase storage not configured. Using placeholder image.");
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
    }

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      const { error: uploadError } = await supabase!.storage
        .from("liven")
        .upload(filePath, file);

      if (uploadError) {
        // If bucket doesn't exist, return placeholder
        if (uploadError.message.includes("Bucket not found")) {
          console.warn("⚠️ Storage bucket 'wiza' not found. Please create it in Supabase Storage.");
          return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
        }
        throw uploadError;
      }

      const { data } = supabase!.storage.from("liven").getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      console.warn("⚠️ Using placeholder image due to upload failure.");
      // Return placeholder image on any upload failure
      return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
    }
  };

  // Upload image to Supabase storage
  const uploadImage = async (file: File, path: string): Promise<string> => {
    return uploadFile(file, `images/${path}`);
  };

  // Get creator by ID
  const getCreatorById = async (creatorId: string): Promise<User | null> => {
    if (!checkSupabase()) {
      return null; // Return null if Supabase not configured
    }
    
    try {
      const { data, error } = await supabase!
        .from("users")
        .select(
          `
          *,
          courses!courses_instructor_id_fkey(count),
          enrollments!enrollments_instructor_id_fkey(count),
          course_ratings!course_ratings_instructor_id_fkey(rating)
        `
        )
        .eq("address", creatorId)
        .single();

      if (error) {
        // If user doesn't exist (PGRST116), return null instead of throwing error
        if (error.code === 'PGRST116') {
          console.log(`ℹ️ User ${creatorId} not found in database. This is normal for new users.`);
          return null;
        }
        throw error;
      }

      return {
        ...data,
        name: data.name || `User ${data.address.slice(0, 6)}`,
        avatarUrl: data.avatar_url,
        createdAt: data.created_at,
        isVerified: data.is_verified,
        totalCourses: data.courses[0].count || 0,
        totalStudents: data.enrollments[0].count || 0,
        experienceYears: data.experience_years || 0,
        rating:
          data.course_ratings.reduce(
            (acc: number, rating: any) => acc + rating.rating,
            0
          ) / data.course_ratings.length,
        totalReviews: data.course_ratings.length,
      };
    } catch (error) {
      console.error("Error fetching creator:", error);
      return null;
    }
  };

  // Get all creators
  const getCreators = async (
    page: number = 1,
    limit: number = 12,
    filters: CreatorFilters = {}
  ): Promise<
    (User & {
      totalCourses: number;
      totalStudents: number;
      rating: number;
      totalReviews: number;
    })[]
  > => {
    try {
      let query = supabase
        .from("users")
        .select(
          `
          *,
          courses!courses_instructor_id_fkey(count),
          enrollments!enrollments_instructor_id_fkey(count),
          course_ratings!course_ratings_instructor_id_fkey(rating)
        `
        )
        .range((page - 1) * limit, page * limit - 1);

      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }

      if (filters.specialty) {
        query = query.contains("specialties", [filters.specialty]);
      }

      if (filters.experience) {
        if (filters.experience === "1-2") {
          query = query.gte("experience_years", 1).lte("experience_years", 2);
        } else if (filters.experience === "3-5") {
          query = query.gte("experience_years", 3).lte("experience_years", 5);
        } else if (filters.experience === "6-10") {
          query = query.gte("experience_years", 6).lte("experience_years", 10);
        } else if (filters.experience === "10+") {
          query = query.gte("experience_years", 10);
        }
      }

      // Apply sorting
      if (filters.sortBy === "alphabetical") {
        query = query.order("name", { ascending: true });
      } else if (filters.sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (filters.sortBy === "experience") {
        query = query.order("experience_years", { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map((creator: any) => ({
        ...creator,
        name: creator.name || `User ${creator.address.slice(0, 6)}`,
        avatarUrl: creator.avatar_url,
        createdAt: creator.created_at,
        isVerified: creator.is_verified,
        totalCourses: creator.courses[0].count || 0,
        totalStudents: creator.enrollments[0].count || 0,
        experienceYears: creator.experience_years || 0,
        rating:
          creator.course_ratings.reduce(
            (acc: number, rating: any) => acc + rating.rating,
            0
          ) / creator.course_ratings.length,
        totalReviews: creator.course_ratings.length,
      }));
    } catch (error) {
      console.error("Error fetching creators:", error);
      return [];
    }
  };

  const getCourses = async (
    page: number = 1,
    limit: number = 12,
    filters: CourseFilters = {},
    userId?: string | null
  ): Promise<any[]> => {
    if (!checkSupabase()) {
      return []; // Return empty array if Supabase not configured
    }
    
    try {
      let query = supabase!
        .from("courses")
        .select(
          `
          *,
          users!courses_instructor_id_fkey(*),
          modules(id, title, type, duration, order_index),
          enrollments!enrollments_course_id_fkey(count),
          course_ratings!course_ratings_course_id_fkey(rating),
          certificate_metadata(*)
        `
        )
        .eq("is_published", true)
        .order("order_index", { ascending: true, referencedTable: "modules" })
        .range((page - 1) * limit, page * limit - 1);

      // Apply filters
      if (filters.search) {
        query = query.or(
          `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      if (filters.category) {
        query = query.eq("category", filters.category);
      }

      if (filters.level) {
        query = query.eq("level", filters.level);
      }

      if (filters.creatorId) {
        query = query.eq("instructor_id", filters.creatorId);
      }

      // Apply sorting
      if (filters.sortBy === "oldest") {
        query = query.order("created_at", { ascending: true });
      } else if (filters.sortBy === "price_low") {
        query = query.order("price", { ascending: true });
      } else if (filters.sortBy === "price_high") {
        query = query.order("price", { ascending: false });
      } else if (filters.sortBy === "rating") {
        query = query.order("rating", { ascending: false });
      } else if (filters.sortBy === "popular") {
        // query = query.order("course_ratings", {
        //   ascending: false,
        //   referencedTable: "course_ratings",
        // });
      } else if (filters.sortBy === "duration_short") {
        query = query.order("duration", { ascending: true });
      } else if (filters.sortBy === "duration_long") {
        query = query.order("duration", { ascending: false });
      } else if (filters.sortBy === "alphabetical") {
        query = query.order("title", { ascending: true });
      } else {
        query = query.order("created_at", { ascending: false });
      }

      if (userId) {
        query = query.eq("instructor_id", userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        user: {
          ...course.users,
          name: course.users.name || `User ${course.users.address.slice(0, 6)}`,
          avatarUrl: course.users.avatar_url,
          createdAt: course.users.created_at,
          isVerified: course.users.is_verified,
          experienceYears: course.users.experience_years || 0,
          rating:
            (course.course_ratings as { rating: number }[]).reduce(
              (a, b) => a + b.rating,
              0
            ) / course.course_ratings.length,
          totalReviews: course.course_ratings.length,
        },
        instructorAvatar: course.users?.avatar_url,
        thumbnailUrl: course.thumbnail_url,
        price: course.price || 0,
        duration: course.duration,
        level: course.level,
        category: course.category,
        modules: (course.modules || []).map((module: any) => ({
          id: module.id,
          title: module.title,
          type: module.type,
          duration: module.duration,
          isCompleted: false,
          isLocked: false,
        })),
        totalStudents: course.enrollments[0].count || 0,
        rating:
          (course.course_ratings as { rating: number }[]).reduce(
            (a, b) => a + b.rating,
            0
          ) / course.course_ratings.length,
        totalReviews: course.course_ratings.length,
        certificateMetadata: course.certificate_metadata?.[0] || {
          title: course.title,
          issuer: course.users?.name || "Wiza Academy",
          description: `Certificate of completion for ${course.title}`,
          imageUrl: "",
          attributes: [],
        },
        createdAt: new Date(course.created_at),
      }));
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  };

  const getCourse = async (courseId: string): Promise<any> => {
    try {
      const { data: course, error } = await supabase
        .from("courses")
        .select(
          `
          *,
          users!courses_instructor_id_fkey(*),
          modules(id, title, type, duration, order_index, content, quizzes(*)),
          enrollments!enrollments_course_id_fkey(count),
          course_ratings!course_ratings_course_id_fkey(rating),
          certificate_metadata(*)
          `
        )
        .order("order_index", { ascending: true, referencedTable: "modules" })
        .eq("id", courseId)
        .single();

      if (error) {
        throw error;
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        user: {
          ...course.users,
          name: course.users.name || `User ${course.users.address.slice(0, 6)}`,
          avatarUrl: course.users.avatar_url,
          createdAt: course.users.created_at,
          isVerified: course.users.is_verified,
          experienceYears: course.users.experience_years || 0,
          rating: 4.8,
          totalReviews: 0,
        },
        instructorAvatar: course.users?.avatar_url,
        thumbnailUrl: course.thumbnail_url || "",
        price: course.price || 0,
        duration: course.duration || "0h",
        level: course.level,
        category: course.category,
        modules: (course.modules || []).map((module: any) => ({
          id: module.id,
          title: module.title,
          type: module.type,
          content: module.content || {},
          duration: module.duration || "0min",
          quiz: module.quizzes.length
            ? {
                ...module.quizzes[0],
                passingScore: module.quizzes[0].passing_score,
                moduleId: module.id,
                createdAt: new Date(module.quizzes[0].created_at),
              }
            : undefined,
          isCompleted: false,
          isLocked: false,
        })),
        totalStudents: course.enrollments[0].count || 0,
        rating:
          (course.course_ratings as { rating: number }[]).reduce(
            (a, b) => a + b.rating,
            0
          ) / course.course_ratings.length,
        totalReviews: course.course_ratings.length,
        certificateMetadata: course.certificate_metadata?.[0] || {
          title: course.title,
          issuer: course.users?.name || "Wiza Academy",
          description: `Certificate of completion for ${course.title}`,
          imageUrl: "",
          attributes: [],
        },
        createdAt: new Date(course.created_at),
      };
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  };

  // Create a new course
  const createCourse = async (courseData: {
    title: string;
    description: string;
    instructorId: string;
    thumbnailUrl?: string;
    price?: number;
    duration?: string;
    level?: "Beginner" | "Intermediate" | "Advanced";
    category?: string;
    modules: Module[];
    certificateMetadata: {
      title: string;
      issuer: string;
      description: string;
      imageUrl: string;
      attributes: string[];
    };
  }): Promise<Course> => {
    try {
      // Create course
      const { data: course, error: courseError } = await supabase
        .from("courses")
        .insert({
          title: courseData.title,
          description: courseData.description,
          instructor_id: courseData.instructorId,
          thumbnail_url: courseData.thumbnailUrl,
          price: courseData.price || 0,
          duration: courseData.duration || "0h",
          level: courseData.level || "Beginner",
          category: courseData.category || "General",
          is_published: true,
        })
        .select()
        .single();

      if (courseError) {
        throw courseError;
      }

      // Create modules
      if (courseData.modules.length > 0) {
        const modulesData = courseData.modules.map((module, index) => ({
          course_id: course.id,
          title: module.title,
          type: module.type,
          content: module.content,
          duration: module.duration,
          order_index: index,
        }));

        const { data: modulesCreated, error: modulesError } = await supabase
          .from("modules")
          .insert(modulesData)
          .select();

        if (modulesError) {
          throw modulesError;
        }

        for (let i = 0; i < courseData.modules.length; i++) {
          const module = courseData.modules[i];

          if (module.quiz) {
            const { error: quizError } = await supabase.from("quizzes").insert({
              module_id: modulesCreated[i].id,
              questions: module.quiz.questions,
              passing_score: module.quiz.passingScore,
            });

            if (quizError) {
              console.error("Error creating quiz:", quizError);
            }
          }
        }
      }

      // Create certificate metadata
      const { error: certError } = await supabase
        .from("certificate_metadata")
        .insert({
          course_id: course.id,
          instructor_id: courseData.instructorId,
          title: courseData.certificateMetadata.title,
          issuer: courseData.certificateMetadata.issuer,
          description: courseData.certificateMetadata.description,
          image: courseData.certificateMetadata.imageUrl,
          attributes: courseData.certificateMetadata.attributes,
        });

      if (certError) {
        throw certError;
      }

      // Return the created course
      return {
        id: course.id,
        title: course.title,
        description: course.description,
        instructorId: course.user_id,
        thumbnailUrl: course.thumbnail_url || "",
        price: course.price,
        duration: course.duration,
        level: course.level,
        category: course.category,
        modules: courseData.modules,
        totalStudents: 0,
        rating: 0,
        certificateMetadata: courseData.certificateMetadata,
        createdAt: new Date(course.created_at),
      };
    } catch (error) {
      console.error("Error creating course:", error);
      throw new Error("Failed to create course");
    }
  };

  // Enroll in a course
  const enrollInCourse = async (
    userId: string,
    courseId: string,
    instructorId: string
  ): Promise<void> => {
    if (!checkSupabase()) {
      throw new Error("Database not configured");
    }

    try {
      // First, ensure the user exists in the users table
      const { data: existingUser } = await supabase!
        .from("users")
        .select("address")
        .eq("address", userId)
        .single();

      // If user doesn't exist, create a basic profile
      if (!existingUser) {
        console.log(`ℹ️ Creating user profile for ${userId}`);
        const { error: userError } = await supabase!
          .from("users")
          .insert({
            address: userId,
            name: `User ${userId.slice(0, 6)}...${userId.slice(-4)}`,
            is_creator: false,
            bio: null,
            specialties: [],
            is_verified: false,
          });

        if (userError) {
          console.error("Error creating user profile:", userError);
          throw new Error("Failed to create user profile");
        }
      }

      // Now create the enrollment
      const { error } = await supabase!.from("enrollments").insert({
        user_id: userId,
        course_id: courseId,
        instructor_id: instructorId,
        progress: 0,
        completed_modules: [],
        current_module: 0,
      });

      if (error) {
        throw error;
      }

      console.log(`✅ Successfully enrolled user ${userId} in course ${courseId}`);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      throw new Error("Failed to enroll in course");
    }
  };

  // Complete a module
  const completeModule = async (
    userId: string,
    courseId: string,
    moduleId: string
  ): Promise<void> => {
    try {
      // Get current enrollment
      const { data: enrollment, error: fetchError } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      // Update completed modules
      const completedModules = [
        ...(enrollment.completed_modules || []),
        moduleId,
      ];

      // Get total modules count
      const { data: modules, error: modulesError } = await supabase
        .from("modules")
        .select("id")
        .eq("course_id", courseId);

      if (modulesError) {
        throw modulesError;
      }

      const progress = (completedModules.length / (modules?.length || 1)) * 100;

      // Update enrollment
      const { error: updateError } = await supabase
        .from("enrollments")
        .update({
          completed_modules: completedModules,
          progress: Math.round(progress),
          last_accessed: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .eq("course_id", courseId);

      if (updateError) {
        throw updateError;
      }
    } catch (error) {
      console.error("Error completing module:", error);
      throw new Error("Failed to complete module");
    }
  };

  const getEnrolledCourses = async (
    userId: string
  ): Promise<EnrolledCourse[]> => {
    if (!checkSupabase()) {
      return []; // Return empty array if Supabase not configured
    }
    
    try {
      const { data, error } = await supabase!
        .from("enrollments")
        .select(
          `
        *,
        course:courses(*)
        `
        )
        .eq("user_id", userId);

      if (error) throw error;

      return data.map((enrollment) => {
        return {
          completedModules: enrollment.completed_modules,
          course: enrollment.course
            ? {
                ...enrollment.course,
                thumbnailUrl: enrollment.course.thumbnail_url,
              }
            : undefined,
          instructorId: enrollment.course.user_id,
          progress: enrollment.progress,
          currentModule: enrollment.current_module,
          certificateMinted: enrollment.certificate_minted,
          certiticateTokenId: enrollment.certificate_token_id,
          lastAccessed: new Date(enrollment.last_accessed),
          enrolledAt: new Date(enrollment.enrolled_at),
        };
      });
    } catch (error) {
      console.error("Failed to get enrolled courses:", error);
      return [];
    }
  };

  // Update user profile for creator onboarding
  const updateUserProfile = async (profileData: {
    name: string;
    bio: string;
    website?: string;
    address: string;
    twitter?: string;
    linkedin?: string;
    specialties: string[];
    experienceYears: number;
    avatarUrl?: string;
    isCreator: boolean;
  }): Promise<User> => {
    try {
      // Insert or update creator profile
      const { data, error } = await supabase
        .from("users")
        .upsert(
          {
            address: profileData.address,
            name: profileData.name,
            bio: profileData.bio,
            website: profileData.website,
            twitter: profileData.twitter,
            linkedin: profileData.linkedin,
            specialties: profileData.specialties,
            experience_years: profileData.experienceYears,
            avatar_url: profileData.avatarUrl,
            is_creator: profileData.isCreator,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "address",
          }
        )
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        ...data,
        id: data.id,
        address: data.address,
        name: data.name,
        avatarUrl: data.avatar_url,
        isCreator: data.is_creator,
        bio: data.bio,
        website: data.website,
        twitter: data.twitter,
        linkedin: data.linkedin,
        specialties: data.specialties,
        experienceYears: data.experience_years,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw new Error("Failed to update user profile");
    }
  };

  // Submit course rating
  const submitCourseRating = async (
    userId: string,
    courseId: string,
    instructorId: string,
    rating: number,
    review?: string
  ): Promise<void> => {
    try {
      const { error } = await supabase.from("course_ratings").upsert({
        user_id: userId,
        course_id: courseId,
        instructor_id: instructorId,
        rating,
        review: review || null,
        updated_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error submitting course rating:", error);
      throw new Error("Failed to submit course rating");
    }
  };

  // Get user's rating for a course
  const getUserCourseRating = async (
    userId: string,
    courseId: string
  ): Promise<any | null> => {
    try {
      const { data, error } = await supabase
        .from("course_ratings")
        .select("*")
        .eq("user_id", userId)
        .eq("course_id", courseId)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      return data;
    } catch (error) {
      console.error("Error fetching user course rating:", error);
      return null;
    }
  };

  // Get course ratings with user details
  const getCourseRatings = async (
    courseId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<any[]> => {
    try {
      const { data, error } = await supabase
        .from("course_ratings")
        .select(
          `
          *,
          users(name, avatar_url)
        `
        )
        .eq("course_id", courseId)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error("Error fetching course ratings:", error);
      return [];
    }
  };

  // Get platform statistics
  const getPlatformStats = async (): Promise<PlatformStats> => {
    if (!checkSupabase()) {
      return {
        totalCourses: 3, // Default sample data
        totalStudents: 0,
        totalCertificates: 0,
        totalCreators: 1,
      };
    }
    
    try {
      const { data, error } = (await supabase!
        .rpc("platform_summary")
        .single()) as any;

      if (error) throw error;

      return {
        totalCourses: data.totalCourses || 0,
        totalStudents: data.totalStudents || 0,
        totalCertificates: data.totalCertificates || 0,
        totalCreators: data.totalCreators || 0,
      };
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      // Return default stats if function doesn't exist yet
      return {
        totalCourses: 3,
        totalStudents: 0,
        totalCertificates: 0,
        totalCreators: 1,
      };
    }
  };

  // Get user transactions
  const getUserTransactions = async (
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<Transaction[]> => {
    try {
      const { data, error } = await supabase
        .from("transactions")
        .select(
          `
          *,
          courses(title)
        `
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (error) {
        throw error;
      }

      return (data || []).map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        currency: transaction.currency,
        description: transaction.description,
        date: new Date(transaction.created_at),
        status: transaction.status,
        txHash: transaction.tx_hash,
        courseTitle: transaction.courses?.title,
      }));
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      return [];
    }
  };

  // Create transaction
  const createTransaction = async (transactionData: {
    userId: string;
    fromUserId?: string;
    type: "earning" | "withdrawal" | "deposit" | "fee";
    amount: number;
    currency?: string;
    description: string;
    status?: "completed" | "pending" | "failed";
    txHash?: string;
    courseId?: string;
  }): Promise<void> => {
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: transactionData.userId,
        from_user_id: transactionData.fromUserId,
        type: transactionData.type,
        amount: transactionData.amount,
        currency: transactionData.currency || "KAIA",
        description: transactionData.description,
        status: transactionData.status || "pending",
        tx_hash: transactionData.txHash,
        course_id: transactionData.courseId,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw new Error("Failed to create transaction");
    }
  };

  return {
    uploadFile,
    uploadImage,
    getCreatorById,
    getCreators,
    getCourses,
    getCourse,
    createCourse,
    enrollInCourse,
    completeModule,
    getEnrolledCourses,
    updateUserProfile,
    submitCourseRating,
    getUserCourseRating,
    getCourseRatings,
    getPlatformStats,
    getUserTransactions,
    createTransaction,
  };
};
