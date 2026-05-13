import ModernInput from "../../components/form_elements/ModernInput";
import img_beispielbild from "../../assets/images/Beispielbild.png"

export default function Profile() {
    return (
        <main>
            <div className="flex justify-center">
                <div className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16 dark:bg-stone-700">
                    <div className="flex flex-col gap-6">
                        <div><h1 className="text-3xl font-extrabold">Platzhalter Profil</h1><div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" /></div>
                        
                        <img src={img_beispielbild} className="w-full h-full object-cover object-[-0px]" />
                        
                        <p className="mb-1">Platzhalter Text</p>
                        
                    </div>
                </div>
            </div>
        </main>
    )
}