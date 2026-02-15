import api from "../axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const login = createAsyncThunk(
    "user/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/login", {
                email,
                password,
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);

export const signup = createAsyncThunk(
    "user/signup",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/signup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    "users/fetchAll",
    async ({ page = 1, limit = 10, role, status, search }, { rejectWithValue }) => {
        try {
            const response = await api.get("/users/all", {
                params: { page, limit, role, status, search }
            });
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to fetch users"
            );
        }
    }
);

export const verifyOtp = createAsyncThunk(
    "user/verifyOtp",
    async ({ verificationCode, userId }, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/verify-otp", {
                verificationCode,
                userId,
            });

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);

export const resendVerificationOtp = createAsyncThunk(
    "user/resendVerificationOtp",
    async ({ userId }, { rejectWithValue }) => {
        try {
            const response = await api.post("/users/resend-verification-otp", {
                userId,
            });

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || "Something went wrong");
        }
    }
);


export const changePassword = createAsyncThunk(
    "user/changePassword",
    async ({ currentPassword, newPassword }, { rejectWithValue }) => {
        try {
            const res = await api.post(
                "/users/change-password",
                { currentPassword, newPassword }
            );

            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to update password"
            );
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post("/users/logout");
            return res.data;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Logout failed"
            );
        }
    }
);

export const updateUserStatus = createAsyncThunk(
    "users/updateStatus",
    async ({ userId, status }, { rejectWithValue }) => {
        try {
            const response = await api.patch(
                `/users/status/${userId}`,
                { status }
            );
            return response.data.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update status"
            );
        }
    }
);


// SELECTOR
export const selectFilteredUsers = (state) => {
    const { users, searchTerm, roleFilter, statusFilter } = state.users;

    return users.filter(user => {

        const matchesSearch =
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRole =
            roleFilter === "ALL" || user.role === roleFilter;

        const matchesStatus =
            statusFilter === "ALL" || user.status === statusFilter;

        return matchesSearch && matchesRole && matchesStatus;
    });
};

const initialState = {
    currentUser: null,
    users: [],
    pagination: {},

    searchTerm: "",
    roleFilter: "ALL",
    statusFilter: "ALL",

    status: "idle",
    error: null
}


const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        logout: (state) => {
            state.currentUser = null;
            state.status = "idle";
            state.error = null;
        },

        getCurrentUser: (state) => {
            const storedUser = localStorage.getItem("currentUser");

            if (storedUser) {
                state.currentUser = JSON.parse(storedUser);
            } else {
                state.currentUser = null;
            }
        },

        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },

        setRoleFilter: (state, action) => {
            state.roleFilter = action.payload;
        },

        setStatusFilter: (state, action) => {
            state.statusFilter = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            // login user
            .addCase(login.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.currentUser = action.payload?.data ?? null;
                state.status = "fulfilled";
            })
            .addCase(login.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "Login failed";
            })

            // SIGNUP
            .addCase(signup.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(signup.fulfilled, (state, action) => {
                state.currentUser = action.payload?.data ?? null;
                state.status = "fulfilled";
            })
            .addCase(signup.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "signup failed";
            })

            // VERIFY OTP
            .addCase(verifyOtp.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state) => {
                state.status = "fulfilled";
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "OTP verification failed";
            })

            // RESEND VERIFY OTP
            .addCase(resendVerificationOtp.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(resendVerificationOtp.fulfilled, (state) => {
                state.status = "fulfilled";
            })
            .addCase(resendVerificationOtp.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "Failed to resend OTP";
            })

            // Change password
            .addCase(changePassword.pending, (state) => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.status = "fulfilled";
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "Something went wrong";
            })

            // Logout user
            .addCase(logoutUser.pending, (state) => {
                state.status = "pending";
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.status = "fulfilled";
                state.currentUser = null;
                localStorage.setItem("currentUser", JSON.stringify({}))
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload || "Logout failed";
            })

            // Fetching all users
            .addCase(fetchAllUsers.pending, state => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.status = "fulfilled";
                state.users = action.payload.docs;
                state.pagination = {
                    totalPages: action.payload.totalPages,
                    currentPage: action.payload.page,
                    hasNextPage: action.payload.hasNextPage,
                    hasPrevPage: action.payload.hasPrevPage,
                };
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            })

            // update user status
            .addCase(updateUserStatus.pending, state => {
                state.status = "pending";
                state.error = null;
            })
            .addCase(updateUserStatus.fulfilled, (state, action) => {
                const updatedUser = action.payload;

                const index = state.users.findIndex(
                    user => user._id === updatedUser._id
                );

                if (index !== -1) {
                    state.users[index].status = updatedUser.status;
                }
            })
            .addCase(updateUserStatus.rejected, (state, action) => {
                state.status = "rejected";
                state.error = action.payload;
            })

    }
});


export default userSlice.reducer;
export const { logout, getCurrentUser, setSearchTerm, setRoleFilter, setStatusFilter } = userSlice.actions;
