// /components/LoginCard.tsx
import { Link } from "@remix-run/react";

export default function LoginCard() {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
                    Please Login
                </h2>
                <p className="text-gray-600 text-center mb-6">
                    You need to be logged in to access this page.
                </p>
                <Link
                    to="/auth/login"
                    className="block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md text-center"
                >
                    Login
                </Link>
            </div>
        </div>
    );
}
