import transition from '../../../assets/images/transition.svg';
import surfer_waves from '../../../assets/images/surfer_waves.svg';

export default function WhyChoseUsSection() {
    return (
        <section className='bg-gradient-to-r from-[#1B3779] to-[#171853] text-white w-full flex flex-col md:flex-row items-center overflow-hidden'>
            {/* Linke Seite / Text-Inhalt */}
            <div className='w-full md:w-1/2 p-8 md:p-16 flex flex-col items-center md:items-start text-center md:text-left'>
                <h2 className='text-3xl md:text-4xl font-bold mb-6 text-white'>
                    Why choose us?
                </h2>
                <p className='mb-8 text-white/60 leading-relaxed max-w-lg'>
                    This is just another description on why people should choose this app, 
                    just plenty of text to add as this is just an idea and no final product. 
                    You can add plenty of text here as this box holds more information than one may think.
                </p>

                <button className='border border-[#416DFF] bg-[#304FBB] text-white px-8 py-3 rounded-full hover:bg-gradient-to-r hover:from-[#5F59FF] hover:to-[#917DFF] transition-all duration-300 shadow-lg active:scale-95'>
                    Learn more
                </button>
            </div>

            {/* Rechte Seite / Bild */}
            <div className='w-full md:w-1/2 flex justify-center items-end'>
                <img 
                    src={surfer_waves} 
                    alt="Surfer Waves" 
                    className="w-full h-auto max-w-md md:max-w-none pt-10 md:pt-20 object-cover" 
                />
            </div>
        </section>
    );
}