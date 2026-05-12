import ModernInput from "../../components/form_elements/ModernInput";

function DateInput({text}) {
    return (
        <div className="flex">
            <label for="birtday" className="ml-2 text">{text}</label>
            <input id="birthday" type="date" className="ml-auto text-gray-700" />
        </div>
    )
}

function RadioBtn({id, text, group}) {
    return (
        <div>
            <input id={id} type="radio" name={group} value={id} class="radio" />
            <label for={id}>{text}</label>
        </div>
    )
}

export default function Register() {
    return (
        <main>
            <div className="flex justify-center">
                <div className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16 dark:bg-stone-700">
                    <div className="flex flex-col gap-6">
                        <div><h1 className="text-3xl font-extrabold">Register</h1><div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" /></div>
                        <ModernInput text="Username"/>
                        <ModernInput text="Password" input="password" />
                        <ModernInput text="Repeat Password" input="password" />
                        <DateInput text="Birthday"/>
                        <div className="mx-2 text">
                            <p className="mb-1">Gender</p>
                            <div className="flex justify-between">
                                <RadioBtn id="male" text="Male" group="gender"/>
                                <RadioBtn id="female" text="Female" group="gender"/>
                                <RadioBtn id="none" text="Weihnachtsmann" group="gender"/>
                            </div>
                        </div>
                        
                        <ModernInput text="Location"/>
                    </div>
                </div>
            </div>
        </main>
    )
}