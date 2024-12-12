'use client'
import React, { useState } from 'react'
import { AiOutlineRobot } from 'react-icons/ai';
import { FaUser, FaSignOutAlt, FaGoogle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signOut, useSession } from 'next-auth/react';
import { LuBrain } from 'react-icons/lu';
import { PiChatCircleDotsBold } from 'react-icons/pi';
import { useRouter } from 'next/navigation';
import { BsFlower1 } from 'react-icons/bs';
import { signOutUser } from '../lib/auth';
function Navbar() {
  const [openMenu, setOpenMenu] = useState(false);
  const [showBrainTooltip, setShowBrainTooltip] = useState(false);
  const [showChatTooltip, setShowChatTooltip] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  console.log("image: ", session?.user?.image)

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
        className="flex justify-between rounded-full w-2/3 bg-gradient-to-t from-[rgb(146,172,232)] to-[rgb(160,193,243)] ml-auto mr-auto items-center py-4 px-6 text-white relative">
        
        <div className="flex">
          <BsFlower1 size={28} className="mr-2" />
        </div>
        <div className='group relative flex items-center gap-1 bg-[rgb(160,193,243)] px-8 py-2 text-lg text-yellow-300 cursor-pointer hover:bg-blue-200 font-bold rounded-full'
             onMouseEnter={() => setShowBrainTooltip(true)}
             onMouseLeave={() => setShowBrainTooltip(false)}
             onClick={()=>router.push('/pages/exercise')}>
          <LuBrain size={28} className='text-white' />
          <AnimatePresence>
            {showBrainTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap"
              >
                Meditation exercises
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className='group relative flex items-center gap-1 bg-[rgb(160,193,243)] hover:bg-blue-200 cursor-pointer px-8 py-2 text-lg text-yellow-300 font-bold rounded-full'
             onMouseEnter={() => setShowChatTooltip(true)}
             onMouseLeave={() => setShowChatTooltip(false)}
             onClick={()=> router.push('pages/chat')}>
          <PiChatCircleDotsBold size={28} className='text-white' />
          <AnimatePresence>
            {showChatTooltip && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.2 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md whitespace-nowrap"
              >
                Start chatting
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpenMenu(!openMenu)}
            className="flex items-center space-x-3 cursor-pointer bg-white/10 rounded-full px-4 py-2"
          >
            {session?.user ? (
              <>
                <span className="text-sm font-medium">
                  Welcome, {session.user.name?.split(' ')[0]}
                </span>
                <motion.img
                  src={session.user.image}
                  alt="Profile"
                  className="w-8 h-8 rounded-full ring-2 ring-white/50 object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <FaUser className="text-xl" />
                <span className="text-sm font-medium">Sign In</span>
              </div>
            )}
          </motion.div>

          <AnimatePresence>
            {openMenu && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-14 right-0 bg-white shadow-xl rounded-xl py-2 w-48 z-50"
              >
                {session ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-gray-900 font-medium">{session.user?.name}</p>
                      <p className="text-gray-500 text-sm truncate">{session.user?.email}</p>
                    </div>
                    <motion.button
                      whileHover={{ x: 5 }}
                      onClick={() => {
                          signOutUser();
                          setOpenMenu(false);
                      }}
                      className="px-4 py-2 w-full text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-2 group"
                    >
                      <FaSignOutAlt className="text-gray-400 group-hover:text-red-500" />
                      <span>Logout</span>
                    </motion.button>
                  </>
                ) : (
                  <motion.button
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      signIn('google');
                      setOpenMenu(false);
                    }}
                    className="px-4 py-2 w-full text-left hover:bg-gray-50 text-gray-700 flex items-center space-x-2 group"
                  >
                    <FaGoogle className="text-gray-400 group-hover:text-blue-500" />
                    <span>Login with Google</span>
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Backdrop */}
      {openMenu && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </>
  )
}

export default Navbar
