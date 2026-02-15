import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { useRef, useEffect, useState } from "react";
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
import { fetchAllUsers, setRoleFilter, setSearchTerm, setStatusFilter, updateUserStatus } from "../features/slice/userSlice";

const roleStyle = {
    ADMIN: "bg-red-500/10 text-red-500",
    INSTRUCTOR: "bg-blue-500/10 text-blue-500",
    STUDENT: "bg-green-500/10 text-green-500",
};

function UsersPage() {
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const debounceRef = useRef(null);
    const limit = 10;

    const { users, pagination, searchTerm, roleFilter, statusFilter } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(
            fetchAllUsers({
                page,
                limit,
                role: roleFilter !== "ALL" ? roleFilter : undefined,
                status: statusFilter !== "ALL" ? statusFilter : undefined,
                search: searchTerm || undefined,
            })
        );
    }, [dispatch, page, roleFilter, statusFilter, searchTerm]);

    function handleSearch(value) {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(() => {
            dispatch(setSearchTerm(value));
            setPage(1);
        }, 400);
    }

    function handleRoleChange(value) {
        dispatch(setRoleFilter(value));
        setPage(1);
    }

    function handleStatusChange(value) {
        dispatch(setStatusFilter(value));
        setPage(1);
    }

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

                        <Select onValueChange={(value) => handleRoleChange(value)}>
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

                        <Select onValueChange={(value) => handleStatusChange(value)}>
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

                    {/* Table (Dashboard) */}
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
                                {users?.map((user) => (
                                    <TableRow key={user._id}>
                                        <TableCell className="w-65 flex items-center gap-3">
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
                                            <Select
                                                value={user.status}
                                                onValueChange={(value) =>
                                                    dispatch(updateUserStatus({ userId: user._id, status: value }))
                                                }
                                            >
                                                <SelectTrigger className="w-28 h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                    <SelectItem value="PENDING">PENDING</SelectItem>
                                                    <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                                                </SelectContent>
                                            </Select>
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

                    {/* Card (Mobile view) */}
                    <div className="space-y-3 lg:hidden">
                        {users?.map((user) => (
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

                                        <Select
                                            value={user.status}
                                            onValueChange={(value) =>
                                                dispatch(updateUserStatus({ userId: user._id, status: value }))
                                            }
                                        >
                                            <SelectTrigger className="w-28 h-8 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                                                <SelectItem value="PENDING">PENDING</SelectItem>
                                                <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
                                            </SelectContent>
                                        </Select>
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
                            disabled={!pagination?.hasPrevPage}
                            onClick={() => setPage(prev => prev - 1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        <span className="text-sm">
                            Page {pagination?.page} of {pagination?.totalPages}
                        </span>

                        <Button
                            variant="outline"
                            size="icon"
                            disabled={!pagination?.hasNextPage}
                            onClick={() => setPage(prev => prev + 1)}
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
