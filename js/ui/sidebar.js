export function channelsList (channels){
    const channelList= document.querySelector("#channels-list");
    channelList.innerHTML=``;
    const div=document.createElement('div');



    channels.forEach(element => {
        const card =document.createElement("div");
        card.className='card';
        card.innerHTML=`
        
         <div class="flex items-center gap-3">
      <img src="${element.previewImage}" class="w-30 h-10" alt="${element.name}" />
        <p class="text-sm text-gray-400">${element.channelNumber}</p>
        <p class="text-lg font-bold text-gray-300>${element.name}</p>
       </div> `;
        
        channelList.appendChild(card);
    });

}


//  <div id="channels-list" class="flex-1 flex flex-col gap-3 pr-2 overflow-y-auto ">
//                 <!-- <div class="flex-1 flex flex-col items-center p-3 border-y border-gray-800  cursor-pointer">
//                     <div class="flex items-center gap-3">
//                         <img src="assets/images/2m.png" alt="2m" class="w-30 h-10">
//                         <div>
//                             <p class="text-sm text-gray-400">N° 1000</p>
//                             <p class="text-lg font-bold text-gray-300">2M</p>
//                         </div>
//                     </div>
//                 </div>