import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-full flex items-center justify-center bg-radial from-sky-400 to-blue-800 p-6">
            {children}
        </div>
    )
}

export default AuthLayout;