export interface User {
  id: string;
  address: string;
  name: string;
  avatarUrl?: string;
  isCreator?: boolean;
  bio?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  specialties: string[];
  experienceYears?: number;
  isVerified?: boolean;
  totalStudents?: number;
  totalCourses?: number;
  rating?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  user?: User;
  thumbnailUrl: string;
  price: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  modules: Module[];
  totalStudents: number;
  rating: number;
  certificateMetadata: CertificateMetadata;
  createdAt: Date;
}

export interface Module {
  id: string;
  title: string;
  type: "video" | "text" | "image";
  content: ModuleContent;
  quiz?: Quiz;
  duration: string;
  isCompleted?: boolean;
  isLocked?: boolean;
}

export interface ModuleContent {
  text?: string;
  videoUrl?: string;
  imageUrl?: string;
  richText?: string;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface NFTCertificate {
  id: string;
  courseId: string;
  instructor: string;
  courseTitle: string;
  studentName: string;
  studentAddress: string;
  instructorName: string;
  completionDate: Date;
  tokenId: string;
  metadata: CertificateMetadata;
  imageUrl: string;
}

export interface CertificateMetadata {
  title: string;
  issuer: string;
  description: string;
  imageUrl: string;
  attributes: string[];
}

export interface EnrolledCourse {
  course?: Course;
  instructorId: string;
  progress: number;
  completedModules: string[];
  currentModule: number;
  enrolledAt: Date;
  lastAccessed: Date;
  certificateMinted?: boolean;
  certificateTokenId?: string;
}

export interface AIMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface AppState {
  user: User | null;
  theme: "light" | "dark";
}

export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Analytics {
  // Overview metrics
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  avgRating: number;
  totalReviews: number;
  completionRate: number;

  // Time-based data
  monthlyData: MonthlyAnalytics[];
  revenueData: RevenueData[];

  // Course performance
  topCourses: CourseAnalytics[];
  recentEnrollments: EnrollmentAnalytics[];

  // Student insights
  studentDemographics: StudentDemographics;
  engagementMetrics: EngagementMetrics;
}

export interface Transaction {
  id: string;
  type: "earning" | "withdrawal" | "deposit" | "fee";
  amount: number;
  currency: "KAIA" | "USD";
  description: string;
  date: Date;
  status: "completed" | "pending" | "failed";
  txHash?: string;
  courseTitle?: string;
}

export interface MonthlyAnalytics {
  month: string;
  students: number;
  revenue: number;
  enrollments: number;
  completions: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  courseId?: string;
  courseTitle?: string;
}

export interface CourseAnalytics {
  courseId: string;
  instructor: string;
  title: string;
  students: number;
  revenue: number;
  rating: number;
  completionRate: number;
  enrollmentTrend: number;
}

export interface EnrollmentAnalytics {
  id: string;
  courseId: string;
  instructor: string;
  courseTitle: string;
  studentAddress: string;
  enrolledAt: Date;
  progress: number;
  lastAccessed: Date;
}

export interface StudentDemographics {
  totalUniqueStudents: number;
  newStudentsThisMonth: number;
  returningStudents: number;
  averageCoursesPerStudent: number;
}

export interface EngagementMetrics {
  averageTimeSpent: number; // in minutes
  averageCompletionTime: number; // in days
  dropOffRate: number; // percentage
  mostActiveHours: number[]; // hours of day
}

export interface PlatformStats {
  totalCourses: number;
  totalStudents: number;
  totalCertificates: number;
  totalCreators: number;
}
