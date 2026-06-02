import ModernInput from "../../components/form_elements/ModernInput";
import "../../data/profiles.json"
import CreatingProfile from "./CreatingProfile";
import { NavLink } from "react-router-dom";

function DateInput({text}) {
    return (
        <div className="flex">
            <label for="birtday" className="ml-2 text">{text}</label>
            <input id="birthday" type="date" value="1953-01-20" className="bg ml-auto" />
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

function ContinueBtn({text=""}){
    return (
        <div className = "flex justify-end">
            <NavLink to="/CreatingProfile">continue</NavLink>
        </div>
    )
}


export default function Register() {
    return (
        <main>
            <div className="flex justify-center">
                <div className="flex rounded-2xl overflow-hidden shadow-lg p-4 m-16">
                    <div className="flex flex-col gap-6">
                        <div><h1 className="text-3xl font-extrabold">Register</h1><div className="relative w-9 h-1 bg-gradient-to-r from-[#af6aff] to-[#df78ff41] rounded" /></div>
                        <ModernInput text="Username" id="usernameI"/>

                        <ModernInput text="Password" input="password" id="passwordI"/>
                        <ModernInput text="Repeat Password" input="password" id="passwordRepeat"/>
                        <DateInput text="Birthday" id="birthdayI"/>
                        <div className="mx-2 text">
                            <p className="mb-1">Gender</p>
                            <div className="flex justify-between">
                                <RadioBtn id="male" text="Male" group="gender"/>
                                <RadioBtn id="female" text="Female" group="gender"/>
                                <RadioBtn id="none" text="Weihnachtsmann" group="gender"/>
                            </div>
                        </div>
                        
                        <ModernInput text="Location"/> 
                        <ContinueBtn text="continue"/>
                    </div>
                </div>
            </div>
        </main>
    )
}