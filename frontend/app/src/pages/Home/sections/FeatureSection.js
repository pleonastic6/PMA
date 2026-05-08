import Card from "../../../components/cards/Card"
import { SmilePlus, EyeClosed, CupSoda, BatteryMedium, Briefcase, CarFront } from "lucide-react";

export default function FeatureSection() {
    let Features = [
        {
            title: "Connect with People",
            description: "Meet new friends and expand your social circle.",
            img: SmilePlus
        },
        {
            title: "Share common Interests",
            description: "Find people who share your hobbies and passions.",
            img: EyeClosed
        },
        {
            title: "Build Relationships",
            description: "Create meaningful connections with like-minded individuals.",
            img: CupSoda
        },
                {
            title: "Meet face to face",
            description: "Find people who share your hobbies and passions.",
            img: Briefcase
        },
                {
            title: "this is another feature",
            description: "Find people who share your hobbies and passions.",
            img: BatteryMedium
        },
                {
            title: "Share your Interests",
            description: "Find people who share your hobbies and passions.",
            img: CarFront
        },
    ]
    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-bold text-center mb-2">What we offer</h1>
                <p className="text-center mb-12">We offer a variety of interesting features that increase your chance of success</p>
                <div className="grid md:grid-cols-3 grid-cols-1 gap-8">
                    {Features.map((feature, index) => (
                        <Card
                            key={index}
                            title={feature.title}
                            description={feature.description}
                            icon={feature.img}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}