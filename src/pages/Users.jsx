import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Users, Search, Mail, Calendar, CheckCircle, XCircle } from "lucide-react";
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

    const { currentUser, users, pagination, status, searchTerm, roleFilter, statusFilter } = useSelector((state) => state.users);

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
            <Card className="border-none shadow-none bg-transparent">
                <CardContent className="p-0 space-y-6">
                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email..."
                                className="pl-9 bg-background"
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        <Select onValueChange={handleRoleChange}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All Roles</SelectItem>
                                <SelectItem value="ADMIN">Admin</SelectItem>
                                <SelectItem value="INSTRUCTOR">Instructor</SelectItem>
                                <SelectItem value="STUDENT">Student</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select onValueChange={handleStatusChange}>
                            <SelectTrigger className="w-full sm:w-[180px] bg-background">
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

                    {/* Loading State */}
                    {status === "loading" && (
                        <div className="h-60 flex items-center justify-center text-muted-foreground">
                            Loading users...
                        </div>
                    )}

                    {/* Empty State */}
                    {status !== "loading" && (!users || users.length === 0) && (
                        <div className="h-60 flex flex-col items-center justify-center text-muted-foreground border rounded-lg border-dashed">
                            <Users className="h-10 w-10 mb-3 opacity-50" />
                            <h3 className="font-semibold">No Users Found</h3>
                            <p className="text-sm">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}

                    {status !== "loading" && users && users.length > 0 && (
                        <>
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
                                            {currentUser?.role !== "STUDENT" ? (
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
                                            ) : (
                                                <Badge
                                                    variant="outline" className="text-xs"
                                                // className={roleStyle[user.role]}
                                                >
                                                    {user.status}
                                                </Badge>
                                            )}
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

                    {/* Card (Mobile/Grid view) */}
                    <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
                        {users?.map((user) => (
                            <Card
                                key={user._id}
                                className="flex flex-col overflow-hidden hover:shadow-md transition-all duration-300 border-border/60 group"
                            >
                                {/* Header Pattern */}
                                <div className={`h-20 w-full relative ${
                                    user.role === 'ADMIN' ? 'bg-red-500/10' : 
                                    user.role === 'INSTRUCTOR' ? 'bg-blue-500/10' : 'bg-green-500/10'
                                }`}>
                                    <div className="absolute top-2 right-2">
                                        <Badge 
                                            variant={user.status === "ACTIVE" ? "default" : "secondary"} 
                                            className={`shadow-sm ${user.status === "ACTIVE" ? "bg-green-600 hover:bg-green-700" : ""}`}
                                        >
                                            {user.status}
                                        </Badge>
                                    </div>
                                </div>

                                <CardContent className="p-5 pt-0 flex flex-col flex-1 gap-3">
                                    {/* Avatar */}
                                    <div className="-mt-10 mb-1">
                                        <img
                                            src={user.avatar}
                                            alt={user.fullName}
                                            className="h-20 w-20 rounded-full object-cover border-4 border-background shadow-sm"
                                        />
                                    </div>

                                    {/* User Info */}
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-lg leading-tight truncate">
                                            {user.fullName}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5" />
                                            <span className="truncate">{user.email}</span>
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <Badge variant="outline" className={roleStyle[user.role]}>
                                            {user.role}
                                        </Badge>
                                        
                                        {user.isEmailVerified ? (
                                            <Badge variant="secondary" className="text-xs text-green-600 bg-green-50 border-green-200 flex items-center gap-1">
                                                <CheckCircle className="h-3 w-3" /> Verified
                                            </Badge>
                                        ) : (
                                            <Badge variant="secondary" className="text-xs text-amber-600 bg-amber-50 border-amber-200 flex items-center gap-1">
                                                <XCircle className="h-3 w-3" /> Unverified
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Footer / Actions */}
                                    <div className="mt-auto pt-4 border-t flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        {currentUser?.role !== "STUDENT" && (
                                            <Select
                                                value={user.status}
                                                onValueChange={(value) =>
                                                    dispatch(updateUserStatus({ userId: user._id, status: value }))
                                                }
                                            >
                                                <SelectTrigger className="w-[110px] h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Active</SelectItem>
                                                    <SelectItem value="PENDING">Pending</SelectItem>
                                                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
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
                    </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default UsersPage;
