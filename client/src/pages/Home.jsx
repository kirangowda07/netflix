import React from 'react';
import Row from '../components/Row';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

const Home = () => {
    const { user, logout } = useAuth();

    return (
        <>
            {/* Navbar */}
            <div className='flex items-center justify-between p-4 z-[100] w-full absolute top-0 bg-transparent'>
                <h1 className='text-red-600 text-4xl font-bold cursor-pointer'>NETFLIX</h1>
                <div>
                    <span className='text-white mr-4'>Welcome, {user?.username}</span>
                    <Button onClick={logout} variant="primary" className="text-sm px-4 py-2">
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Hero */}
            <div className='w-full h-[550px] text-white'>
                <div className='w-full h-full'>
                    <div className='absolute w-full h-[550px] bg-gradient-to-r from-black'></div>
                    <img
                        className='w-full h-full object-cover'
                        src={`https://assets.nflxext.com/ffe/siteui/vlv3/f841d4c7-10e1-40af-bcae-07a3f8dc141a/f6d7434e-d6de-4185-a6d4-c77a2d08737b/US-en-20220502-popsignuptwoweeks-perspective_alpha_website_medium.jpg`}
                        alt='/'
                    />
                    <div className='absolute w-full top-[20%] p-4 md:p-8'>
                        <h1 className='text-3xl md:text-5xl font-bold'>Unlimited movies, TV shows, and more</h1>
                        <div className='my-4'>
                            <button className='border bg-gray-300 text-black border-gray-300 py-2 px-5'>
                                Play
                            </button>
                            <button className='border text-white border-gray-300 py-2 px-5 ml-4'>
                                Watch Later
                            </button>
                        </div>
                        <p className='text-gray-400 text-sm'>Released: 2024</p>
                        <p className='w-full md:max-w-[70%] lg:max-w-[50%] xl:max-w-[35%] text-gray-200'>
                            Watch anywhere. Cancel anytime.
                        </p>
                    </div>
                </div>
            </div>

            <Row title='Trending' fetchKeyword='Marvel' />
            <Row title='Action' fetchKeyword='Action' />
            <Row title='Comedy' fetchKeyword='Comedy' />
            <Row title='Horror' fetchKeyword='Horror' />
            <Row title='Drama' fetchKeyword='Drama' />
        </>
    );
};

export default Home;
