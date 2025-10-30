import { Protect, SignOutButton, useClerk, useUser } from '@clerk/clerk-react'
import { Eraser, FileText, HashIcon, House, Scissors, SquarePen, Users, Image, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const navItems = [
    { to: '/ai', label: 'Dashboard', Icon: House },
    { to: '/ai/write-article', label: 'Write Article', Icon: SquarePen },
    { to: '/ai/blog-titles', label: 'Blog Titles', Icon: HashIcon },
    { to: '/ai/generate-images', label: 'Generate Images', Icon: Image },
    { to: '/ai/remove-background', label: 'Remove Background', Icon: Eraser },
    { to: '/ai/remove-object', label: 'Remove Object', Icon: Scissors },
    { to: '/ai/document-summary', label: 'Document Summary', Icon: FileText },
    { to: '/ai/community', label: 'Community', Icon: Users },
]

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <>
      {/* Overlay for mobile */}
      <div
        onClick={() => setSidebar(false)}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden transition-opacity duration-300 ${
          sidebar ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      ></div>

      {/* Sidebar */}
      <div
        className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center
        max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'}`}
      >
        <div className='my-7 w-full'>
          <img src={user.imageUrl} alt="user_avatar" className='w-13 rounded-full mx-auto' />
          <h1 className='mt-1 text-center'>{user.fullName}</h1>

          <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/ai'}
                onClick={() => setSidebar(false)}
                className={({ isActive }) =>
                  `px-3.5 py-2.5 flex items-center gap-3 rounded transition-all duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white'
                      : 'hover:bg-gray-100'
                  }`
                }
              >
                <Icon className={`w-4 h-4`} />
                {label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className='w-full border-t border-gray-200 px-4 py-7 flex items-center justify-between'>
          <div
            className='flex gap-2 items-center cursor-pointer'
            onClick={openUserProfile}
          >
            <img src={user.imageUrl} alt="" className='w-8 rounded-full' />
            <div>
              <h1 className='text-sm font-medium'>{user.fullName}</h1>
              <p className='text-xs text-gray-500'>
                <Protect />
              </p>
            </div>
          </div>
          <LogOut
            onClick={signOut}
            className='w-4.5 text-gray-400 hover:text-gray-700 transition cursor-pointer'
          />
        </div>
      </div>
    </>
  );
};

export default Sidebar
