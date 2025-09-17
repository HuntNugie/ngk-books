const API =
  'https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1/book?page=1&year=2023';
const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
const konten = document.getElementById ('konten');

const defaults = function (link) {
  let hasil = [];
  fetch (link).then (response => {
    if(response.ok){
        return response.json ()
    }
  }).then (response => {
    const {books} = response;
    books.map (el => {
      fetch (proxyUrl + el.cover_image).then (res => {
        if(res.ok){
            return res.blob ()
        }
      }).then (res => {
        if(res){
             let imgaeUrl = URL.createObjectURL (res);
        let teks = ` <div class="col-4 mt-3">
                        <div class="card" style="width: 25rem">
                            <img src="${imgaeUrl}" class="card-img-top img-fluid" alt="..." />
                            <div class="card-body">
                                <h5 class="card-title">${el.title}</h5>
                                <p class="card-text">
                                    ${el.summary}
                                </p>
                                <button class="btn btn-primary">Detail buku</button>
                            </div>
                 </div>
         </div>`;
        hasil.push (teks);
        }
      })
      .finally(()=>{
        konten.innerHTML = hasil.join("")
      })
    });
  });
};
// function tampilData(obj){

//    return obj.forEach(el=>{

//     fetch(proxyUrl+el.cover_image)
//     .then(res=> res.blob())
//     .then(res => {
//         const imgaeUrl = URL.createObjectURL(res)

//          })
//     })
// }

defaults(API)
