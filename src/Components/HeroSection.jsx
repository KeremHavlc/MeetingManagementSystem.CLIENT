import meeting from '../Assets/team-collaboration.png'
const HeroSection = () => {
  return (
    <>
    <div className="w-full flex justify-center mt-20 select-none">
      <div className="w-[1100px] flex justify-between items-center">
        
        {/* Sol Taraf - Metinler */}
        <div className="max-w-[450px]">
          <h1 className="text-white text-5xl font-bold leading-tight">
            Toplantıları Daha  <br /> Akıllı Yönet
          </h1>
          <p className="text-gray-400 mt-4">
            Toplantılarınızı planlayın, yönetin ve takip edin. Verimliliği artırın, zaman kazanın.
          </p>
          <button className="mt-6 bg-[#e63946] hover:bg-[#b82e38] cursor-pointer transition-colors px-6 py-3 rounded-lg font-semibold text-white">
            Ücretsiz Denemeye Başla
          </button>
        </div>

        {/* Sağ Taraf - Görsel */}
        <div>
          <img
            src={meeting}
            alt="Toplantı Paneli"
            className="w-[550px] h-[280px] rounded-xl shadow-lg object-cover"
          />
        </div>

      </div>
     
    </div>
     <div className='flex justify-center border-b mt-20 w-[1100px] border-gray-500'>

      </div>
      </>
  );
};

export default HeroSection;
