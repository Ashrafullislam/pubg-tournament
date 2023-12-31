import React, { useContext, useEffect, useState } from 'react';
import DisplayLayout from '../../Layout/DisplayLayout';
import { useQuery } from 'react-query';
import { AuthContext } from '../../Context/AuthProvider';
import Loading from '../Utilities/Loading';
import MvpCard from '../Utilities/MvpCard';

const OverAllMvp = () => {
    const {selectedMatchId , selectedStageId} = useContext(AuthContext)
    const {data ,error,isLoading, refetch} = useQuery('overall', fetchOverAllData);
    const  [bestPlayer,setBestPlayer] = useState([])
  
  //  fetch  Tournament data 
   async function fetchOverAllData()  {
       if(selectedStageId){
        const response = await fetch(`https://pubg-gaming-backend.onrender.com/standings/overall?stage-id=${selectedStageId}`);
       if(!response.ok){
           throw new Error('Failed to fetch  overall data')
       }
       refetch()
       return response.json() ;
       }
   }
  
 
   useEffect(()=>  {
    if(data){
        const playersArr = data?.map(player => player?.kills  || 0)
        const maxKills = Math.max(...playersArr)
        const BestPlayer = data?.find(x  => x?.kills === maxKills)
        setBestPlayer(BestPlayer)
       }
   },[data])
    
    // console.log(data,'best player')

        if(isLoading){
            return <Loading/>
        }  

        if(error){
            return <div> Error: {error.message} </div>
        }

    return (
        <DisplayLayout>  
         <div>
           <MvpCard BestPlayer={bestPlayer}/>  
         </div>
        </DisplayLayout>
    );
};

export default OverAllMvp;