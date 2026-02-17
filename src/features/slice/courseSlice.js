import api from "../axios";
import { createSlice, createAsyncThunk, isPending, isRejected } from "@reduxjs/toolkit";

/* ==============================
   FETCH ALL COURSES
================================ */
export const fetchCourses = createAsyncThunk(
    "courses/fetchAll",
    async (_, { getState, rejectWithValue }) => {
        try {
            const { filters } = getState().courses;

            const response = await api.get("/courses", {
                params: {
                    page: filters.page,
                    status: filters.status !== "ALL" ? filters.status : undefined,
                    search: filters.search || undefined,
                },
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch courses"
            );
        }
    }
);

/* ==============================
   FETCH COURSE BY ID
================================ */
export const fetchCourseById = createAsyncThunk(
    "courses/fetchById",
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/courses/${courseId}`);
            return response.data.data[0];
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch course"
            );
        }
    }
);

/* ==============================
   CREATE COURSE
================================ */
export const createCourse = createAsyncThunk(
    "courses/create",
    async (courseData, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            Object.keys(courseData).forEach((key) => {
                formData.append(key, courseData[key]);
            });

            const response = await api.post("/courses/add", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create course"
            );
        }
    }
);

/* ==============================
   ASSIGN COURSE
================================ */
export const assignCourse = createAsyncThunk(
    "courses/assign",
    async ({ courseId, userId }, { rejectWithValue }) => {
        try {
            const response = await api.post("/courses/assign", {
                courseId,
                userId,
            });

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to assign course"
            );
        }
    }
);

export const addModule = createAsyncThunk(
    "modules/addModule",
    async ({ courseId, formData }, { rejectWithValue }) => {
        try {
            const response = await api.post(
                `/modules/${courseId}`,
                formData
            )
            return response.data.data
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add module"
            )
        }
    }
)

export const addLesson = createAsyncThunk(
    "lessons/addLesson",
    async ({ moduleId, lessonData }, { rejectWithValue }) => {
        try {
            const formData = new FormData();

            Object.keys(lessonData).forEach((key) => {
                formData.append(key, lessonData[key]);
            });

            const response = await api.post(
                `/lessons/${moduleId}`,
                formData,
            );

            return {
                moduleId,
                lesson: response.data.data,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to add lesson"
            );
        }
    }
);

/* ==============================
   UPDATE COURSE
================================ */
export const updateCourse = createAsyncThunk(
    "courses/updateCourse",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                "/courses",
                formData
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update course"
            );
        }
    }
);


/* ==============================
   UPDATE MODULE
================================ */
export const updateModule = createAsyncThunk(
    "modules/updateModule",
    async ({ moduleId, formDataValues }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/modules/${moduleId}`, formDataValues);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update module"
            );
        }
    }
);

