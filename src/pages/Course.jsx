import React from "react";
import {
    Plus,
    Search,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
    SlidersHorizontal,
} from "lucide-react";

import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";

const CoursesPage = () => {
    return (
        <div>
            {/* ================= Header ================= */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
                    <p className="text-sm text-slate-500">
                        12 courses · 3 categories
                    </p>
                </div>

                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-md hover:bg-slate-800 transition">
                    <Plus size={16} />
                    New Course
                </button>
            </div>

            {/* ================= Tabs + Actions ================= */}
            <Tabs defaultValue="ALL">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
                    {/* Tabs */}
                    <TabsList className="bg-white border border-slate-200 rounded-md p-1 h-auto">
                        <TabsTrigger value="ALL" className="text-xs">
                            All
                        </TabsTrigger>
                        <TabsTrigger value="PUBLISHED" className="text-xs">
                            Published
                        </TabsTrigger>
                        <TabsTrigger value="DRAFT" className="text-xs">
                            Draft
                        </TabsTrigger>
                        <TabsTrigger value="UNPUBLISHED" className="text-xs">
                            Unpublished
                        </TabsTrigger>
                    </TabsList>

                    {/* Search & Sort */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative w-full md:w-64">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                placeholder="Search courses"
                                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                        </div>

                        <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-md bg-white hover:bg-slate-100">
                            <SlidersHorizontal size={16} />
                            Sort
                        </button>
                    </div>
                </div>

                {/* ================= ALL ================= */}
                <TabsContent value="ALL">
                    <CoursesGrid>
                        <CourseCard
                            status="PUBLISHED"
                            title="Backend with Node.js"
                            description="Build scalable backend services."
                            price="$49"
                            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                        />
                        <CourseCard
                            status="DRAFT"
                            title="Advanced React Patterns"
                            description="Hooks, compound components."
                            price="Free"
                            image="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800"
                        />
                        <CourseCard
                            status="UNPUBLISHED"
                            title="UI/UX for Developers"
                            description="Design fundamentals for engineers."
                            price="$29"
                            image="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800"
                        />
                        <CourseCard
                            status="PUBLISHED"
                            title="Docker & Kubernetes"
                            description="Containerization from scratch."
                            price="$59"
                            image="https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800"
                        />
                        <CourseCard
                            status="DRAFT"
                            title="Advanced React Patterns"
                            description="Hooks, compound components."
                            price="Free"
                            image="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800"
                        />
                        <CourseCard
                            status="UNPUBLISHED"
                            title="UI/UX for Developers"
                            description="Design fundamentals for engineers."
                            price="$29"
                            image="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800"
                        />
                        <CourseCard
                            status="PUBLISHED"
                            title="Docker & Kubernetes"
                            description="Containerization from scratch."
                            price="$59"
                            image="https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800"
                        />
                        <CourseCard
                            status="PUBLISHED"
                            title="Backend with Node.js"
                            description="Build scalable backend services."
                            price="$49"
                            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                        />
                    </CoursesGrid>
                </TabsContent>

                {/* ================= PUBLISHED ================= */}
                <TabsContent value="PUBLISHED">
                    <CoursesGrid>
                        <CourseCard
                            status="PUBLISHED"
                            title="Backend with Node.js"
                            description="Build scalable backend services."
                            price="$49"
                            image="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"
                        />
                        <CourseCard
                            status="PUBLISHED"
                            title="Docker & Kubernetes"
                            description="Containerization from scratch."
                            price="$59"
                            image="https://images.unsplash.com/photo-1605745341112-85968b193ef5?w=800"
                        />
                    </CoursesGrid>
                </TabsContent>

                {/* ================= DRAFT ================= */}
                <TabsContent value="DRAFT">
                    <CoursesGrid>
                        <CourseCard
                            status="DRAFT"
                            title="Advanced React Patterns"
                            description="Hooks, compound components."
                            price="Free"
                            image="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800"
                        />
                        <CourseCard
                            status="DRAFT"
                            title="Advanced React Patterns"
                            description="Hooks, compound components."
                            price="Free"
                            image="https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800"
                        />
                    </CoursesGrid>
                </TabsContent>

                {/* ================= UNPUBLISHED ================= */}
                <TabsContent value="UNPUBLISHED">
                    <CoursesGrid>
                        <CourseCard
                            status="UNPUBLISHED"
                            title="UI/UX for Developers"
                            description="Design fundamentals for engineers."
                            price="$29"
                            image="https://images.unsplash.com/photo-1558655146-d09347e92766?w=800"
                        />
                    </CoursesGrid>
                </TabsContent>
            </Tabs>

            {/* ================= Pagination ================= */}
            <div className="flex items-center justify-between mt-8 text-sm">
                <span className="text-slate-500">Showing 1–4 of 12</span>
                <div className="flex gap-1">
                    <button className="p-2 border rounded-md text-slate-500 hover:bg-slate-100">
                        <ChevronLeft size={16} />
                    </button>
                    {[1, 2, 3].map(p => (
                        <button
                            key={p}
                            className={`px-3 py-1.5 rounded-md ${p === 1
                                    ? "bg-slate-900 text-white"
                                    : "border hover:bg-slate-100"
                                }`}
                        >
                            {p}
                        </button>
                    ))}
                    <button className="p-2 border rounded-md hover:bg-slate-100">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ================= Grid Wrapper ================= */
const CoursesGrid = ({ children }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
    </div>
);

/* ================= Course Card ================= */
const CourseCard = ({ status, title, description, price, image }) => {
    const statusMap = {
        PUBLISHED: "bg-emerald-100 text-emerald-700",
        DRAFT: "bg-amber-100 text-amber-700",
        UNPUBLISHED: "bg-rose-100 text-rose-700",
    };

    return (
        <div className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-slate-300 transition">
            <div className="h-36 bg-slate-100">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                    <span
                        className={`text-xs font-medium px-2 py-0.5 rounded ${statusMap[status]}`}
                    >
                        {status}
                    </span>
                    <MoreVertical size={16} className="text-slate-400" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                        {description}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold">{price}</span>
                    <button className="text-xs font-medium text-indigo-600 hover:underline">
                        Manage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;
