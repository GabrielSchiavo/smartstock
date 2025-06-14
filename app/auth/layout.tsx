import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="h-full flex items-center justify-center p-6 bg-radial from-sky-400 via-blue-500 to-blue-800">
            {children}
        </main>
    )
}

export default AuthLayout;