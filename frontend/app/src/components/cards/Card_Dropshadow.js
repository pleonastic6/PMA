export default function Card_Dropshadow({ title, description, img }) {
    return (
        <div className="dark:bg-[#000111] dark:border-2 dark:border-gray-600 max-w-sm rounded-xl bg-white p-6 shadow-lg">
            {img && <img src={img} alt={title} className="w-full h-20 rounded-md mb-4" />}
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}