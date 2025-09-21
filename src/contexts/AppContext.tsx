import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  AppState,
  User,
  Notification,
  EnrolledCourse,
  PlatformStats,
} from "../types";
import { useSupabase } from "../hooks/useSupabase";
import { toast } from "react-toastify";

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  setUser: (user: User | null) => void;
  navigateTo: (path: string) => void;
  toggleTheme: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">
  ) => void;
  coursesEnrolled: EnrolledCourse[];
  fetchEnrolledCourses: (userId: string) => void;
  stats: PlatformStats;
  loadStats: () => void;
}

type AppAction =
  | { type: "SET_USER"; payload: User | null }
  | { type: "TOGGLE_THEME" };

const initialState: AppState = {
  user: null,
  theme: "light",
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  if (action.type === "SET_USER") {
    return { ...state, user: action.payload };
  }
  if (action.type === "TOGGLE_THEME") {
    return { ...state, theme: state.theme === "light" ? "dark" : "light" };
  }
  return state;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { getEnrolledCourses } = useSupabase();
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [coursesEnrolled, setCoursesEnrolled] = useState<EnrolledCourse[]>([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalStudents: 0,
    totalCertificates: 0,
    totalCreators: 0,
  });
  const navigate = useNavigate();

  const setUser = (user: User | null) => {
    dispatch({ type: "SET_USER", payload: user });
  };

  const navigateTo = (path: string) => {
    navigate(path);
  };

  const toggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "isRead">
  ) => {
    if (notification.type === "success") {
      toast.success(notification.message);
    } else if (notification.type === "error") {
      toast.error(notification.message);
    } else if (notification.type === "info") {
      toast.info(notification.message);
    } else {
      toast.warning(notification.message);
    }
  };

  const { getPlatformStats } = useSupabase();

  const loadStats = async () => {
    try {
      const platformStats = await getPlatformStats();
      setStats(platformStats);
    } catch (error) {
      console.error("Failed to load platform stats:", error);
    }
  };

  const fetchEnrolledCourses = async (userId: string) => {
    const courses = await getEnrolledCourses(userId);
    setCoursesEnrolled(courses);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        setUser,
        navigateTo,
        toggleTheme,
        addNotification,
        coursesEnrolled,
        fetchEnrolledCourses,
        stats,
        loadStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
