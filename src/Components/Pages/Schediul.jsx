import React, { useContext, useEffect, useState } from 'react';
import DisplayLayout from '../../Layout/DisplayLayout';
import { AuthContext } from '../../Context/AuthProvider';
import { useQuery } from 'react-query';
import Loading from '../Utilities/Loading';
import SingleStylishCard from '../Utilities/SingleStylishCard';
import '../../assets/Style/style.css'
import { useSearchParams } from 'react-router-dom';
const Schediul = () => {
    const {selectedStageId,setSelectedTournamentid, setSelectedStageId, setSelectedMatchId} = useContext(AuthContext)
    const [noData,setNoData] = useState('');
    const [searchParams] = useSearchParams();


    useEffect(() => {
      const tournamentId = searchParams.get('tournamentId');
      const stageId = searchParams.get('stageId');
      const matchId = searchParams.get('matchId');

      setSelectedTournamentid(tournamentId);
      setSelectedStageId(stageId);
      setSelectedMatchId(matchId);
    

      // set on localstorage
      localStorage.setItem('tournamentId', tournamentId);
      localStorage.setItem('stageId', stageId);
      localStorage.setItem('matchId', matchId);

    }, [])

 










    // get match details data and show it 
    const {data, isLoading, refetch ,error} = useQuery('match', async () => {
      
        if(!selectedStageId){
            setNoData(" Please select tournament and group")
        }else{
            const response = await fetch(`http://localhost:8000/matches?stage-id=${selectedStageId}`);
            if(!response.ok){
                throw new Error("Failed to fetch match data ")
            }
            refetch()
            return response.json();
            
        }
      
    }) 
   if(isLoading){
    return <Loading/>
   }
   if(error){
    return <div> {error.message} </div>
   }

    return (
        <DisplayLayout>
            <div className='bg-linear-rose '>
             <h1 className='text-4xl text-center font-semibold '> Schedule </h1>
             <h1>
                {/* {noData && <span className='font-semibold'> {noData} </span>} */}
             </h1>
             <div className='grid lg:grid-cols-3  md:grid-cols-2 grid-cols-1 pb-10  mt-4 gap-x-5 gap-y-8'>
                {data?.map((match) => <SingleStylishCard key={match?._id} match={match} > </SingleStylishCard>)}
             </div>
            </div>
        </DisplayLayout>
    );
};

export default Schediul;