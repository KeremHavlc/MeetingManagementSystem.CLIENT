import Groups2Icon from '@mui/icons-material/Groups2';

const Header = () => {
  return (
    <div className="flex justify-center select-none">
      <div className="border-b border-gray-500 w-[1100px] h-[70px] flex justify-between items-center px-4">

        {/* Sol Taraf */}
        <div className="flex items-center gap-2">
          <Groups2Icon
            className="text-[#e63946] transition-colors cursor-pointer duration-300 ease-in-out hover:text-[#b82e38]"
            fontSize="large"
          />
          <h1 className="text-white text-2xl font-semibold cursor-pointer transition-colors duration-300 ease-in-out hover:text-[#e63946]">
            Toplantı Yönetim Sistemi
          </h1>
        </div>

        {/* Sağ Taraf */}
        <div className="flex items-center gap-4">
          <button className="text-white text-lg transition-colors cursor-pointer duration-300 ease-in-out hover:text-[#e63946]">
            Özellikler
          </button>

          <button className="text-white text-lg transition-colors cursor-pointer duration-300 ease-in-out hover:text-[#e63946]">
            Giriş Yap
          </button>

          <button className="w-[125px] h-[40px] rounded-3xl bg-[#e63946] cursor-pointer text-white text-lg font-semibold flex justify-center items-center transition-colors duration-300 ease-in-out hover:bg-[#b82e38]">
            Üye Ol
          </button>
        </div>

      </div>
    </div>
  );
};

export default Header;