/* ==============================
   UPDATE LESSON
================================ */
export const updateLesson = createAsyncThunk(
    "lessons/updateLesson",
    async ({ lessonId, formData }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/lessons/${lessonId}`, formData);

            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update lesson"
            );
        }
    }
);

export const updateCourseStatus = createAsyncThunk(
    "courses/updateCourseStatus",
    async ({ courseId, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch("/courses/status", { courseId, status });

            return response.data.data; // returns updated course
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Failed to update status");
        }
    }
);


/* ==============================
   INITIAL STATE
================================ */
const initialState = {
    courses: [],
    selectedCourse: null,
    pagination: {
        page: 1,
        totalPages: 1,
        totalDocs: 0,
        hasNextPage: false,
        hasPrevPage: false,
    },
    filters: {
        page: 1,
        status: "ALL",
        search: "",
    },
    status: "idle",
    error: null,
    moduleStatus: "idle",
    moduleError: null,
    lessonStatus: "idle",
    lessonError: null,
};

/* ==============================
   SLICE
================================ */
const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        setStatusFilter: (state, action) => {
            state.filters.status = action.payload;
            state.filters.page = 1;
        },

        setSearchFilter: (state, action) => {
            state.filters.search = action.payload;
            state.filters.page = 1;
        },

        setPage: (state, action) => {
            state.filters.page = action.payload;
        },

        resetFilters: (state) => {
            state.filters = {
                page: 1,
                status: "ALL",
                search: "",
            };
        },
    },

    extraReducers: (builder) => {
        builder
            // Fetching all courses
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.courses = action.payload.docs;

                state.pagination = {
                    page: action.payload.page,
                    totalPages: action.payload.totalPages,
                    totalDocs: action.payload.totalDocs,
                    hasNextPage: action.payload.hasNextPage,
                    hasPrevPage: action.payload.hasPrevPage,
                };
            })

            // Fetchign course by id
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.selectedCourse = action.payload;
            })

            // Creating new course
            .addCase(createCourse.fulfilled, (state, action) => {
                state.status = "fulfilled";

                // Add new course to top of list (optional)
                state.courses.unshift(action.payload);
            })

            // Assigning course
            .addCase(assignCourse.fulfilled, (state, action) => {
                const updatedCourse = action.payload;

                // Update course inside list
                const index = state.courses.findIndex(
                    (course) => course._id === updatedCourse._id
                );

                if (index !== -1) {
                    state.courses[index] = updatedCourse;
                }

                // Update selectedCourse if open
                if (state.selectedCourse?._id === updatedCourse._id) {
                    state.selectedCourse = updatedCourse;
                }
            })

            .addCase(updateCourse.fulfilled, (state, action) => {
                state.status = "fulfilled";

                const updatedCourse = action.payload;

                const index = state.courses.findIndex(
                    (c) => c._id === updatedCourse._id
                );

                if (index !== -1) {
                    state.courses[index] = updatedCourse;
                }

                if (state.selectedCourse?._id === updatedCourse._id) {
                    state.selectedCourse = updatedCourse;
                }
            })

            .addCase(addModule.fulfilled, (state, action) => {
                state.moduleStatus = "fulfilled"

                if (state.selectedCourse) {
                    state.selectedCourse.modules = [
                        ...(state.selectedCourse.modules || []),
                        action.payload
                    ]
                }
            })

            .addCase(updateModule.fulfilled, (state, action) => {
                state.moduleStatus = "fulfilled";

                const updatedModule = action.payload;

                if (state.selectedCourse?.modules) {
                    const index = state.selectedCourse.modules.findIndex(
                        (m) => m._id === updatedModule._id
                    );

                    if (index !== -1) {
                        state.selectedCourse.modules[index] = updatedModule;
                    }
                }
            })


            .addCase(addLesson.fulfilled, (state, action) => {
                state.lessonStatus = "fulfilled";

                const { moduleId, lesson } = action.payload;

                if (state.selectedCourse?.modules) {
                    const module = state.selectedCourse.modules.find(
                        (m) => m._id === moduleId
                    );

                    if (module) {
                        module.lessons = [...(module.lessons || []), lesson];
                    }
                }
            })

            .addCase(updateLesson.fulfilled, (state, action) => {
                state.lessonStatus = "fulfilled";

                const updatedLesson = action.payload;

                if (state.selectedCourse?.modules) {
                    state.selectedCourse.modules.forEach((module) => {
                        const lessonIndex = module.lessons?.findIndex(
                            (l) => l._id === updatedLesson._id
                        );

                        if (lessonIndex !== -1 && lessonIndex !== undefined) {
                            module.lessons[lessonIndex] = updatedLesson;
                        }
                    });
                }
            })

            .addCase(updateCourseStatus.fulfilled, (state, action) => {
                const index = state.courses.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.courses[index].status = action.payload.status;
                }
            })

            // Course matcher
            .addMatcher(isPending(fetchCourses, fetchCourseById, createCourse, assignCourse, updateCourse), (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addMatcher(isRejected(fetchCourses, fetchCourseById, createCourse, assignCourse, updateCourse), (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            })

            // Modules matcher
            .addMatcher(isPending(addModule, updateModule), (state) => {
                state.moduleStatus = "pending";
                state.moduleError = null;
            })
            .addMatcher(isRejected(addModule, updateModule), (state, action) => {
                state.moduleStatus = "rejected";
                state.moduleError = action.payload;
            })

            // Lessons matcher
            .addMatcher(isPending(addLesson, updateLesson), (state) => {
                state.lessonStatus = "pending";
                state.lessonError = null;
            })
            .addMatcher(isRejected(addLesson, updateLesson), (state, action) => {
                state.lessonStatus = "rejected";
                state.lessonError = action.payload;
            })
    },
});

export const { setStatusFilter, setSearchFilter, setPage, resetFilters } = courseSlice.actions;
export default courseSlice.reducer;
