import { NavLink } from "react-router-dom";


function ContinueBtn({text=""}){
    return (
        <div className = "flex justify-end">
            <NavLink to="/SelectingPictures">continue</NavLink>
        </div>
    )
}

export default function SelectingPictures() {

    return (
        <main>
            <div className="flex justify-center">
                <div className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16">
                    <div className="flex flex-col gap-6">
                        <div><h1 className="text-3xl font-extrabold">Load up your pictures</h1><div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" /></div>
                        <input
                            type="file"
                            accept="image/*"
                        />

                        <input
                            type="file"
                            accept="image/*"
                        />

                        <input
                            type="file"
                            accept="image/*"
                        />

                        <ContinueBtn text="continue"/>
                    </div>
                </div>
            </div>
            
        </main>
    )
}