import { motion } from "framer-motion"

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center px-4 py-10"
      style={{ backgroundColor: "#1E1E2C" }}
    >

      <div className="relative z-10 w-full max-w-xl lg:max-w-6xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl">

        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-between p-14 text-white bg-gradient-to-br"
             style={{
               backgroundImage:
                 "linear-gradient(135deg, #1E1E2C 0%, #2C2C3F 50%, #1E1E2C 100%)",
             }}
        >
          <div>
            <h1
              className="text-4xl font-bold tracking-tight"
              style={{ color: "#F29F67" }}
            >
              LMS Platform
            </h1>

            <p className="mt-6 text-white/70 max-w-sm leading-relaxed">
              Empower instructors and students with a scalable,
              beautifully designed learning experience.
            </p>
          </div>

          <div className="space-y-2 text-sm text-white/60">
            <p>✔ Smart Course Management</p>
            <p>✔ Real-Time Progress Tracking</p>
            <p>✔ Instructor & Student Roles</p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex items-center justify-center bg-white p-6 sm:p-10 lg:p-14">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md space-y-8"
          >
            <div className="space-y-2 text-center lg:text-left">
              <h2
                className="text-3xl font-bold"
                style={{ color: "#1E1E2C" }}
              >
                {title}
              </h2>

              <p className="text-sm text-gray-500">
                {subtitle}
              </p>

              <div
                className="h-1 w-16 rounded-full mt-3"
                style={{ backgroundColor: "#F29F67" }}
              />
            </div>

            <div className="space-y-5">
              {children}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}