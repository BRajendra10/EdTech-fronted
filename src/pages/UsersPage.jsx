import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useReducer, useRef, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers } from "../features/slice/userSlice";


const roleStyle = {
    ADMIN: "bg-red-500/10 text-red-500",
    INSTRUCTOR: "bg-blue-500/10 text-blue-500",
    STUDENT: "bg-green-500/10 text-green-500",
};

const statusStyle = {
    ACTIVE: "bg-green-500/10 text-green-500",
    PENDING: "bg-yellow-500/10 text-yellow-500",
    SUSPENDED: "bg-red-500/10 text-red-500",
};

const ACTIONS = {
    HYDRATE_USERS: "hydrate-users",
    SEARCH_USER: "search-user",
    FILTER_USER: "filter-user",
    NEXT_PAGE: "next-page",
    PREV_PAGE: "prev-page",
}

const INITIAL_STATE = {
    allUsers: [],
    filteredUsers: [],
};

function reducer(users, action) {
    switch (action.type) {
        case ACTIONS.HYDRATE_USERS: {
            return {
                allUsers: action.payload,
                filteredUsers: action.payload,
            }
        }
        case ACTIONS.SEARCH_USER: {
            const search = action.payload.toLowerCase();

            const filtered = users.allUsers.filter(user =>
                user.fullName.toLowerCase().includes(search)
            );

            return {
                ...users,
                filteredUsers: filtered,
            };
        }
        case ACTIONS.FILTER_USER: {
            const selected = action.payload.toLowerCase();
            if (selected === "all") {
                return {
                    ...users,
                    filteredUsers: users.allUsers
                }
            }

            const filtered = users.allUsers.filter(user =>
                user.role.toLowerCase().includes(selected) ||
                user.status.toLowerCase().includes(selected)
            );

            return {
                ...users,
                filteredUsers: filtered,
            }
        }
        case ACTIONS.NEXT_PAGE:
            if (!action.payload?.hasNextPage) return users;
            return { ...users, page: users.page + 1 };

        case ACTIONS.PREV_PAGE:
            if (!action.payload?.hasPrevPage) return users;
            return { ...users, page: users.page - 1 };

        default: return users
    }
}

function UsersPage() {
    const [page, setPage] = useState(1);
    const [users, dispatch] = useReducer(reducer, INITIAL_STATE);
    const debounceRef = useRef(null);

    const reduxDispatch = useDispatch();
    const limit = 10;

    const { users: usersData, pagination } = useSelector((state) => state.users);

    function handleSearch(value) {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            dispatch({
                type: ACTIONS.SEARCH_USER,
                payload: value,
            });
        }, 400);
    }

    function handleSelect(value) {
        dispatch({
            type: ACTIONS.FILTER_USER,
            payload: value
        })
    }

    useEffect(() => {
        reduxDispatch(fetchAllUsers({ page, limit }))
    }, [page, limit, reduxDispatch])

    useEffect(() => {
        if (usersData?.length) {
            dispatch({ type: ACTIONS.HYDRATE_USERS, payload: usersData })
        }
    }, [usersData])

    return (
        <div className="space-y-6 animate-in fade-in">
            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>

                <CardContent>
                    {/* Filters (UI only) */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-4">
                        <Input placeholder="Search users..." className="sm:max-w-xs" onChange={(e) => handleSearch(e.target.value)} />

                        <Select onValueChange={(value) => handleSelect(value)}>
                            <SelectTrigger className="sm:max-w-xs">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                <SelectItem value="STUDENT">Student</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => handleSelect(value)}>
                            <SelectTrigger className="sm:max-w-xs">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Status</SelectItem>
                                <SelectItem value="ACTIVE">Active</SelectItem>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Table */}
                    <div className="hidden lg:block rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Verified</TableHead>
                                    <TableHead>Created</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {users.filteredUsers.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="w-[260px] flex items-center gap-3">
                                            <img
                                                src={user.avatar}
                                                alt={user.fullName}
                                                className="h-8 w-8 rounded-full object-cover"
                                            />

                                            <div className="flex flex-col min-w-0">
                                                <span className="font-medium truncate">
                                                    {user.fullName}
                                                </span>

                                                <span className="text-slate-500 text-xs hidden sm:block truncate">
                                                    {user.email}
                                                </span>
                                            </div>
                                        </TableCell>

                                        {/* <TableCell>{user.email}</TableCell> */}

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={roleStyle[user.role]}
                                            >
                                                {user.role}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={statusStyle[user.status]}
                                            >
                                                {user.status}
                                            </Badge>
                                        </TableCell>

                                        <TableCell>
                                            {user.isEmailVerified ? "Yes" : "No"}
                                        </TableCell>

                                        <TableCell>
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="space-y-3 lg:hidden">
                        {users.filteredUsers.map((user) => (
                            <Card
                                key={user._id}
                                className="border border-border/60 shadow-sm active:scale-[0.98] transition-transform"
                            >
                                <CardContent className="p-4 space-y-4">

                                    {/* Header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <img
                                                src={user.avatar}
                                                alt={user.fullName}
                                                className="h-11 w-11 rounded-full object-cover"
                                            />

                                            <div className="min-w-0">
                                                <p className="font-medium leading-tight truncate">
                                                    {user.fullName}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Status dot */}
                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${user.status === "ACTIVE"
                                                    ? "bg-green-500"
                                                    : user.status === "PENDING"
                                                        ? "bg-yellow-500"
                                                        : "bg-red-500"
                                                }`}
                                        />
                                    </div>

                                    {/* Role & Status */}
                                    <div className="flex gap-2">
                                        <Badge
                                            variant="outline"
                                            className={`${roleStyle[user.role]} text-xs`}
                                        >
                                            {user.role}
                                        </Badge>

                                        <Badge
                                            variant="outline"
                                            className={`${statusStyle[user.status]} text-xs`}
                                        >
                                            {user.status}
                                        </Badge>
                                    </div>

                                    {/* Meta grid */}
                                    <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                                        <div>
                                            <p className="uppercase tracking-wide text-[10px]">Verified</p>
                                            <p className="font-medium text-foreground">
                                                {user.isEmailVerified ? "Yes" : "No"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="uppercase tracking-wide text-[10px]">Joined</p>
                                            <p className="font-medium text-foreground">
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                </CardContent>
                            </Card>

                        ))}
                    </div>


                    {/* Pagination (UI only) */}
                    <div className="flex items-center justify-end gap-3 mt-4">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handlePrevPage}
                            disabled={!pagination?.hasPrevPage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm">
                            Page {pagination?.page} of {pagination?.totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleNextPage}
                            disabled={!pagination?.hasNextPage}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
};

export default UsersPage;
