import transition from '../../../assets/images/transition.svg';
import surfer_waves from '../../../assets/images/surfer_waves.svg';

export default function WhyChoseUsSection() {
    return (
        <section className='bg-gradient-to-r from-[#1B3779] to-[#171853] text-white w-full flex'>
            <div className='w-1/2 p-8'>
                <h2 className='text-5xl font-bold mb-6 text-white'>Why choose us?</h2>
                <p className='text-xl mb-6 text-white/60'>this is just another description on why people should choose this app, just plenty of text to add as this is just an idea and no final product. You can add plenty of text here as this box holds more information than one may think</p>

                <button className='border border-[#416DFF] bg-[#304FBB] text-white px-6 py-2 rounded-full hover:bg-gradient-to-r hover:from-[#5F59FF] hover:to-[#917DFF] transition-colors'>
                    Learn more
                </button>
            </div>
            <div className='w-1/2'>
                <img src={surfer_waves} alt="Surfer Waves" className="w-full h-auto pt-20" />
            </div>

        </section>
    );
}