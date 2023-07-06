import React, { useEffect, useState } from 'react';
import Banner from '../Utilities/Banner';
import AddTournamentModal from '../Utilities/AddTournamentModal';
import { FaPlus } from 'react-icons/fa';
import { useQuery } from 'react-query';
import ListItems from '../Utilities/ListItems';
import Loading from '../Utilities/Loading';

const AddTournament = () => {
    
  // fetch data using react query 
    const {data ,error,isLoading, refetch} = useQuery('tournaments',fetchTournament);

     if(isLoading){
        return <Loading/>
     }  

     if(error){
        return <div> Error: {error.message} </div>
     }
  
    // fetch  Tournament data 
    async function fetchTournament()  {
        const response = await fetch(`https://gaming-production-ashrafullislam.vercel.app/tournaments`);
        if(!response.ok){
            throw new Error('Failed to fetch  tournament Data')
        }
        return response.json() ;
    }

    return (
        <Banner> 
        <div className='flex justify-around lg:flex-row flex-col-reverse  '>
           <div className=' lg:w-9/12 w-full '>
            <div className='w-full border border-dotted min-h-[80vh] max-h-fit  border-gray-700 mt-5 px-4 pt-3 pb-10'>
            <h3 className=' font-semibold text-3xl text-neutral-100'> Tournament List : </h3>
              {data?.map((tournament) =>  <ListItems key={tournament._id} tournament={tournament} className='text-white'/>  )}
            </div>
           </div>

           <div className='lg:w-1/5 w-11/12 mx-auto '>
           <div className='mt-5'>
           <label htmlFor="add_tournament_modal" className="btn-style flex items-center cursor-pointer gap-2 justify-center"> <FaPlus/> Add Tournament </label>
           </div>
           <AddTournamentModal refetch={refetch}/>
           </div>
       </div>
      </Banner>
    );
};

export default AddTournament;

