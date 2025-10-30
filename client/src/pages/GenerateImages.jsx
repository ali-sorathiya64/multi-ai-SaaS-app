import { useAuth } from '@clerk/clerk-react'
import { Image, Sparkles, Download, MoreVertical } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast';
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = [
    'Realistic', 'Ghibli style', 'Anime style', 'Cartoon style',
    'Fantasy style', 'Pixel art', '3D style', 'Portrait style'
  ];

  const [selectedstyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const prompt = `Generate an image ${input} in the style ${selectedstyle}`;
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = content;
    link.download = 'generated_image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setMenuOpen(false);
  };

  return (
    <div className='h-full overflow-y-scroll p-4 sm:p-6 flex flex-col lg:flex-row items-start gap-6 text-slate-700'>
      {/* Left Section */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 sm:p-6 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-2 sm:gap-3'>
          <Sparkles className='w-5 sm:w-6 flex-shrink-0 text-[#00AD25]' />
          <h1 className='text-lg sm:text-xl font-semibold leading-none sm:leading-normal tracking-tight text-slate-800'>
            AI Image Generator
          </h1>
        </div>

        <p className='mt-5 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          rows={4}
          value={input}
          type='text'
          className='w-full p-2 sm:p-3 mt-2 text-sm rounded-md border border-gray-200 outline-none'
          placeholder='Describe what you want to see in the image...'
          required
        />

        <p className='mt-5 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-2 sm:gap-3 flex-wrap'>
          {imageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs sm:text-sm px-3 sm:px-4 py-1.5 border rounded-full cursor-pointer transition-all ${selectedstyle === item
                ? 'bg-green-50 text-green-700 '
                : 'border-gray-300 text-gray-500'
                }`}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image public</p>
        </div>

        <button
          disabled={loading}
          type='submit'
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r 
          from-[#00AD25] to-[#04FF50] text-white px-4 py-2 sm:py-3 mt-6 text-sm sm:text-base rounded-lg cursor-pointer'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Image className='w-4 sm:w-5' />
          )}
          Generate Image
        </button>
      </form>

      {/* Right Section */}
      <div className='relative w-full max-w-lg p-4 sm:p-6 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <Image className='w-5 h-5 text-[#00AD25]' />
            <h1 className='text-lg sm:text-xl font-semibold leading-tight'>
              Generated Image
            </h1>
          </div>

          {content && (
            <div className='relative'>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className='p-2 rounded-full hover:bg-gray-100 transition'
              >
                <MoreVertical className='w-5 h-5 text-gray-600' />
              </button>

              {menuOpen && (
                <div className='absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10'>
                  <button
                    onClick={handleDownload}
                    className='flex items-center gap-2 px-4 py-2 text-sm text-black hover:bg-gray-50 w-full text-left'
                  >
                    <Download className='w-4 h-4 text-black' /> Download 
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm sm:text-base flex flex-col items-center gap-4 sm:gap-5 text-gray-500 text-center'>
              <Image className='w-8 sm:w-9 h-8 sm:h-9' />
              <p>
                Enter a prompt and click <strong>“Generate image”</strong> to get started.
              </p>
            </div>
          </div>
        ) : (
          <img src={content} alt="Generated" className='h-full w-full mt-3' />
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
