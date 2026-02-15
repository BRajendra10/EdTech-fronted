import api from "../axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
            .addCase(fetchCourses.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
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
            .addCase(fetchCourses.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            })

            .addCase(fetchCourseById.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchCourseById.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.selectedCourse = action.payload;
            })
            .addCase(fetchCourseById.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            });
    },
});

export const { setStatusFilter, setSearchFilter, setPage, resetFilters } = courseSlice.actions;
export default courseSlice.reducer;
