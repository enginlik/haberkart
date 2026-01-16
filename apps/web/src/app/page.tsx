export default function Home() {
    return (
        <div className="p-10">
            <h1 className="text-3xl font-bold mb-6">News Card Generator V2</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 border rounded-lg hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-2">Create New Project</h2>
                    <p className="text-gray-600 mb-4">Start from a blank canvas or select a template.</p>
                    <a href="/editor/new" className="bg-black text-white px-4 py-2 rounded">Open Editor</a>
                </div>

                <div className="p-6 border rounded-lg hover:shadow-lg transition">
                    <h2 className="text-xl font-bold mb-2">Recent Jobs</h2>
                    <p className="text-gray-600 mb-4">View your past generations.</p>
                    <button className="bg-gray-200 text-black px-4 py-2 rounded">View History</button>
                </div>
            </div>
        </div>
    )
}
