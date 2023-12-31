import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCaretDown, FaMinus, FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa';

const TeamKillsCard = ({team, matchId,matches , refetch}) => {
    // console.log(team,'team')
    const { logo, name, tag, players, } = team ;
    const {dead} = matches[0] ;
    const [kills,setlKills]  = useState({})  
    const [totalKills,setTotalKills] = useState(0);
    const [rank, setRank] = useState(matches[0]?.[team?._id] || 0) 
    const [totalPoints, setTotalPoints] = useState(0)

 let pointTable = {
    1: 10,
    2: 6,
    3: 5,
    4: 4,
    5: 3,
    6: 2,
    7: 1,
    8: 1,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 0,
    17: 0,
    18: 0,
    19: 0,
    20: 0,
    21: 0,
    22: 0,
    23: 0,
    24: 0,
    25: 0,

    "": 0,
  };


    // Increase or decrease kills  value  
    useEffect(() => {
      if(players?.length){
        const playerKills = {} 
        players.forEach((player) => playerKills[player?._id] = player?.kills?.[matchId ] || 0)
        setlKills(playerKills);
      }
    },[players])
    
    // Total kills value  
    useEffect(() => {
      let total = 0 
      Object.keys(kills).forEach((kill) => total+=kills[kill] )
      setTotalKills(total)
    },[kills])

   // Set total points 
    useEffect(() => {
     const totalKillsNumber = parseInt(totalKills)
     setTotalPoints(totalKillsNumber + parseInt(pointTable[rank] || 0) )
    //  console.log(totalKillsNumber , rank,'total')
    },[totalKills,rank, pointTable])


    // Send kills value in database 
   function sendKills(playerId,kill)  {
      fetch(`https://pubg-gaming-backend.onrender.com/matches/kills`, {
        method: 'Post',
        headers :  {
          'Content-type':  'application/json'
        },
        body: JSON.stringify({'match-id':matchId,'player-id':playerId, kills:kill})
      })
      .then(res =>  res.json())
      .then(data => {
        console.log(data)
      })
      
   }   
  
   // send player id who is dead
   function sendPlayerDead(dead,matchId,playerId,playerName)  {
    fetch(`https://pubg-gaming-backend.onrender.com/matches/dead`, {
      method: 'Post',
      headers :  {
        'Content-type':  'application/json'
      },
      body: JSON.stringify({'dead':dead, 'player-id':playerId, 'match-id':matchId})
    })
    .then(res =>  res.json())
    .then(data => {
      if(data.success){
        toast(`${playerName} is dead `)
        refetch()
      }
      // console.log(data)
    })
    
 }   

      // Send rank  value in database 
      function sendRank(rank)  {
        fetch(`https://pubg-gaming-backend.onrender.com/matches/rank`, {
          method: 'Post',
          headers :  {
            'Content-type':  'application/json'
          },
          body: JSON.stringify({'match-id':matchId,'team-id':team?._id, rank:rank})
        })
        .then(res =>  res.json())
        .then(data => {
          console.log(data)
        })
        
     }   

    // send total points 
   useEffect(()=>{
    fetch(`https://pubg-gaming-backend.onrender.com/matches/points`, {
      method: 'Post',
      headers :  {
        'Content-type':  'application/json'
      },
      body: JSON.stringify({'match-id':matchId,'team-id':team?._id, points:totalPoints})
    })
    .then(res =>  res.json())
    .then(data => {
      // console.log(data,'points')
    })
   },[totalPoints])

  // handle rank input
   const handleInputNumberChange = (e) => {
    const inputValue = e.target.value ;
    setRank(parseInt(inputValue))
    sendRank(parseInt( inputValue)) 
   }
  
  //  console.log(typeof(rank))
   console.log(typeof(totalPoints))
  //  console.log(typeof(rank) ,'rank ')
    return (
        <div className='text-white  mx-auto '>
        <div className="card rounded-md animated-background border-yellow-300 border shadow-small h-auto lg:w-96 w-96 md:w-80 mt-6" >
          {/* top section  */}
          <div className='flex justify-between'>
          {/* <img src={logo} alt="Shoes" className='w-24 h-24 rounded-sm ' /> */}
          <div className='flex'>
            <div className='h-8 border'>#</div>
            <input type='number' defaultValue={rank} onChange={handleInputNumberChange} className='w-12 h-8 text-black' />
          </div>
         <div className='mt-2'>
            <h1 className='text-lg font-medium'> Team  Name: {name} </h1>
            <h1 className='text-lg font-medium'> Team Tag: {tag} </h1>
         </div>
          <div className='p-2 flex flex-col'>
            <button className='w-8 h-8 border rounded-full hover:bg-gray-600 hover:text-red-500  '> <FaTrashAlt className='mx-auto'/> </button>
            <button className='w-8 h-8 border rounded-full hover:bg-gray-600 hover:text-blue-500 mt-2'> <FaPen className='mx-auto'/> </button>
          </div>
          </div>
        
          <div className="card-body mt-0">
            <h2 className="card-title">
              Players <FaCaretDown/>
            </h2>
             <div className='w-full'>
                {players?.slice(0,4)?.map((player)=> (
                <div key={player?._id} className='grid grid-cols-5 gap-x-2 mt-2 '>
                  <img src={player?.playerImg} className='w-10 h-10  rounded-full'/>  
                  <span className='text-xl col-span-2  '> {player?.name} </span> 
                  <div className='flex justify-between gap-1 items-center  '> 

                  <button className='border  h-6 hover:text-rose-500 ' disabled={dead?.find(x => x === player?._id)} onClick={()=> {
                    const oldKills = structuredClone(kills)
                    oldKills[player._id] -=1
                    setlKills(oldKills) 
                    sendKills (player._id,kills[player._id] -1)
                   }}> <FaMinus/> </button>
                   <span className='w-10 h-6  bg-white text-black text-center'> { kills[player._id]} </span> 
                   <button className="border h-6 hover:text-blue-400 " disabled={dead?.find(x => x === player?._id)} onClick={()=> {
                    const oldKills = structuredClone(kills)
                    oldKills[player._id] +=1
                    setlKills(oldKills) 
                     sendKills (player._id,kills[player._id] +1)
                   } }> <FaPlus/> </button>

                   </div>
                 <div className=' flex  items-center gap-x-2'> <input type='checkbox' className='checkbox-xs' id= {player?._id} defaultChecked={dead?.find(x => x === player?._id)}  onChange={(e)=> {
                  if(e.target.checked){
                    sendPlayerDead(true,matchId,player?._id,player?.name)
                  }
                  else{
                    sendPlayerDead(false,matchId,player?._id,player?.name)
                  }
                 }} /> <span> Dead</span> 
                 </div> 
                 </div>))}
                </div>


             {/* divider  */}
             <div className='w-full h-[2px]  bg-slate-300'>  </div>
             {/* calculate section   */}
             <div className='text-2xl font-semibold text-center'>
              <h1>Total Kills  = {totalKills || 0} </h1>
              <h1> Rank Points = {pointTable[rank] || 0} </h1>
              <h1> Total Points = { totalPoints} </h1>
             </div>
           </div>
         </div>
        </div>
    );
};

export default TeamKillsCard;