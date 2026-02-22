import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Row = ({ title, fetchKeyword }) => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const res = await axios.get(`http://www.omdbapi.com/?apikey=${import.meta.env.VITE_OMDB_API_KEY}&s=${fetchKeyword}&type=movie`);
                if (res.data.Search) {
                    setMovies(res.data.Search);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            }
        };
        fetchMovies();
    }, [fetchKeyword]);

    const scrollLeft = () => {
        var slider = document.getElementById('slider' + title);
        slider.scrollLeft = slider.scrollLeft - 500;
    };

    const scrollRight = () => {
        var slider = document.getElementById('slider' + title);
        slider.scrollLeft = slider.scrollLeft + 500;
    };

    return (
        <>
            <h2 className='text-white font-bold md:text-xl p-4'>{title}</h2>
            <div className='relative flex items-center group'>
                <ChevronLeft
                    onClick={scrollLeft}
                    className='bg-white left-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block text-black'
                    size={40}
                />
                <div
                    id={'slider' + title}
                    className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative'
                >
                    {movies.map((item, id) => (
                        <div key={id} className='w-[160px] sm:w-[200px] md:w-[240px] lg:w-[280px] inline-block cursor-pointer relative p-2 transition-transform duration-300 hover:scale-105'>
                            <img
                                className='w-full h-auto block rounded'
                                src={item.Poster !== 'N/A' ? item.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
                                alt={item.Title}
                            />
                            <div className='absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100 text-white transition-opacity duration-300 flex items-center justify-center'>
                                <p className='white-space-normal text-xs md:text-sm font-bold flex flex-col items-center text-center p-2'>
                                    <span>{item.Title}</span>
                                    <span className='text-gray-400 text-xs mt-1'>{item.Year}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <ChevronRight
                    onClick={scrollRight}
                    className='bg-white right-0 rounded-full absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block text-black'
                    size={40}
                />
            </div>
        </>
    );
};

export default Row;
