const elementSM = document.querySelectorAll('.social-media-buttons a')
const optionsSM = {
    trigger: 'hover focus',
    placement: 'top',
    toggle: 'popover',
    customClass: 'social-media-popover',
    offset: [5, -10],
    delay: { "show": 250, "hide": 100 }
}
elementSM.forEach(element => {
    const popover = new bootstrap.Popover(element, optionsSM)
})

let items = [];
const urls = ['../Items/Consumables.json', '../Items/Gadgets.json', '../Items/Souls.json', '../Items/Weapons.json', '../Items/Weapons.json', '../Items/KeyItems.json', '../Enemies/CommonEnemies.json', '../NPCs/Vendors.json']; // Add more URLs as needed

Promise.all(urls.map(url => fetch(url)))
   .then(responses => Promise.all(responses.map(response => response.json())))
   .then(dataArrays => {
       items = dataArrays.flat();

        const elementNM = document.querySelectorAll('.item-popover')
        const optionsNM = {
            content: '',
            trigger: 'click',
            placement: 'auto',
            toggle: 'popover',
            customClass: 'item-popover-content',
            sanitize: false,
            html: true
        }
        elementNM.forEach(element => {
            const id = element.id;
            const item = items.find(item => item.title === id);
            if (item) {
                const carouselId = `carousel-${item.title.replace(/ /g, "-").replace(/'/g, "").replace(/\(|\)/g, "")}`;
                const locationId = `card-location-${item.title.replace(/ /g, "-").replace(/'/g, "").replace(/\(|\)/g, "")}`;
                
                const containerClass = item.imageType === 'fullsize' ? 'carousel slide fullsize-image-container fullsize-popover-container' : 'carousel slide item-card-image-container';
                const imageClass = item.imageType === 'fullsize' ? 'd-block mx-auto fullsize-popover-image' : 'd-block w-100 mx-auto item-card-image';

                optionsNM.content = `
                    <div class="card item-card-popover h-100 DtgA-Title-Text" style="max-width: 18em; max-height: 30em;">
                        <div class="row">
                            <div class="col">
                               <div class="${containerClass}" id="${carouselId}">
                                   <div class="carousel-inner">
                                       ${item.imageSrc.map((image, index) => `
                                           <div class="carousel-item ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
                                             <img src="../${item.directory}/${image}" class="${imageClass}" aria-label="Item Image">
                                           </div>
                                       `).join('')}
                                   </div>
                               </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                              <div class="col">
                                  <h3 class="card-title item-card-title">${item.title}</h3>
                              </div>
                            </div>
                            <div class="row">
                              <div class="col">
                                  <p class="card-text DtgA-Standard-Text">${item.description}</p>
                              </div>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                console.error('Item with ID "${id}" not found in json files');
            }
            const popover = new bootstrap.Popover(element, optionsNM)
        })
        document.addEventListener('click', function (event) {
           // Check if the click event's target is the popover
           if (!elementNM[0].contains(event.target) ) {
               // If it is, hide the popover
               elementNM.forEach(element => {
                   const popover = bootstrap.Popover.getInstance(element);
                   if (popover && popover._isShown) {
                       popover.hide();
                   }
               });
           }
        });
    });
