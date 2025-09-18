const API =
  'https://bukuacak-9bdcb4ef2605.herokuapp.com/api/v1/book';
const proxyUrl = 'https://corsproxy.io/';
const konten = document.getElementById ('konten');

// const defaults = function (link) {
//   let hasil = [];
//   fetch (link).then (response => {
//     if(response.ok){
//         return response.json ()
//     }
//   }).then (response => {
//     const {books} = response;
//     books.map (el => {
//       fetch (proxyUrl + el.cover_image).then (res => {
//         if(res.ok){
//             return res.blob ()
//         }
//       }).then (res => {
//         if(res){
//              let imageUrl = URL.createObjectURL (res);
//         let teks = ` <div class="col-4 mt-3">
//                         <div class="card" style="width: 25rem">
//                             <img src="${imageUrl}" class="card-img-top img-fluid" alt="..." />
//                             <div class="card-body">
//                                 <h5 class="card-title">${el.title}</h5>
//                                 <p class="card-text">
//                                     ${el.summary.slice(0,101)+"...."}
//                                 </p>
//                                 <button class="btn btn-primary">Detail buku</button>
//                             </div>
//                  </div>
//          </div>`;
//         hasil.push (teks);
//         }
//       })
//       .finally(()=>{
//         konten.innerHTML = hasil.join("")
//       })
//     });
//   });
// };
// defaults(API)

// function untuk default saat browser di buka
const defaults = async function (link) {
  const get = await getData (link);
  try {
    let result = await getImage(get);
    const coba = await Promise.all (result);
    konten.innerHTML = renderUI (coba);
  } catch (err) {
    console.log (`error : ${err}`);
  }
};

// function untuk fetch data seluruh api nya
function getData (link) {
  return fetch (link).then (res => res.json ()).then (({books}) => books);
}


// function untuk render ui nya
function renderUI (data) {
  return data
    .map (element => {
      return `<div class="col-12 col-sm-6 col-md-4 mt-3">
  <div class="card h-100">
    <img src="${element.imgBlob}" class="card-img-top img-fluid" style="object-fit: cover; max-height: 400px;" alt=""fallback.jpg"" />
    <div class="card-body d-flex flex-column">
      <h5 class="card-title">${element.el.title}</h5>
      <p class="card-text">
        ${element.el.summary.slice (0, 101) + '....'}
      </p>
      <div class="mt-auto">
        <button class="btn btn-primary w-100">Detail buku</button>
      </div>
    </div>
  </div>
</div>
`;
    })
    .join ('');
}

// function untuk dapat image
function getImage(get){
 return get.map (async el => {
      const imageUrl = await fetch (proxyUrl + el.cover_image);
      const imageBlob = await imageUrl.blob ();
      const imgUrl = URL.createObjectURL (imageBlob);
      if(imageUrl.ok){
        return {el, imgBlob: imgUrl};
      }else{
        return {el,imgBlob:"fallback.jpg"}
      }
    });
}
// untuk searching
const search = async function(){

}




defaults (API);


