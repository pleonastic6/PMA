export default function Card({ title, description, icon: Icon }) {
    return (
        <div className="max-w-sm p-6">
            <div className="flex gap-4 items-center">
                {Icon && <Icon className="w-12 h-12 text-[#408CFF]" strokeWidth={1.5} />}

                <h2 className="text-3xl font-bold mb-2 w-3/4">{title}</h2>
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}