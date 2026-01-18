export default function ArticleCard() {
    return (
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-lg shadow-md p-4 mb-4">
            <h3 className="text-lg font-bold mb-2">Article Title Here</h3>
            <p className="text-sm text-gray-700 mb-2">This is a brief summary of the article content. It provides an overview of the main points discussed in the article.</p>
            <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Source: Example News</span>
                <span>Date: 2024-06-15</span>
            </div>
        </div>
    );

}